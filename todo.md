# models

1. user

   - firstName
   - lastName
   - email
   - password
   - role (member, admin)

   common actions

   - register
   - login

   admin authorizations

   - display member accounts
   - disable members account
   - view members feedback

   member authorization

   - create feedback
   - read own feedback

2. feedback
   - file (optional)
   - comment
   - user

// store user when logged in and apply authorizaton for resolvers

1. disabling users only for admin
2. creating feedback only for memebers
3. reading others feedback only for admin
4. reading own feedback only for member
5. viewing other users only for admin
6. registering only for member

// implement a get request error route fallback

// unique email (done)
// strong password (done)
// loggedin user must not again be logged in (done)
//
// on logout find a way to invalidate token
// enable member account

1. refresh token so client stores the token as they normally would (refresh token has minimum expiryDate)

# security layers done

1. file

- error handling on backend (send status on error)
- only member can upload
- only pdf validation
- file size limit (100 kb), field name limit (50)
- random file name
- todo (restrict direct access to files, change directory to outside of server, scan files)

2. csrf

- cors used
