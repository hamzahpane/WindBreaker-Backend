const {Schema , model} = require('mongoose');
const deliveryAddress = Schema({

name:{
    type:String,
    require:[true , 'Nama Harus diisi'],
    maxlength:[255,'Panjang Maksimal alamat dari karater ini 255 karakter']
}
,

kelurahan:{
    type:String,
    require:[true , 'kelurahan Harus diisi'],
    maxlength:[255,'Panjang Maksimal alamat dari karater ini 255 karakter']
}
,

kecamatan:{
    type:String,
    require:[true , 'kecamatan Harus diisi'],
    maxlength:[255,'Panjang Maksimal alamat dari karater ini 255 karakter']
}
,

kabupaten:{
    type:String,
    require:[true , 'kabupaten Harus diisi'],
    maxlength:[255,'Panjang Maksimal alamat dari karater ini 255 karakter']
}
,

detail:{
    type:String,
    require:[true , 'detail Harus diisi'],
    maxlength:[255,'Panjang Maksimal alamat dari karater ini 255 karakter']
}
,

user:{
    type:Schema.Types.ObjectId,
    ref:'User'
}
},{timesTamps:true});


module.exports = model('DeliveryAddress' , deliveryAddress)