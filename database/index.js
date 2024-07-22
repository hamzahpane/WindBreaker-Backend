const mongoose = require('mongoose');
const { dbHost, dbPort, dbName } = require('../app/config');

mongoose.connect(`mongodb+srv://mhamzahpane27:jOQlxYYKvSnlrKVh@cluster0.5mgvauf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
useNewUrlParser: true
});
const db = mongoose.connection;


module.exports = db;
