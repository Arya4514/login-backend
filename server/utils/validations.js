/* eslint-disable camelcase */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { jwt_secret, jwt_issuer } = process.env;
const TokenGenerator = require('uuid-token-generator');
const otpGenerator = require('otp-generator')
const DateDiff = require('date-diff');
const moment = require('moment');

/**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = password => bcrypt.hashSync(password, salt);

/**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};

/**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
const isValidEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};

/**
   * validatePassword helper method
   * @param {string} password
   * @returns {Boolean} True or False
   */
const validatePassword = (password) => {
    if (password.length <= 5 || password === '') {
        return false;
    } return true;
};
/**
   * isEmpty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
const isEmpty = (input) => {
    if (input === undefined || input === '') {
        return true;
    }
    if (input.replace(/\s/g, '').length) {
        return false;
    } return true;
};

/**
   * empty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
const empty = (input) => {
    if (input === undefined || input === '') {
        return true;
    }
};

/**
   * Generate Token
   * @param {string} id
   * @returns {string} token
   */
const generateUserToken = (email) => {
    const token = jwt.sign({ email },
        jwt_secret, { expiresIn: 60 * 60 * 24, issuer: jwt_issuer },
    );
    return token;
};

const generateSessionToken = () => {
    const token = new TokenGenerator(256, TokenGenerator.BASE62);
    return token.generate();
}

const generateOTP = () => {
    return otpGenerator.generate(5, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
}

const dateDifference = (date1, date2) => {
    var startTime = moment(date2);
    var endTime = moment(date1);

    return endTime.diff(startTime, 'seconds');
}

const decodeJWTToken = (token) => {
    options = {
        expiresIn: 60 * 60 * 24,
        issuer: jwt_issuer
    };
    return jwt.verify(token, jwt_secret, options);
}

const getUTCDate = () => {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    return new Date(now_utc);
}

const getTodayDateWith1DayPlus = (date) => {
    return moment(new Date(date)).format('YYYY-MM-DD')
}

const getUTCDateTime = () => {
    var d1 = new Date();
    return d1.toUTCString();
}

const getUTCDateInString = () => {
    var d1 = new Date();
    return moment(d1).format('YYYYMMDD');
    // return d1.format('YYYYMMDD');
}

const getTodayDate = () => {
    var d1 = new Date();
    return moment(d1).format('YYYY-MM-DD');
}


let validations = {
    hashPassword,
    comparePassword,
    isValidEmail,
    validatePassword,
    isEmpty,
    empty,
    generateUserToken,
    generateSessionToken,
    generateOTP,
    dateDifference,
    decodeJWTToken,
    getUTCDate,
    getUTCDateTime,
    getUTCDateInString,
    getTodayDate,
}

module.exports = validations;
