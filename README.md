# JWT Authentication
This is a JWT AUTH API that can be coupled with any Front-End framework.
This was developed with Node js, express, mongoose, nodemailer, Jsonwebtoken, bcrypt.js, hapi joi and handlebars

# Functionalities
- Register user: this includes sending confirmation email to user
- Confirming user account through the email
- Login user and provide JWT token
- Forgot Password: This include sending a forgot passsword email to user
- and lastly provide an interface for user to change password after clicking the link in the email
# Download
`git clone https://github.com/edijman/jwt_auth` 
# INSTALL 
## Install dependencies
```bash
npm install
```

## Configuration
create a file called .env and place it in the root directly. This file would contain your database url, token secret and your email service credentials, Copy, paste and fill the settings below to the .env file. you can change the two token expiration duration to any length you want
```.env
DB_Connect = url to your mongodb database

TOKEN_SECRET = 'CREATE A LONG RANDOM TOKEN AND PLACE IT HERE'

Email = 'YOUR_GMAIL_EMAIL'

Password = 'YOUR_PASSWORD'

loginTokenDuration = '7d' 

confirmationTokenDuration = '1d' 
```
## Start server
```bash
npm start
```
The server runs at port 4000

# API Endpoints
The main AUTH route is located [here](https://github.com/edijman/jwt_auth/blob/main/routes/auth.js)
### Register Route
```node
router.post('/register', registerController)
```
- This route expect a request with 'firstName', 'lastName', 'email', 'password' in the request body and also perform validation with can be modified [here](https://github.com/edijman/jwt_auth/blob/main/validation.js)
- When the registration is successful, it sends an email with the confirmation link to the user, the [email](https://github.com/edijman/jwt_auth/blob/main/views/emails/confirmation_email.hbs) looks like this(see below) and can be modified however you like.   
![Confirmation email](https://github.com/edijman/jwt_auth/blob/main/images/confirm_acc.png)

### Account Confirmation Route
```node
router.get('/confirm-account/:key', confirmAccountController);
```
- The link in the email leads to the account confirmation route, when clicked on, it's confirmed the account and user can login. *Note User can not login without confirming the account and the key validation dedpend on the 'confirmationTokenDuration' in the .env file.

### Login Route
```node
router.post('/login', loginController)
```
- This acccepts the valid email and password, if the credentials are valid, it provides the token and id that can be used in future requests. *Note the token validation period depends on the 'loginTokenDuration' provided on the .env file
- It also performs validation that can be modified [here](https://github.com/edijman/jwt_auth/blob/main/validation.js)

### Forgot Password
```node
router.post('/forgot-password', ForgotPassContoller)
```
- In case the user forgot their password, this route accept a valid email address and send a forgot password [email](https://github.com/edijman/jwt_auth/blob/main/views/emails/forgot_password.hbs) to the user.
![forgot password](https://github.com/edijman/jwt_auth/blob/main/images/forgot_pass.png)

### Change Password : get route
```node
router.get('/change-password/:key', (req, res) =>{
    if(!req.params.key) return res.status(400).send({
        message: 'Key not provided', 
        success: false
    })

    return res.render('change_pass', {key: req.params.key})
});
```
- This route would be the link the forgot password email. if the key has not expired, it would redirect the user to a form to change the password, as always this also perform form validation. 
![change password](https://github.com/edijman/jwt_auth/blob/main/images/change_pass.png)
- If everything goes well, it post the password to the last route

### Change password: Post Route
- This changes the password provided by the form above.
```node
router.post('/change-password', changePasswordController);
```
