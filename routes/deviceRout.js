let request = require('request');
import _ from 'lodash';
module.exports = app => {
    const {
        userManager,
        deviceManager,
        hotelManager
    } = app.service;
    app.get("/api/device/info",async(req,res)=>{
        let uid = req.query.id;
        let device_info = await deviceManager.getById(uid);
        if(!!device_info){
            res.json(device_info);
        }else{
            res.json({ state:"error", errorMsg:"用户不存在"});
        }
        
    });
    
    app.get("/api/device/create",async (req, res) => {
        // let device = _.pick(req.body, ['fullname', 'mobile']);
        if(req.query.id == null){
            return res.json({ state: "error", errorMsg:"设备id不能为空" })
        }
        if(req.query.hotelid == null){
            return res.json({ state: "error", errorMsg:"酒店id不能为空" })
        }
        let result = await hotelManager.getById(req.query.hotelid)
        if(result == null){
            return res.json({ state: "error", errorMsg:"酒店id未找到" })
        }
        result = await deviceManager.create(req.query);
        if(!!result){
            return res.json({ state: "success", msg:"创建成功" })
        }else{
            return res.json({ state:"error", errorMsg:"创建失败" })
        }
    });

    app.get("/api/device/list",async (req, res) => {
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
        let result = await deviceManager.getMany(param);
        res.json(result);
    });

};