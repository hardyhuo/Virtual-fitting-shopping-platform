let express = require('express')
let controller = require('../controllers/signInUp.controller')
let router = express.Router();

router.post('/login', controller.login);

router.post('/loginBusiness', controller.loginBusiness);

router.post('/loginTechTeam', controller.loginTechTeam);

router.post('/signUp', controller.signUp);

router.post('/signUpBusiness', controller.signUpBusiness);

router.post('/signUpTechTeam', controller.signUpTechTeam);



router.get('/signUpPage', controller.signUpPage);

router.get('/signUpBusinessPage', controller.signUpBusinessPage);

router.get('/signInTechTeamPage', controller.signInTechTeamPage);

router.get('/loginPage', controller.loginPage);

router.get('/signInBusinessPage', controller.loginInBusinessPage);


module.exports = router;