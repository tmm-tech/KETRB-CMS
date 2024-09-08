const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },

    })

//Account Creation
exports.sendAccountCreation = (recipient, password, fullname,roles) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'Account Confirmation',
        html: `<html>

        <head>
            <title>Account Created Confirmation</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 0;
                    padding: 0;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                
                h1 {
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                
                p {
                    margin-bottom: 10px;
                }
                
                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                
                li {
                    margin-bottom: 10px;
                }
                
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #2A3F54;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                
                .btn:hover {
                    background-color: #0069d9;
                }
            </style>
        </head>
        
        <body>
            <div class="container">
                <h1>Account Confirmation</h1>
                <p>Dear ${fullname},</p>
                <p>We are pleased to inform you that your account has been successfully created. Please find below your login credentials:</p>
                <ul>
                    <li><strong>Username: </strong> ${recipient}</li>
                    <li><strong>Password: </strong>${password}</li>
                    <li><strong>Role: </strong>${roles}</li>
                </ul>
                <p>You can now use your login credentials to access your KETRB CMS account.</p>
                <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
                <a href="https://ketrb-cms-one.vercel.app/" class="btn">Go to Website</a>
            </div>
        </body>
        
        </html>`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Account Creation sent: ' + info.response);
        }
    });
};