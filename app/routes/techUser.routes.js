let express = require('express')
let controller = require('../controllers/techUser.controller')
let router = express.Router();

router.get('/getTechManagementPage/:techUserId', controller.getTechManagementPage);

router.get('/searchByUserName', controller.searchByUserName);

router.get('/searchByBusinessName', controller.searchByBusinessName);

router.post('/banUser', controller.banUser);

router.post('/unBanUser', controller.unBanUser);

router.post('/banBusiness', controller.banBusiness);

router.post('/unBanBusiness', controller.unBanBusiness);

router.post('/deleteUser', controller.deleteUser);

router.post('/deleteBusiness', controller.deleteBusiness);


module.exports = router;