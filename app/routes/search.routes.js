let express = require('express')
let controller = require('../controllers/search.controller')
let router = express.Router();

router.get('/searchByTitle', controller.searchByTitle);

router.get('/searchByBusinessName', controller.searchByBusiness);


module.exports = router;