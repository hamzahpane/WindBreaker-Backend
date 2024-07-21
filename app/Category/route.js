const Router = require('express').Router();
const categoresControll = require('./controler');

Router.get('/category', categoresControll.index);
Router.post('/category', categoresControll.store);
Router.put('/category/:id', categoresControll.update);
Router.delete('/category/:id', categoresControll.destroy);

module.exports = Router;