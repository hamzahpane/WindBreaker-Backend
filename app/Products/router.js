const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const { police_cek } = require('../../midleware/index');
const mime = require('mime');
const productController = require('./controler'); // Memperbaiki penulisan nama controller


router.get('/products', productController.getProduct); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/images/products')
    },
    filename: function (req, file, cb) {
      cb(null, `product-${  Date.now()  }${Math.floor(Math.random() * 100)}.${  mime.getExtension(file.mimetype)}`);
    }
})
const upload = multer({ storage })
router.post('/products', upload.single('image_url'),  productController.createProduck);
router.put('/products/:id', upload.single('image_url'),  productController.updateProduck);
router.delete('/products/:id', productController.destoryProduct);

module.exports = router;
