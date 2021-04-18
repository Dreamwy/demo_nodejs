let request = require('request');
let randomMac = require('random-mac')
let shortid=require("js-shortid")
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
        hotelManager,
        macManager
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
    
    app.get("/api/allcount",async(req,res)=>{ 
        let start = req.query.start
        let end = req.query.end
        let [result, metadata] = await db.sequelize.query("SELECT province,COUNT(DISTINCT(id)) as hotelCount,COUNT(DISTINCT(temp.dddid)) as deviceCount,COUNT(DISTINCT(temp.deviceRecordddrid)) as converCount,IFNULL(COUNT(DISTINCT(temp.deviceRecordddrid))/COUNT(DISTINCT(temp.dddid)),0) as converPer,IFNULL(COUNT(DISTINCT(temp.ddrid))/COUNT(DISTINCT(temp.dddid)),0) as recordPer,IFNULL(SUM(temp.dcontent)/COUNT(DISTINCT(temp.dddid)),0) as recordCount FROM hotel LEFT JOIN (SELECT device.hotelid as ddhid,device.id as dddid, deviceRecord.deviceid as deviceRecordddrid, deviceRecord.id as ddrid,IFNULL(deviceRecord.content,0) as dcontent  FROM device LEFT JOIN deviceRecord ON device.id = deviceRecord.deviceid  and deviceRecord.created_at BETWEEN '"+start+"' and '"+end+"' WHERE device.created_at < '"+end+"') as temp ON hotel.id = temp.ddhid WHERE hotel.created_at < '"+end+"' GROUP BY province")
        if(!!result){
            res.json({"rows":result,"code":20000});
        }else{
            res.json({ state:"error", errorMsg:"用户不存在"});
        }
    });

    app.get("/api/allcountbyprovince",async(req,res)=>{
        let province = req.query.province
        let start = req.query.start
        let end = req.query.end
        console.log(start+" "+end+" "+province)
        let [result, metadata] = await db.sequelize.query("SELECT hotel.`name`,COUNT(DISTINCT(temp.dddid)) as deviceCount,COUNT(DISTINCT(temp.deviceRecordddrid)) as converCount,IFNULL(COUNT(DISTINCT(temp.deviceRecordddrid))/COUNT(DISTINCT(temp.dddid)),0) as converPer,IFNULL(COUNT(DISTINCT(temp.ddrid))/COUNT(DISTINCT(temp.dddid)),0) as recordPer,IFNULL(SUM(temp.dcontent)/COUNT(DISTINCT(temp.dddid)),0) as recordCount FROM hotel LEFT JOIN (SELECT device.hotelid as ddhid,device.id as dddid,deviceRecord.deviceid as deviceRecordddrid,deviceRecord.id as ddrid,IFNULL(deviceRecord.content,0) as dcontent  FROM device LEFT JOIN deviceRecord ON device.id = deviceRecord.deviceid and deviceRecord.created_at BETWEEN '"+start+"' and '"+end+"' WHERE device.created_at < '"+end+"') as temp ON hotel.id = temp.ddhid WHERE hotel.created_at < '"+end+"' and hotel.province LIKE '%"+province+"%' GROUP BY hotel.`name` ORDER BY recordCount DESC")
        if(!!result){
            res.json({"rows":result,"code":20000});
        }else{
            res.json({ state:"error", errorMsg:"用户不存在"});
        }
    });

    app.get("/api/createmac",async(req,res)=>{
        let mac = randomMac('56:80:c7')
        let result = await macManager.create({"mac":mac,"deviceqrid":mac,"blename":mac});
        if(!!result){
            result.dataValues.code = 20000
            res.json(result)
        }else{
            res.json({ state:"error", errorMsg:"创建失败" })
        }
    });

    app.get("/api/getmac",async(req,res)=>{
        let result = await macManager.getBydeviceqrid(req.query.deviceqrid);
        if(!!result){
            result.dataValues.code = 20000
            res.json(result)
        }else{
            res.json({ state:"error", errorMsg:"查询失败" })
        }
    });

    // "vetur.format.defaultFormatterOptions": {
        

    //     "prettier": {
    //         // 不加分号
    //         "semi": false,
    //         // 用单引号
    //         "singleQuote": true,
    //         // 禁止随时添加逗号
    //         "trailingComma": "none"
    //       }

    // },
//     SELECT province,COUNT(DISTINCT(id)) as hotelCount,
// COUNT(DISTINCT(temp.dddid)) as deviceCount,
// COUNT(DISTINCT(temp.deviceRecordddrid)) as converCount,
// IFNULL(COUNT(DISTINCT(temp.deviceRecordddrid))/COUNT(DISTINCT(temp.dddid)),0) as converPer,
// IFNULL(COUNT(DISTINCT(temp.ddrid))/COUNT(DISTINCT(temp.dddid)),0) as recordPer,
// IFNULL(SUM(temp.dcontent)/COUNT(DISTINCT(temp.dddid)),0) as recordCount 
// FROM hotel 
// LEFT JOIN (SELECT device.hotelid as ddhid,
// device.id as dddid, 
// deviceRecord.deviceid as deviceRecordddrid, 
// deviceRecord.id as ddrid,
// IFNULL(deviceRecord.content,0) as dcontent  FROM device 
// LEFT JOIN deviceRecord ON device.id = deviceRecord.deviceid and deviceRecord.created_at > '2021-03-11' WHERE device.created_at > '2021-03-11') as temp 
// ON hotel.id = temp.ddhid WHERE hotel.created_at > '2021-03-11' GROUP BY province
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

//     SELECT id,IFNULL(SUM(temp.ordertprice),0),
// IFNULL(SUM(temp.orderhprice),0),
// IFNULL(SUM(temp.orderjprice),0) FROM hotel 
// LEFT JOIN (SELECT device.hotelid as ddhid,
// device.id as ddid, 
// `order`.deviceid as orderdid, 
// `order`.id as orderid,
// `order`.days as orderdays,
// `order`.totalprice as ordertprice,
// `order`.hotelprice as orderhprice,
// `order`.jdprice as orderjprice
// FROM device 
// LEFT JOIN `order` ON device.id = `order`.deviceid) as temp
// ON hotel.id = temp.ddhid GROUP BY hotel.id


// SELECT device.id,
// IFNULL(SUM(`order`.totalprice),0),
// IFNULL(SUM(`order`.hotelprice),0),
// IFNULL(SUM(`order`.jdprice),0) FROM device 
// LEFT JOIN `order` ON device.id = `order`.deviceid GROUP BY device.id
}
