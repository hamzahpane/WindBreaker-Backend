const router  = require('express').Router();
const { police_cek } = require('../../midleware/index');
const invoiceControl = require('./controler');

router.get('/getinvoice' ,  police_cek('read', 'Invoice'), invoiceControl.getInvoice);

router.get('/getinvoice/:id' ,  police_cek('read', 'Invoice'), invoiceControl.getIdinvoice);

router.delete('/deletinvoice/:id' , invoiceControl.deleteInvoice);

router.post('/cretInvoice' , police_cek('create', 'Invoice' ),invoiceControl.createInvoice);


module.exports= router;