let request = require('request');
import _ from 'lodash';
module.exports = app => {
    const {
        userManager,
        deviceManager,
        hotelManager
    } = app.service;
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

    app.get("/api/hotel/delete",async (req, res) => {
        console.log(req.query)
        let result = await hotelManager.delete(req.query);
        console.log(result)
        if(!!result){
            res.json({code:20000, state: "success", msg:"删除成功" })
        }else{
            res.json({ state:"error", errorMsg:"删除失败" })
        }
    });

    app.get("/api/hotel/update",async (req, res) => {
        console.log(req.query)
        let query = _.pick(req.query, ['id'])
        let param = _.omit(req.query, ['id'])
        let result = await hotelManager.update(param,query);
        if(result[0]>0){
            res.json({code:20000, state: "success", msg:"修改成功" })
        }else{
            res.json({ state:"error", errorMsg:"修改失败" })
        }
    });


    app.get("/api/hotel/province",async (req, res) => {
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
        let result = await hotelManager.getProvince(param);
        result.code = 20000
        res.json(result)
    });
};