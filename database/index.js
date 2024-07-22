const mongoose = require('mongoose');
const { dbHost, dbPort, dbName , dbUser, dbPass ,dbApp} = require('../app/config');

//untuk Moongose Compas
// const mongodbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;

//untuk Moongose Atlas
const mongodbURI = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/?retryWrites=true&w=majority&appName=${dbApp}`;
mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

module.exports = db;
