let express = require('express')
let controller = require('../controllers/user.controller')
let router = express.Router();

router.get('/getUserProfilePage/:userId', controller.getUserProfilePage);

router.post('/addToCart', controller.addToCart);

router.post('/directCheckOut', controller.directCheckOut);

router.post('/updateProfile', controller.updateProfile);

router.post('/updatePassword', controller.updatePassword);

router.post('/updateShoppingCartItemQuantity', controller.updateShoppingCartItemQuantity);

router.post('/delteItemFromCart', controller.delteItemFromCart);

router.post('/shoppingCartCheckOut', controller.shoppingCartCheckOut);

router.get('/shoppingCartPage/:userId', controller.getShoppingCartPage);

router.get('/recommendationPage/:userId', controller.recommendationPage);


module.exports = router;