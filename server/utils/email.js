'use strict';
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "bethany.ritchie@ethereal.email", // generated ethereal user
        pass: "V98QwKEHVqafcXnrJy", // generated ethereal password
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
        logger.error(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

const sendEmail = async (mailOptions) => {

    try {

        mailOptions.from = "bethany.ritchie@ethereal.email";

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error(error);
            } else {
                logger.info('Email sent: ' + info.response);
                return true;
            }
        });
    }
    catch (e) {
        throw e;
    }
}

module.exports = {

    otpTokenEmail: async (data) => {

        // var template = await getHTMLContentFromFile(Const.templatename.TWO_FACTOR_VERIFICATION.KEY, data.language);
        // data = await getDynamicVaribleFromDB(data);
        // template.body = await replaceVariables(template.body, data)

        var mailOptions = {
            to: data.email,
            subject: "OTP Verification",
            html: `<p> OTP is: ${data.otp}</p>`
        };

        try {
            await sendEmail(mailOptions);
            return true;

        } catch (e) {
            throw e
        }
    },

};
