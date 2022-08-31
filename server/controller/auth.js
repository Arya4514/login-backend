require('dotenv').config()
const email = require('../utils/email')
const utils = require('../utils/validations')


let user = [{
    email: "test@gmail.com",
    password: utils.hashPassword("test@123"),
    userName: "test",
    name: "Test John",
    bio: "Hi, I am Test John professional web developer"
}]


let otp = []

module.exports = {
    login: async (req, res) => {
        try {
            let data;

            for (let i = 0; i < user.length; i++) {
                const element = user[i];
                if (element.email == req.body.email) {
                    data = element
                    break
                }
            }

            if (!data) {
                return res.status(404).send({ error: true, message: "User not found" })
            }

            if (!utils.comparePassword(req.body.password, data.password)) {
                return res.status(404).send({ error: true, message: "Password Mismatch please try again" })
            }

            const sessionToken = utils.generateSessionToken();
            const generateOTP = utils.generateOTP();
            var VerifyOtp = {};
            VerifyOtp.session_token = sessionToken;
            VerifyOtp.is_active = true
            VerifyOtp.email = req.body.email;
            VerifyOtp.otp = generateOTP;
            VerifyOtp.otp_generate_time = utils.getUTCDateTime();

            console.log(VerifyOtp)

            otp.push(VerifyOtp)

            await email.otpTokenEmail({ email: req.body.email, otp: VerifyOtp.otp })

            return res.status(200).send({ error: false, message: "Check email for otp", sessionToken });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: true, message: "Internal server error" });
        }
    },


    signup: (req, res) => {
        try {
            let existingUser;

            for (let i = 0; i < user.length; i++) {
                const element = user[i];
                if (element.email == req.body.email) {
                    data = element
                    break
                }
            }

            if (existingUser) {
                return res.status(403).send({ error: true, message: "User with same name exist" })
            }

            let data = {
                email: req.body.email,
                name: req.body.name,
                password: utils.hashPassword(req.body.password),
                bio: req.body.bio
            }
            user.push(data)
            return res.status(200).send({ error: false, message: "Login successfully", token });
        } catch (error) {
            return res.status(500).send({ error: true, message: "Internal server error" });
        }
    },

    verifyPersonalPin: async (req, res) => {

        if (!req.body.otp) {
            return res.status(401).json({ error: true, message: 'Please provide valid otp' });
        }
        try {
            let token = {}

            for (let index = 0; index < otp.length; index++) {
                const element = otp[index];
                if (element.session_token == req.headers.sessiontoken && element.is_active) {
                    token = element
                    break
                }
            }

            console.log("token >>" + JSON.stringify(token));

            if (!token) {
                return res.status(401).send({ error: true, message: "session token is not valid" });
            }
            else if (token) {

                var currentDate = new Date(new Date().toUTCString());
                var otpGenerateDate = new Date(new Date(token.otp_generate_time).toUTCString());
                const dateDifference = utils.dateDifference(currentDate, otpGenerateDate);

                if (token.otp != parseInt(req.body.otp)) {
                    return res.status(401).send({ error: true, message: "provide valid otp" });
                }
                else if (dateDifference > 600) {
                    return res.status(401).send({ error: true, message: "Otp expired!" });
                }
                else {
                    otp = otp.map(e => e.email !== token.email);

                    let userData = {}

                    for (let i = 0; i < user.length; i++) {
                        const element = user[i];
                        if (element.email == req.body.email) {
                            userData = element
                            break
                        }
                    }

                    token = utils.generateUserToken(userData.email);

                    return res.status(200).send({ error: false, token });
                }
            }
        } catch (err) {
            console.log(err)
            return res.status(500).send({ error: true, message: "Internal server error" });
        };
    }
}