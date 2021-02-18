import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import logger from './logger.js';
import path from "path";
import compression from "compression"
import redis from 'redis';


module.exports = app => {
    app.use(function (req, res, next) {
        console.log(req.originalUrl, ' is 404')
        var err = new Error('Not Found');
        err.status = 404;
        res.status(404).json({
            message: 'page not found',
            errorcode: '404'
        });
    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {}
        });
    });

};
