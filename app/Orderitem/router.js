const router = require('express').Router();
const{police_cek} = require('../../midleware/index');
const OrderItem = require('./controler');

router.post('/ordersItem', 
    police_cek('create','OrderItem'),
    OrderItem.createItem);

// router.get('/getOrdersItem', police_cek('create','OrderItem') , OrderItem.getOrderItem);
module.exports = router;