    const createError = require('http-errors');
    const express = require('express');
    const path = require('path');
    const cookieParser = require('cookie-parser');
    const logger = require('morgan');
    const cors = require('cors');
    
    const PaymentRoute = require('./app/Payement/router');
    const ProductRoute = require('./app/Products/router');
    const CategoresRoute = require('./app/Category/route');
    const autRoute = require('./app/auth/route');
    const {decodeToken} = require('./midleware/index');
    const deliveryAddresRoute = require('./app/Deliveryaddres/router');
    const TagsRoute = require('./app/Tag/router');
    const cartItemsRoute = require('./app/Cart/route');

    
    const orderRouter = require('./app/Orders/route');
    
    const invoiceRoute = require('./app/Invoce/route');
    const orderItemRoute  = require('./app/Orderitem/router');
    const app = express();

    // Mengatur view engine dan direktori views
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(cors());
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(decodeToken());

    // Routing untuk produk
    app.use('/aut' , autRoute);
    app.use('/api',  ProductRoute);
    app.use('/api',  CategoresRoute);
    app.use('/api',  TagsRoute);
    app.use('/api',  deliveryAddresRoute);
    app.use('/api',  cartItemsRoute);
    app.use('/api',  orderRouter)
    app.use('/api',  invoiceRoute);
    app.use('/api',  orderItemRoute);
    app.use('/api',  PaymentRoute);
        // Routing untuk halaman utama
    app.get('/', (req, res) => {
        res.render('index', {
            title: 'eduwork API Service'
        });
    });

    // Tangani 404 error dan teruskan ke error handler
    app.use((req, res, next) => {
        next(createError(404));
    });

    // Error handler
    app.use((err, req, res, next) => {
        // Set local variables, hanya menyediakan error di environment development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // Render halaman error
        res.status(err.status || 500);
        res.render('error');
    });

    module.exports = app;
