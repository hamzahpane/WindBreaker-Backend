const { police_cek } = require('../../midleware');
const deliveryAddresControlerr = require('./controler');
const router = require('express').Router();


router.post('/deliveryAddres',police_cek('create', 'DeliveryAddress'), 
deliveryAddresControlerr.createDeliveryaddres);

router.get('/deliveryAddres', police_cek('view', 'DeliveryAddress'),
deliveryAddresControlerr.getDeliveryaddres);

router.put('/deliveryAddres/:id', police_cek('update', 'DeliveryAddress'), 
deliveryAddresControlerr.updateDeliveryaddres);


router.delete('/deliveryAddres/:id' , police_cek('delete', 'DeliveryAddress'), 
deliveryAddresControlerr.destroyDeliveryaddres);
module.exports = router;