const router = require('express').Router();
const { registerController, loginController, ForgotPassContoller, confirmAccountController, changePasswordController } = require('../controllers/auth.controller')


//Register route
router.post('/register', registerController)

//Login route
router.post('/login', loginController)

//Forgot password route
router.post('/forgot-password', ForgotPassContoller)

// confirm account route
router.get('/confirm-account/:key', confirmAccountController);

//Change password route
router.get('/change-password/:key', (req, res) =>{
    if(!req.params.key) return res.status(400).send({
        message: 'Key not provided', 
        success: false
    })

    return res.render('change_pass', {key: req.params.key})
});

router.post('/change-password', changePasswordController);


module.exports = router;