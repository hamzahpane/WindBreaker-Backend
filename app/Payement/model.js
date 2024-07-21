const {Schema , model} = require('mongoose');


const Payment = Schema({

    Name:{
    type:String,
    require:[true , 'Nama Harus diisi'],
    maxlength:[255,'Panjang Maksimal alamat dari karater ini 255 karakter']
}
},{timesTamps:true});


module.exports = model('payment' , Payment);