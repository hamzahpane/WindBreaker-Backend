const router = require('express').Router();
const { police_cek } = require('../../midleware');
const cartItemsControler = require('./controler');

router.put('/cartItems',police_cek('update','Cart'),cartItemsControler.updateCartItem);

router.get('/cartItems',police_cek('read','Cart'),cartItemsControler.getCartItem);


module.exports = router;