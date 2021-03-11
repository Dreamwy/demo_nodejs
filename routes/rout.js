let request = require('request');
import moment from 'moment';
import _ from 'lodash';
import Sequelize from 'sequelize';
module.exports = app => {
    const config = app.libs.config;
    const db = app.db;
    const Op = Sequelize.Op;
    
    const {
        userManager,
        deviceManager,
        hotelManager
    } = app.service;
    app.get("/api/user/info",async(req,res)=>{
        let uid = req.query.id;
        let user_info = await userManager.getById(uid);
        if(!!user_info){
            res.json(user_info);
        }else{
            res.json({ state:"error", errorMsg:"用户不存在"});
        }
        
    });
    app.post("/api/user/create",async (req, res) => {
        let user = _.pick(req.body, ['fullname', 'mobile']);
        let result = await userManager.create(user);
        if(!!result){
            res.json({ state: "success", msg:"创建成功" })
        }else{
            res.json({ state:"error", errorMsg:"创建失败" })
        }
    });

    app.get("/api/user/list",async (req, res) => {
        let { page, size, _fullname } = req.query;
        let query = _.pick(req.query, ['mobile']);
        if (!!_fullname) {
            query.fullname = { [Op.like]: `%${_fullname}%` }
        }
        let param = {
            page: page,
            size: size,
            query: query
        }
        let result = await userManager.getMany(param);
        res.json(result);
    });
    
    
    app.get("/api/wxlogin",async(req,res)=>{
        let code = req.query.code;
        let url = "https://api.weixin.qq.com/sns/jscode2session";
        url += "?appid=wxff785bbaf32ceac3";//自己的appid
        url += "&secret=59b29ca515ccf40c39d89c7d91c76239";//自己的appSecret
        url += "&js_code=" + code;
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log(body) // 请求成功的处理逻辑，注意body是json字符串
              res.send(body)
            }
          });
    });
    const selectall = "SELECT province,COUNT(DISTINCT(id)) as hotelCount,COUNT(DISTINCT(temp.dddid)) as deviceCount,COUNT(DISTINCT(temp.deviceRecordddrid)) as converCount,IFNULL(COUNT(DISTINCT(temp.deviceRecordddrid))/COUNT(DISTINCT(temp.dddid)),0) as converPer,IFNULL(COUNT(DISTINCT(temp.ddrid))/COUNT(DISTINCT(temp.dddid)),0) as recordPer,IFNULL(SUM(temp.dcontent)/COUNT(DISTINCT(temp.dddid)),0) as recordCount FROM hotel LEFT JOIN (SELECT device.hotelid as ddhid,device.id as dddid, deviceRecord.deviceid as deviceRecordddrid, deviceRecord.id as ddrid,IFNULL(deviceRecord.content,0) as dcontent  FROM device LEFT JOIN deviceRecord ON device.id = deviceRecord.deviceid) as temp ON hotel.id = temp.ddhid GROUP BY province"
    app.get("/api/allcount",async(req,res)=>{
        let [result, metadata] = await db.sequelize.query(selectall)
        // let uid = req.query.id;
        // let device_info = await deviceManager.getById(uid);
        if(!!result){
            res.json({"rows":result,"code":20000});
        }else{
            res.json({ state:"error", errorMsg:"用户不存在"});
        }
        
    });

    // app.get("/api/hotel/info",async(req,res)=>{
    //     let uid = req.query.id;
    //     let user_info = await hotelManager.getById(uid);
    //     if(!!user_info){
    //         res.json(user_info);
    //     }else{
    //         res.json({ state:"error", errorMsg:"用户不存在"});
    //     }
        
    // });
    // app.get("/api/hotel/create",async (req, res) => {
    //     let result = await hotelManager.createHotel(req.query);
    //     if(!!result){
            
    //         res.json({code:20000, state: "success", msg:"创建成功" })
    //     }else{
    //         console.log("222222")
    //         res.json({ state:"error", errorMsg:"创建失败" })
    //     }

    // });

    // app.get("/api/hotel/list",async (req, res) => {
    //     let { page, size, _fullname } = req.query;
    //     let query = _.pick(req.query, ['mobile']);
    //     if (!!_fullname) {
    //         query.fullname = { [Op.like]: `%${_fullname}%` }
    //     }
    //     let param = {
    //         page: page,
    //         size: size,
    //         query: query
    //     }
    //     let result = await hotelManager.getMany(param);
    //     result.code = 20000
    //     res.json(result);
    // });


    // app.all("*", function (req, res, next) {
    //     console.log("alllllllll")
    //     if (!req.get("Origin")) {
    //       return next();
    //     } // use "*" here to accept any origin
      
    //     //指定允许其他域名访问
    //     res.set("Access-Control-Allow-Origin", "http://localhost:9527");
    //     //是否允许后续请求携带认证信息（cookies）,该值只能是true,否则不返回
    //     res.set("Access-Control-Allow-Credentials", "true");
    //     res.set("Access-Control-Allow-Methods", "*");
    //     res.set("Access-Control-Allow-Headers", "Content-Type,Access-Token");
    //     res.set("Access-Control-Expose-Headers", "*");
      
    //     next();
    //   });
}
