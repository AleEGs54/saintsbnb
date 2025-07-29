const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

router.use('/', swaggerUi.serve);

router.get('/', swaggerUi.setup(swaggerDocument), (req, res) => {
    //This ignores the swagger api. This route wont't show up in the documentation.
    // #swagger.ignore = true
});

module.exports = router;
