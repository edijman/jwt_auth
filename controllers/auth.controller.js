//Import Service
const { createToken, verifyToken } = require('../services/token');
const { sendForgotPassEmail, sendConfirmationEmail } = require('../services/mailer')
// Import Auth class
const Auth = require('../classes/auth');
const { request } = require('express');
const e = require('express');

const registerController = async (req, res, next) =>{
    try{
        const auth = new Auth(req);
        const invalidFormData = await auth.validateRegData();

        // Validate form data
        if(invalidFormData) return res.status(400).send({
            message: invalidFormData.message,
            success: false
        })

        //Check if email exist
        const emailExist = await auth.emailExist();
        if(emailExist.user) return res.status(401).send({ 
                message: emailExist.message,
                success: false
        })

        // Create User
        const savedUser = await auth.createUser();
        console.log(savedUser)
        // Send confirmation email with key if user was created
        if(savedUser._id){

            //create token from user id
            const key = await createToken(savedUser._id, process.env.confirmationTokenDuration);

            //send confirmation email with token
            sendConfirmationEmail(process.env.Email, savedUser.email, key);
            return res.status(200).send({
                message: savedUser.message,
                success: true
            })
        }
    }
    catch(e){
        return res.status(404).send({
            message: e.message,
            success: false
        });
    }
    next();
}

const loginController = async (req, res, next) => {
    try{
        const auth = new Auth(req);
        // Validate form data
        const invalidFormData = await auth.validateLoginData();
        if(invalidFormData) return res.status(400).send({
            message: invalidFormData.message,
            success: false
        });

        //Check if email does not exist
        const isExist = await auth.emailExist();
        if(!isExist.user) return res.status(401).send({ 
                message: emailExist.message,
                success: false
        })
        
        // Check if user is confirmed
        if(!isExist.user.confirmed) return res.status(401).send({
            message: 'Account not confirmed yet, please check your email'
        })

        const isPassValid = await auth.validatePassword(isExist.user.password);
        if(!isPassValid.isValid) return res.status(401).send({
            message: 'Incorrect credential',
            success: false
        });

        if(isPassValid.isValid){
            //create token from user id
            const token = await createToken(isExist.user._id, process.env.loginTokenDuration);
    
            return res.status(200).send({
                _id: isExist.user.id, 
                token: token,
                message: isPassValid.message
            })
        }
    }
    catch(e){
        return res.status(401).send({
            message: e.message,
            success: false
        })
    }
    next();
}

const ForgotPassContoller = async (req, res, next) =>{
 
    //If email exist, create key with user id and send to provided email address
    try{
        const auth = new Auth(req);
        //Check if email exist
        const isExist = await auth.emailExist();
        if(!isExist.user) return res.status(401).send({ 
            message: isExist.message,
            success: false
        })

        if(isExist.user){
            //create token from user id
            const token = await createToken(isExist.user._id, process.env.confirmationTokenDuration);
    
            sendForgotPassEmail(process.env.Email, isExist.user.email, token);
            return res.status(200).send({
                status: true,
                message: 'Message sent'
            });
        }
    }
    catch(e){
        return res.status(401).send({
            message: e.message,
            success: false
        })
    }
    next();
}

const confirmAccountController = async (req, res, next) => {  

    try{
        const userToken = verifyToken(req.params.key)
        if(!userToken._id) return res.status(400).send(userToken);
    
        const auth = new Auth(req);
       const idStatus = await auth.checkUserID(userToken._id);
       console.log(idStatus.status)
        if(idStatus.status){
    
            const confirmationStatus = await auth.updateConfirmation(userToken._id);
            if(!confirmationStatus.status) return res.status(400).send(confirmationStatus);
    
            const token = await createToken(userToken._id, process.env.confirmationTokenDuration);
            return res.status(200).send({
                message: 'Account confirmed',
                token: token,
                _id: userToken._id
            })
        }
        else{
            res.status(401).send({
                message: 'Unable to confirm Account',
                status: false
            })
        }
    }
    catch(e){
        res.status(401).send({
            message: e.message,
            status: false
        })
    }
    next();
}


const changePasswordController = async (req, res, next) => {
    try{
        if(req.body.password.length <6)
            return res.status(400).send({
                message: 'Password must be at least 6 characters',
                success: false
            });

            console.log(req.body.key);
            const userToken = verifyToken(req.body.key);
            if(!userToken._id) return res.status(400).send(userToken);

            const auth = new Auth(req);
            const changeStatus = await auth.changePassword(userToken._id);
            if(changeStatus.status){
                return res.status(200).send(changeStatus)
            }
            else{
                return res.status(400).send(changeStatus)
            }
    }
    catch(e){
        res.status(400).send({
            message: e.message, 
            success: false
        })
    }
    next();
}


module.exports = {
    registerController,
    loginController,
    ForgotPassContoller,
    confirmAccountController,
    changePasswordController
}