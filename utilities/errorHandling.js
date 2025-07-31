/**
 * @function handleErrors
 * @description A higher-order function that wraps async controller functions
 * to catch and pass errors to the next middleware (Express error handler).
 * This avoids repetitive try-catch blocks in every async controller.
 * @param {Function} fn - The asynchronous controller function to wrap.
 * @returns {Function} - A new function that executes the controller and catches errors.
 */
const handleErrors = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next); // Catches promises rejections and passes to next()
};

module.exports = {
    handleErrors,
};
