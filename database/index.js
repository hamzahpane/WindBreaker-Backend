const mongoose = require('mongoose');

const {  dbHost ,dbPort , dbName ,dbUser ,dbApp ,dbPass} = require('../app/config');

// untuk Moongose Compas
const mongodbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;

// untuk Moongose Atlas
// mongoose.connect(`mongodb+srv://mhamzahpane27:HqGe5S8GawhcFy1H@coffeshop.hl6txml.mongodb.net/?retryWrites=true&w=majority&appName=Coffeshop`, {
//     useNewUrlParser: true,

// });

mongoose.connect(mongodbURI, {
useNewUrlParser: true,
});


const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

module.exports = db;
