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
    
    


    app.get("/api/hotel/info",async(req,res)=>{
        let uid = req.query.id;
        let user_info = await hotelManager.getById(uid);
        if(!!user_info){
            res.json(user_info);
        }else{
            res.json({ state:"error", errorMsg:"用户不存在"});
        }
        
    });
    app.get("/api/hotel/create",async (req, res) => {
        let result = await hotelManager.createHotel(req.query);
        if(!!result){
            
            res.json({code:20000, state: "success", msg:"创建成功" })
        }else{
            console.log("222222")
            res.json({ state:"error", errorMsg:"创建失败" })
        }

    });

    app.get("/api/hotel/list",async (req, res) => {
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
        let result = await hotelManager.getMany(param);
        result.code = 20000
        res.json(result);
    });


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
