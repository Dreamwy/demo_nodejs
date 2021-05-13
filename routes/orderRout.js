let request = require('request');
import _ from 'lodash';
import moment from 'moment';
let Sequelize = require("sequelize");
module.exports = app => {
    const Op = Sequelize.Op;
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
    app.get("/api/order/updatelastrecord",async(req,res)=>{
        let did = req.query.did;
        let t = req.query.content;
        let result = await deviceRecordManager.updateOneByDeviceId({content:t},did);
        if(result[0]>0){
            res.json({code:20000, state: "success", msg:"修改成功" })
        }else{
            res.json({ state:"error", errorMsg:"修改失败" })
        }
        
    });
    app.get("/api/order/create",async (req, res) => {
        console.log(req.query)
        if(_.isEmpty(req.query.deviceid)){
            return res.json({ state: "error", errorMsg:"设备id不能为空" })
        }
        let param = req.query
        let deviceresult = await deviceManager.getById(req.query.deviceid)
        if(deviceresult == null){
            return res.json({ state: "error", errorMsg:"设备id未找到" })
        }else{
            let hotelresult = await hotelManager.getById(deviceresult.hotelid)
            console.log(hotelresult)
            let orderesult = await orderManager.getByDeviceId(req.query.deviceid)
            console.log(orderesult)
            if(!!orderesult){
                if(orderesult.status == "end"){
                    let time  = orderesult.time+1
                    if(time > hotelresult.saletime){
                        _.merge(param,{"totalprice":hotelresult.price,"time":time,"hotelprice":hotelresult.price*0.8,"jdprice":hotelresult.price*0.2})
                    }else{
                        _.merge(param,{"totalprice":hotelresult.price,"time":time,"hotelprice":hotelresult.price*0.2,"jdprice":hotelresult.price*0.8})
                    }
                    orderesult = await orderManager.createOrder(param);
                    if(!!orderesult){
                        let recordresult = await deviceRecordManager.createDeviceRecord(
                            {"orderid":orderesult.id,
                            "deviceid":req.query.deviceid,
                            "playerid":req.query.playerid
                        })
                        if(!!recordresult){
                            res.json({code:20000, state: "success", msg:"创建成功" })
                        }else{
                            res.json({state: "error", errorMsg:"创建使用记录失败" })
                        }
                    }else{
                        res.json({ state:"error", errorMsg:"创建订单失败" })
                    }
                }else{
                    let a = moment().valueOf()
                    let b = moment(orderesult.created_at).valueOf()
                    let c = Math.ceil((a-b)/(1000*60*60*24))
                    if(orderesult.days!=c){
                        if(orderesult.time > hotelresult.saletime){
                            orderManager.update({days:c,"totalprice":hotelresult.price*c,"hotelprice":hotelresult.price*0.8*c,"jdprice":hotelresult.price*0.2*c},{id:orderesult.id})
                        }else{
                            orderManager.update({days:c,"totalprice":hotelresult.price*c,"hotelprice":hotelresult.price*0.2*c,"jdprice":hotelresult.price*0.8*c},{id:orderesult.id})
                        }
                    }
                    let recordresult = await deviceRecordManager.createDeviceRecord(
                        {"orderid":orderesult.id,
                        "deviceid":req.query.deviceid,
                        "playerid":req.query.playerid
                    })
                    console.log(recordresult)
                    if(!!recordresult){
                        res.json({code:20000, state: "success", msg:"创建成功1" })
                    }else{
                        res.json({state: "error", errorMsg:"创建使用记录失败2" })
                    }
                }
            }else{
                _.merge(param,{"totalprice":hotelresult.price,"time":1,"hotelprice":hotelresult.price*0.2,"jdprice":hotelresult.price*0.8})
                let orderesult = await orderManager.createOrder(param);
                if(!!orderesult){
                    var recordresult = await deviceRecordManager.createDeviceRecord(
                        {"orderid":orderesult.id,
                        "deviceid":param.deviceid,
                        "playerid":param.playerid
                    })
                    if(!!recordresult){
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
        let { page, size,hotelid,deviceid } = req.query;
        let query ={}
        if(!!hotelid){
            let devices = await deviceManager.getIdsByhotelid(hotelid)
            let deviceids = []
            devices.rows.forEach((v, i) => {
                deviceids[i] = v.id
            });
            query = {deviceid:{[Op.or]:deviceids}}
        }
        if(!!deviceid){
            query = {deviceid:deviceid}
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