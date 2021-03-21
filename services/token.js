const jwt = require('jsonwebtoken')


const verifyToken = (token) => {
        //Check if token is provided
        if(!token) return {
            message: 'Access Denied',
            success: false
        };
    
        //verify and get decoded verified content
        try{
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            // Check if token is expired
            var currentDate = new Date();
            if(verified.expiresIn < currentDate.getTime()/100)
            return{
                message: 'Token expired',
                success: false
            }
            return verified;
        }
        catch(e){
            return {
                message: 'Invalid Token',
                success: false
            };
        }
}

const createToken = async (_id, expiration) => {
    const token = await jwt.sign({
        _id: _id,
        expiresIn: expiration
    },  process.env.TOKEN_SECRET)
    return token;
}

// TODO: check if token is expired
    // const isTokenValid = async (token) =>
    // {
    //     const 
    // }


module.exports = {
    verifyToken,
    createToken
}