const mongoose = require('mongoose');
const { dbHost , dbUser ,dbApp ,dbPass} = require('../app/config');

//untuk Moongose Compas
// const mongodbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;

//untuk Moongose Atlas
mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbApp}`, {
    useNewUrlParser: true,

});

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

module.exports = db;
