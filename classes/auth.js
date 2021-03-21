const {registrationvalidation, loginValidation} = require('../validation');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const ObjectId = require('mongodb').ObjectId; 

module.exports = class UserClass
{
    constructor(request){
        this.request = request
    }

    //validate registration req data
    validateRegData(){
        const {error} = registrationvalidation(this.request.body)
        if(error) return {
            message: error.details[0].message
        };

     }
     
    // validate login req dat
    validateLoginData(){
        const {error} = loginValidation(this.request.body);
        if(error) return {
            message: error.details[0].message, 
            success: false
        };
    }

     async emailExist() {
        try{
            const user = await User.findOne({email: this.request.body.email})
            // console.log(user)
            if(user) return {
                    user: user,
                    message: 'Email Exist'
            }

            return {
                message: 'Email Does not Exist'
            }
        }
        catch(err){
            return {
                message: err.message
            }
        }
    } 

    async createUser(){
        //Hash password
        // console.log(this.request.body)
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(this.request.body.password,  saltRounds);
       //Create new User
       const user = new User({
           firstName: this.request.body.firstName,
           lastName: this.request.body.lastName,
           email: this.request.body.email,
           password: hashPassword
       });
    
       //Save User
       try{
            const savedUser = await user.save();
            // sendConfirmEmail(savedUser);
            return {
                _id: savedUser._id, 
                message: 'User Registered',
                email: savedUser.email
            }
       }
       catch(e){
           return {
                message: e.message
           }
       }
    }

    
   async validatePassword(password){
        try{
            // Check if password is correct
            const isValid = await bcrypt.compare(this.request.body.password, password)
            return {
                isValid: isValid,
                message: 'Valid password'
            }
        }
        catch(e){
            return {
                message: e.message,
                isValid: false
            }
        }
    }

    async checkUserID(userID){
        try{
            const user = await User.findOne({_id: userID});
            if(user)
            return {
               status: true
            }
        }
        catch(e){
            return {
                message: e.message,
                status: false
            }
        }
    }

    async updateConfirmation(userID){
        try{
            const user = await User.findByIdAndUpdate({_id: userID}, {confirmed: true})
            if(user) return {
                message: 'Account confirmed',
                status: true
            }
            return{
                message: 'Unable to confirm account',
                status: false
            }
        }
        catch(e){
            return {
                message: e.message,
                status: false
            }
        }
    }

    async changePassword(userID){
        try{
            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(this.request.body.password,  saltRounds);
            const user = await User.findByIdAndUpdate({_id: userID}, {password: hashPassword})
            if(user) return {
                message: 'Password updated',
                status: true
            }
            return{
                message: 'password not change',
                status: false
            }
        }
        catch(e){
            return {
                message: e.message,
                status: false
            }
        }
    }

}
