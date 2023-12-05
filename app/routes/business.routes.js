let express = require('express')
let controller = require('../controllers/business.controller')
let router = express.Router();

router.get('/businessManagementPage/:businessId', controller.businessManagementPage);

router.get('/businessDetailPage/:businessId', controller.businessDetailPage);

router.post('/updateBusinessProfile', controller.updateBusinessProfile);

router.post('/updateBusinessPassword', controller.updateBusinessPassword);


module.exports = router;