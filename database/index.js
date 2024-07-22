const mongoose = require('mongoose');
const { dbAPI} = require('../app/config');

//untuk Moongose Compas
// const mongodbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;

//untuk Moongose Atlas
const mongodbURI = `${dbAPI}`;
mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

module.exports = db;
