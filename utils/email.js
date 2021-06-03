const nodemailer=require('nodemailer');
const pug=require('pug');
const htmlToText = require('html-to-text');


async function sendMail(template,options)
{
    const transporter=nodemailer.createTransport(
    {
        service:'Gmail',
        // host:process.env.EMAIL_HOST,
        // port:process.env.EMAIL_PORT,
        auth:
        {
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        },
        logger:true,
        debug:true
    });
    
    const html=pug.renderFile(`${__dirname}/../views/email/${template}.pug`,
    {
        url:options.url,
        message:options.message
    });

    const mailOptions=
    {
        from:'ShareThought <kriti@shareThought.io>',
        to:options.email,
        subject:options.subject,
        text:options.message,
        html,
        text:htmlToText.fromString(html)
    }



    await transporter.sendMail(mailOptions);
}

module.exports=sendMail;