require("dotenv").config();
const express = require("express");
const expressJwt = require("express-jwt");
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");
const typeDefs = require("./src/graphql/typeDefs");
const resolvers = require("./src/graphql/resolvers");
const initMongoose = require("./src/config/mongooseConfig");
const { permissionShield } = require("./src/graphql/authorization/permissions");
const multer = require("multer");
const cors = require("cors");
const uuidv4 = require("uuid").v4;

const app = express();
async function startServer() {
  //

  app.use(
    expressJwt({
      secret: process.env.ACCESS_TOKEN_SECRET,
      algorithms: ["HS256"],
      credentialsRequired: false,
    })
  );

  // http://localhost:3000
  app.use(cors({ origin: "*", credentials: true }));

  const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./complaints");
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  const upload = multer({
    storage: fileStorageEngine,
    limits: { fileSize: 100 * 1024, fieldNameSize: 50 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "application/pdf") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Provide valid input file"));
      }
    },
  });
  const singleUpload = upload.single("complaint");

  const apolloServer = new ApolloServer({
    schema: applyMiddleware(
      makeExecutableSchema({ typeDefs, resolvers }),
      permissionShield
    ),
    context: ({ req }) => {
      const user = req.user || null;
      return { user };
    },
  });
  await apolloServer.start();
  //

  //

  const auth = (req, res, next) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    } else {
      next();
    }
  };

  app.use("/uploads", [auth, express.static("complaints")]);

  app.post("/single", (req, res) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }
    if (req.user["http://localhost:4000/graphql"].role === "ADMIN") {
      throw new Error("Unauthorized");
    }
    singleUpload(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        console.log("multer error", error);
        res.sendStatus(409);
      } else if (error) {
        console.log(" error");
        res.sendStatus(409);
      } else {
        res.send(req.file.path);
      }
    });
  });

  apolloServer.applyMiddleware({ app });

  //

  //
  await initMongoose();

  app.listen(process.env.port || 4000, () =>
    console.log("Runnng on port 4000")
  );
  //
}

startServer();
