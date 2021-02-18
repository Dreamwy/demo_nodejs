"use strict";
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
//var config    = require('../config').database;
//console.log("into db")
var db = null;
module.exports = app => {
	if (!db) {
		const config = app.libs.config.database;
		//console.log(config)
		const sequelize = new Sequelize(config.database, config.username, config.password, config);
		const dir = path.join(__dirname, 'models');
		db = {
			sequelize, Sequelize
		};
		fs.readdirSync(path.join(dir)).filter(function (file) {
			return (file.indexOf(".") !== 0) && (file !== "index.js");
		}).forEach(function (file) {
			//console.log(path.join(dir, file))
			var model = sequelize.import(path.join(dir, file));
			db[model.name] = model;
		});

		Object.keys(db).forEach(function (modelName) {
			if ("associate" in db[modelName]) {
				db[modelName].associate(db);
			}
		});
	}
	return db;
}
