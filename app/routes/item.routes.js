let express = require('express')
let controller = require('../controllers/item.controller')
let router = express.Router();

const multer = require('multer');
const multerStorage = multer.memoryStorage();
const upload = multer({
    storage: multerStorage,
});

router.get('/itemDetailPage/:itemId', controller.itemDetailPage);

router.get('/getItem/:itemId', controller.getItem);

router.post('/postComment', controller.addComment);

router.post('/uploadItem', upload.single('itemImgInput'), controller.uploadItem);

router.post('/editItem', upload.single('itemImgInput'), controller.editItem);

router.post('/disableItem', controller.disableItem);

router.post('/enableItem', controller.enableItem);

router.post('/deleteItem', controller.deleteItem);

router.get('/itemCommentsById/:itemId/:businessId', controller.viewItemCommentsById);

module.exports = router;