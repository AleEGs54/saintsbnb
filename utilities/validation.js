// utilities/validation.js
const { body, validationResult } = require('express-validator');

// Validation rules for user creation/update (restricted for clients)
const registrationValidationRules = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Name is required.')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name must contain only letters and spaces.'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('A valid email is required.')
        .normalizeEmail(), // Sanitizes email (e.g., lowercase)
    body('password') // Add password validation for registration (if not coming from OAuth)
        .optional() // Make password optional, as OAuth users might not have one
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/,
        )
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ),
    body('phone')
        .optional() // Phone is optional
        .isMobilePhone('any') // Validates as a mobile phone number
        .withMessage('A valid phone number is required.'),
    body('role')
        .trim()
        .isIn(['guest', 'host']) // Only allow guest or host roles for clients creation
        .withMessage('Role must be guest or host.')
        .toLowerCase(),
];

// Validation rules for admin user creation (allows any role)
const adminUserValidationRules = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Name is required.')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name must contain only letters and spaces.'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('A valid email is required.')
        .normalizeEmail(),
    body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/,
        )
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ),
    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('A valid phone number is required.'),
    body('role')
        .trim()
        .isIn(['guest', 'host', 'admin']) // Allow creation of users with any role
        .withMessage('Role must be guest, host, or admin.')
        .toLowerCase(),
];

// Validation rules for local login (email and password)
const loginValidationRules = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('A valid email is required for login.')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required for login.'),
];

// Middleware to handle validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next(); // If no errors, proceed to the next middleware/controller
    }
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(400).json({
        errors: extractedErrors,
        message: 'Validation failed. Please check your input.',
    });
};

// Validation rules for housing posts
const housingValidationRules = [
    body('rooms')
        .isInt({ min: 1 })
        .withMessage('Number of rooms must be a positive integer.'),
    body('availability')
        .isBoolean()
        .withMessage('Availability must be a boolean value (true/false).')
        .optional(), // Optional on update, but required for creation (handled by schema default)
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number.'),
    body('address')
        .trim()
        .isLength({ min: 5 })
        .withMessage(
            'Address is required and must be at least 5 characters long.',
        ),
    body('maxOccupants')
        .isInt({ min: 1 })
        .withMessage('Max occupants must be a positive integer.'),
    body('features')
        .optional()
        .isArray()
        .withMessage('Features must be an array of strings.')
        .custom((value) => value.every((item) => typeof item === 'string'))
        .withMessage('All features must be strings.'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long.'),
    body('images')
        .optional()
        .isArray()
        .withMessage('Images must be an array of URLs.')
        .custom((value) =>
            value.every(
                (item) =>
                    typeof item === 'string' &&
                    (item.startsWith('http://') ||
                        item.startsWith('https://') ||
                        item.startsWith('/images/')),
            ),
        )
        .withMessage(
            'All images must be valid URLs or relative paths starting with /images/.',
        ),
];

const bookingValidationRules = [
    body('post_id')
        .notEmpty()
        .withMessage('Housing ID is required.')
        .isMongoId()
        .withMessage('Housing ID must be a valid Mongo ID.'),
    body('user_id')
        .notEmpty()
        .withMessage('User ID is required.')
        .isMongoId()
        .withMessage('User ID must be a valid Mongo ID.'),
    body('check_in_date')
        .isISO8601()
        .withMessage('Check-in date must be a valid date.'),
    body('check_out_date')
        .isISO8601()
        .withMessage('Check-out date must be a valid date.'),
    body('status')
        .optional()
        .isIn(['pending', 'confirmed', 'cancelled', 'concluded'])
        .withMessage(
            'Status must be pending, confirmed, cancelled, or concluded.',
        ),
    body('total_price')
        .isFloat({ min: 0 })
        .withMessage('Total price must be a positive number.'),
];

const calendarValidationRules = [
    body('post_id')
        .notEmpty()
        .withMessage('Housing ID is required.')
        .isMongoId()
        .withMessage('Housing ID must be a valid Mongo ID.'),
    body('date')
        .notEmpty()
        .withMessage('Date is required.')
        .isISO8601()
        .withMessage('Date must be a valid date.'),
    body('available')
        .isBoolean()
        .withMessage('Availability must be true or false.'),
];

module.exports = {
    registrationValidationRules,
    adminUserValidationRules,
    loginValidationRules,
    housingValidationRules,
    validate,
    bookingValidationRules,
    calendarValidationRules,
};
