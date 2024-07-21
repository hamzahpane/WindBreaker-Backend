const router = require('express').Router();
const { police_cek } = require('../../midleware/index');
const orderControll = require('./controler');


router.post('/postorders', 
    police_cek('create', 'Order'),
    orderControll.createOrder);

router.get('/getOrders', 
    police_cek('read', 'Order'), 
    orderControll.getOrders);   


router.delete('/Orders/:id' , 
orderControll.deleteOrder);

module.exports = router;
