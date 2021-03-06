import logger from './logger.js';
module.exports = {
	http: {
		port: 4002
	},
	debug: false,
	database: {
		username: 'root',
		password: '123456',
		database: 'kz_ec',
		dialect: 'mysql',
		host: '127.0.0.1',
		port: 3306,
		timezone: '+08:00',
		logging: false,
		pool: {
			max: 5,
			min: 0,
			idle: 10000
		},
		define: {
			// 字段以下划线（_）来分割（默认是驼峰命名风格）
			underscored: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci'
		}
	},
	redis: {
		host: '127.0.0.1',
		port: '6379',
		db: 0
	}
};
