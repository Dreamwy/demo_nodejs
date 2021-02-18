import redis from 'redis';
let client = null;
let sub = null;
let pub = null;
let  Promise = require("bluebird");
module.exports = app => {
    const config = app.libs.config;
    if (!client) {
        client = Promise.promisifyAll(redis.createClient(config.redis));
    }
    if (!sub) {
        sub = Promise.promisifyAll(redis.createClient(config.redis));
    }
    if (!pub) {
        pub = Promise.promisifyAll(redis.createClient(config.redis));
    }
    return {client,sub,pub}
}