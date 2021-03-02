let request = require('request');
import _ from 'lodash';
module.exports = app => {
    const {
        userManager,
        deviceManager,
        hotelManager,
        orderManager
    } = app.service;
    app.get("/api/order/info",async(req,res)=>{
        let uid = req.query.id;
        let user_info = await orderManager.getById(uid);
        if(!!user_info){
            res.json(user_info);
        }else{
            res.json({ state:"error", errorMsg:"用户不存在"});
        }
        
    });
    app.get("/api/order/create",async (req, res) => {
        console.log(req.query)
        if(_.isEmpty(req.query.deviceid)){
            return res.json({ state: "error", errorMsg:"设备id不能为空" })
        }
        let result = await deviceManager.getById(req.query.deviceid)
        if(result == null){
            return res.json({ state: "error", errorMsg:"设备id未找到" })
        }
        result = await orderManager.createOrder(req.query);
        if(!!result){
            res.json({code:20000, state: "success", msg:"创建成功" })
        }else{
            res.json({ state:"error", errorMsg:"创建失败" })
        }

    });

    app.get("/api/order/list",async (req, res) => {
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
        let result = await orderManager.getMany(param);
        result.code = 20000
        res.json(result);
    });

};