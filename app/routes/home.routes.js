let express = require('express')
let controller = require('../controllers/home.controller')
let router = express.Router();

router.get('/', controller.homeState);

module.exports = router;