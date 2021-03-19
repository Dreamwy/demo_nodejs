let request = require('request');
import _ from 'lodash';
import moment from 'moment';
let Sequelize = require("sequelize");
module.exports = app => {
    const {
        userManager,
        deviceManager,
        deviceRecordManager,
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
        var result = await deviceManager.getById(req.query.deviceid)
        if(result == null){
            return res.json({ state: "error", errorMsg:"设备id未找到" })
        }else{
            result = await orderManager.getByDeviceId(req.query.deviceid)
            console.log(result)
            if(!!result){
                if(result.status == "end"){
                    result = await orderManager.createOrder(req.query);
                    if(!!result){
                        result = await deviceRecordManager.createDeviceRecord(
                            {"orderid":result.id,
                            "deviceid":req.query.deviceid,
                            "playerid":req.query.playerid
                        })
                        if(!!result){
                            res.json({code:20000, state: "success", msg:"创建成功" })
                        }else{
                            res.json({state: "error", errorMsg:"创建使用记录失败" })
                        }
                    }else{
                        res.json({ state:"error", errorMsg:"创建订单失败" })
                    }
                }else{
                    let dresult = await deviceRecordManager.createDeviceRecord(
                        {"orderid":result.id,
                        "deviceid":req.query.deviceid,
                        "playerid":req.query.playerid
                    })
                    console.log(dresult)
                    if(!!dresult){
                        res.json({code:20000, state: "success", msg:"创建成功1" })
                    }else{
                        res.json({state: "error", errorMsg:"创建使用记录失败2" })
                    }
                }
            }else{
                result = await orderManager.createOrder(req.query);
                if(!!result){
                    result = await deviceRecordManager.createDeviceRecord(
                        {"orderid":result.id,
                        "deviceid":req.query.deviceid,
                        "playerid":req.query.playerid
                    })
                    if(!!result){
                        res.json({code:20000, state: "success", msg:"创建成功3" })
                    }else{
                        res.json({state: "error", errorMsg:"创建使用记录失败4" })
                    }
                }else{
                    res.json({ state:"error", errorMsg:"创建订单失败" })
                }
            }
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