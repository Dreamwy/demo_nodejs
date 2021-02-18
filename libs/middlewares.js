import bodyParser from 'body-parser';
import express from 'express';
import pjson from '../package.json';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import logger from './logger.js';
import _ from 'lodash';
module.exports = app => {
	const client = app.redis.config;
	const config = app.libs.config;
	const {userManager,utilManager} = app.service;
	app.set('port', app.libs.config.http.port);
	app.use(async (req, res, next) => {
		let uid = req.header("uid");
		if(!!uid){
			if(uid == -1){
				return res.json({ state:"error", errorMsg: "临时用户无访问权限" });
			}else{
				let user = await userManager.getById(uid)
				req.user = user;
				if(!user.status){
					return res.json({ errorCode:"403", state:"error", errorMsg: "很抱歉,您已被禁用了,请联系客服" });
				};
			}
			
		}
		next();
	})
	app.use(`/assets/${pjson.name}`,express.static(__dirname + "/../assets", {
			maxAge: "364d"
		})
	);
	app.use(`/assets/be/${pjson.name}`,express.static(__dirname + "/../assets", {
		maxAge: "364d"
	}));
	app.use(bodyParser.json());
};