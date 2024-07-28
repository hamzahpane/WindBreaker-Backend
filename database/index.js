const mongoose = require('mongoose');

const {  dbHost ,dbPort , dbUser  ,dbName ,dbPass} = require('../app/config');

console.log(dbUser , dbPass , dbHost , dbPort , dbName );


const mongodbURI = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
console.log(mongodbURI);

mongoose.connect(mongodbURI, {

});


const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

module.exports = db;
