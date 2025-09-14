const { body } = require('express-validator');

// Registration validation
const registerValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name should be at least 3 characters long'),

    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email'),

    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Include at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Include at least one lowercase letter')
        .matches(/\d/).withMessage('Include at least one number')
        .matches(/[^A-Za-z0-9]/).withMessage('Include at least one special character'),

    body('contact_number')
        .notEmpty()
        .withMessage('Contact number is required')
        .isMobilePhone()
        .withMessage('Please enter a valid contact number'),

    body('address')
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ min: 10 })
        .withMessage('Address should be at least 10 characters long'),
];

module.exports = {
    registerValidation
};