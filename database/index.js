const mongoose = require('mongoose');
const {dbHost , dbPort , dbName} = require('../app/config');

mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`)
.then(() => console.log('Connected!'))
.catch(error => console.error('MongoDB connection error:', error));

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

module.exports = db;
