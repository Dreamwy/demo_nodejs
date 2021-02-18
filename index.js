import express from 'express';
import consign from 'consign'; 

const app = express();
const cors = require('cors')
app.use(cors())

consign({verbose : false})
  .include("libs/config.js")
  .then("redis.js")
  .then("db.js")
  .include("service")
  .then("libs/middlewares.js")
  .include("routes")
  .then("libs/boot.js")
  .then('libs/errorhandler.js')
  .then('cron.js')
  .into(app)
  
module.exports = app;