
const nodemailer = require("nodemailer");
const handlebars = require('nodemailer-express-handlebars')
    // send key embedded in email to user

    const transpoter = () =>
    {
        const transporter = nodemailer.createTransport(
            {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: 
                    {
                        user: process.env.Email, 
                        pass: process.env.Password, 
                    },
            }
        );
    
        transporter.use('compile', handlebars(
            {
                viewEngine: 
                {
                    extName: ".hbs",
                    partialsDir: 'views/emails/',
                    defaultLayout: false,
                },
                viewPath: 'views/emails',
                extName: ".hbs",
            }
    
        ));
        return transporter;
    }

    const sendForgotPassEmail = async (sender, recipient, key) => {
              // send mail with defined transport object
        let transporter = transpoter();
        let info = await transporter.sendMail({
            from: sender, // sender address
            to: recipient, // list of receivers
            subject: "Forgot Password", // Subject line
            text: ``, // plain text body
            context: {
                key: key
            },
            template: 'forgot_password'
        })

        // return delivery status
        return info;
    }

    const sendConfirmationEmail = async (sender, recipient, key) => {
              // send mail with defined transport object
        let transporter = transpoter();
        let info = await transporter.sendMail({
            from: sender, // sender address
            to: recipient, // list of receivers
            subject: "Confirmation", // Subject line
            text: ``, // plain text body
            context: {
                key: key
            },
            template: 'confirmation_email'
        })

        // return delivery status
        return info;
    }

module.exports = {
    sendForgotPassEmail, 
    sendConfirmationEmail
}