let request = require('request');
import _ from 'lodash';
import moment from 'moment';
let Sequelize = require("sequelize");
const tenpay = require('tenpay');
let shortid=require("js-shortid");
const config = {
  appid: 'wxf65b8896f0bc3450',
  mchid: '1609182701',
  partnerKey: 'XiaoXiang2021Bjjdkjxiaoxiangxxxx',
//   pfx: require('fs').readFileSync('apiclient_cert.pem')
  notify_url: 'https://www.anane.net.cn/api/wxpay/notify',
//   spbill_create_ip: 'IP地址'
};
const payapi = new tenpay(config, true);


module.exports = app => {
    const Op = Sequelize.Op;
    const {
        userManager,
        deviceManager,
        deviceRecordManager,
        hotelManager,
        orderManager,
        wxOrderManager
    } = app.service;
    async function createorder(req,res){
        if(_.isEmpty(req.query.deviceid)){
            return res.json({ state: "error", errorMsg:"设备id不能为空" })
        }
        let param = req.query
        let deviceresult = await deviceManager.getById(req.query.deviceid)
        if(deviceresult == null){
            return res.json({ state: "error", errorMsg:"设备id未找到" })
        }
        let hotelresult = await hotelManager.getById(deviceresult.hotelid)
        if(_.isEmpty(req.query.playerid)){
            return res.json({ state: "error", errorMsg:"用户id不能为空" })
        }
        if(_.isEmpty(req.query.realprice)){
            req.query.realprice = 0
        }
        let orderesult = await orderManager.getByPlayeridandDeviceid(req.query.playerid,req.query.deviceid)
        if(!!orderesult){
            let a = moment().valueOf()
            let b = moment(orderesult.created_at).valueOf()
            let c = Math.ceil((a-b)/(1000*60*60*24))
            if(c>1){
                _.merge(param,{"totalprice":hotelresult.price,"time":orderesult.time+1,"hotelprice":req.query.realprice*hotelresult.divide,"jdprice":req.query.realprice*(1-hotelresult.divide),"realprice":req.query.realprice})
                orderesult = await orderManager.createOrder(param); 
            }
            res.json({code:20000, state: "success", order:orderesult })
            // let recordresult = await deviceRecordManager.createDeviceRecord(
            //     {"orderid":orderesult.id,
            //     "deviceid":req.query.deviceid,
            //     "playerid":req.query.playerid
            // })
            // if(!!recordresult){
            //     res.json({code:20000, state: "success", order:orderesult })
            // }else{
            //     res.json({state: "error", errorMsg:"创建使用记录失败2" })
            // }
        }else{
            let r = await orderManager.getByPlayerId(req.query.playerid)
            if(!!r){
                _.merge(param,{"totalprice":hotelresult.price,"time":r.time+1,"hotelprice":(req.query.realprice)*hotelresult.divide,"jdprice":(req.query.realprice)*(1-hotelresult.divide),"realprice":req.query.realprice})
            }else{
                _.merge(param,{"totalprice":hotelresult.price,"time":1,"hotelprice":(req.query.realprice)*hotelresult.divide,"jdprice":(req.query.realprice)*(1-hotelresult.divide),"realprice":req.query.realprice})
    
            }
            orderesult = await orderManager.createOrder(param);
            if(!!orderesult){
                res.json({code:20000, state: "success", order:orderesult })
                // var recordresult = await deviceRecordManager.createDeviceRecord(
                //     {"orderid":orderesult.id,
                //     "deviceid":param.deviceid,
                //     "playerid":param.playerid
                // })
                // if(!!recordresult){
                //     res.json({code:20000, state: "success", order:orderesult })
                // }else{
                //     res.json({state: "error", errorMsg:"创建使用记录失败4" })
                // }
            }else{
                res.json({ state:"error", errorMsg:"创建订单失败" })
            }
        }
    
    }
    
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
        if(!!result && result[0]>0){
            res.json({code:20000, state: "success", msg:"修改成功" })
        }else{
            res.json({ state:"error", errorMsg:"修改失败" })
        }
        
    });

    app.get("/api/order/createrecord",async(req,res)=>{
        let recordresult = await deviceRecordManager.createDeviceRecord(
            {"orderid":req.query.orderid,
            "deviceid":req.query.deviceid,
            "playerid":req.query.playerid
        })
        if(!!recordresult){
            res.json({code:20000, state: "success" })
        }else{
            res.json({state: "error", errorMsg:"创建使用记录失败" })
        }
    });



    app.get("/api/order/wxpay",async(req,res)=>{
        let out_trade_no = shortid.gen()
        let result = await payapi.getPayParams({
            out_trade_no: out_trade_no,
            body: '搓背机',
            // total_fee:req.query.realprice,
            total_fee: '1',
            openid: req.query.openid,
            attach:req.query.attach
          });
          result.out_trade_no = out_trade_no
          console.log(result)
        res.json(result)
    });

    // // 支付结果通知/退款结果通知
    app.post('/api/wxpay/notify', payapi.middlewareForExpress('pay'), async (req, res) => {
        console.log('/api/wxpay/notify')
        
        let info = req.weixin;
    
        // {
        //     appid: 'wxf65b8896f0bc3450',
        //     bank_type: 'OTHERS',
        //     cash_fee: '1',
        //     fee_type: 'CNY',
        //     is_subscribe: 'N',
        //     mch_id: '1609182701',
        //     nonce_str: 'o5RWrOeGbn2iL8wC',
        //     openid: 'oT7LH5KQrY0eluHiHZOnsP9B060o',
        //     out_trade_no: '1621588450643',
        //     result_code: 'SUCCESS',
        //     return_code: 'SUCCESS',
        //     sign: '52F02AA8BF9E5D67F10487597AF339C1',
        //     time_end: '20210521171421',
        //     total_fee: '1',
        //     trade_type: 'JSAPI',
        //     transaction_id: '4200001037202105212309081184'
        //   }
        // 业务逻辑...
        await wxOrderManager.create(info)
        let r = {"query":{"deviceid":info.attach,"playerid":info.openid,"realprice":(info.total_fee/100).toString(),"wxorder":info.out_trade_no}}
        await createorder(r,res)
        // 回复消息(参数为空回复成功, 传值则为错误消息)
        console.log(info)
        // res.reply('错误消息' || '');
    });
    
    // // 扫码支付模式一回调
    // app.post('/api/wxpay/qrcode', payapi.middlewareForExpress('nativePay'), (req, res) => {
    //     let info = req.weixin;
    
    //     // 业务逻辑和统一下单获取prepay_id...
    
    //     // 响应成功或失败(第二个可选参数为输出错误信息)
    //     console.log(info)
    // });

    app.get("/api/order/check",async(req,res)=>{
        if(_.isEmpty(req.query.deviceid)){
            return res.json({ state: "error", errorMsg:"设备id不能为空" })
        }
        if(_.isEmpty(req.query.playerid)){
            return res.json({ state: "error", errorMsg:"用户id不能为空" })
        }
        let orderesult = await orderManager.getByPlayeridandDeviceid(req.query.playerid,req.query.deviceid)
        if(!!orderesult){
            let a = moment().valueOf()
            let b = moment(orderesult.created_at).valueOf()
            let c = Math.ceil((a-b)/(1000*60*60*24))
            if(c>1){
                res.json({state: "error", errorMsg:"没有订单1" })
            }else{
                res.json({code:20000, state: "success", order:orderesult })
            }
        }else{
            let r = await orderManager.getByPlayerId(req.query.playerid)
            if(!!r){
                res.json({state: "error", errorMsg:"is not first" })
            }else{
                res.json({code:20001,first:true})
            }
            
        }
    });

    app.get("/api/order/checkwx",async(req,res)=>{
        if(_.isEmpty(req.query.deviceid)){
            return res.json({ state: "error", errorMsg:"设备id不能为空" })
        }
        if(_.isEmpty(req.query.playerid)){
            return res.json({ state: "error", errorMsg:"用户id不能为空" })
        }
        let orderesult = await wxOrderManager.getByPlayeridandDeviceid(req.query.playerid,req.query.deviceid)
        if(!!orderesult){
            let a = moment().valueOf()
            let b = moment(orderesult.created_at).valueOf()
            let c = Math.ceil((a-b)/(1000*60*60*24))
            if(c>1){
                res.json({state: "error", errorMsg:"没有订单1" })
            }else{
                res.json({code:20000, state: "success", order:orderesult })
            }
        }else{
            let r = await wxOrderManager.getByPlayerId(req.query.playerid)
            if(!!r){
                res.json({state: "error", errorMsg:"is not first" })
            }else{
                res.json({code:20001,first:true})
            }
        
        }
    });



    app.get("/api/order/create",async (req, res) => {
        return await createorder(req,res)

            // let orderesult = await orderManager.getByDeviceId(req.query.deviceid)
            // console.log(orderesult)
            // if(!!orderesult){
            //     if(orderesult.status == "end"){
            //         let time  = orderesult.time+1
            //         if(time > hotelresult.saletime){
            //             _.merge(param,{"totalprice":hotelresult.price,"time":time,"hotelprice":hotelresult.price*0.8,"jdprice":hotelresult.price*0.2})
            //         }else{
            //             _.merge(param,{"totalprice":hotelresult.price,"time":time,"hotelprice":hotelresult.price*0.2,"jdprice":hotelresult.price*0.8})
            //         }
            //         orderesult = await orderManager.createOrder(param);
            //         if(!!orderesult){
            //             let recordresult = await deviceRecordManager.createDeviceRecord(
            //                 {"orderid":orderesult.id,
            //                 "deviceid":req.query.deviceid,
            //                 "playerid":req.query.playerid
            //             })
            //             if(!!recordresult){
            //                 res.json({code:20000, state: "success", msg:"创建成功" })
            //             }else{
            //                 res.json({state: "error", errorMsg:"创建使用记录失败" })
            //             }
            //         }else{
            //             res.json({ state:"error", errorMsg:"创建订单失败" })
            //         }
            //     }else{
            //         let a = moment().valueOf()
            //         let b = moment(orderesult.created_at).valueOf()
            //         let c = Math.ceil((a-b)/(1000*60*60*24))
            //         if(orderesult.days!=c){
            //             if(orderesult.time > hotelresult.saletime){
            //                 orderManager.update({days:c,"totalprice":hotelresult.price*c,"hotelprice":hotelresult.price*0.8*c,"jdprice":hotelresult.price*0.2*c},{id:orderesult.id})
            //             }else{
            //                 orderManager.update({days:c,"totalprice":hotelresult.price*c,"hotelprice":hotelresult.price*0.2*c,"jdprice":hotelresult.price*0.8*c},{id:orderesult.id})
            //             }
            //         }
            //         let recordresult = await deviceRecordManager.createDeviceRecord(
            //             {"orderid":orderesult.id,
            //             "deviceid":req.query.deviceid,
            //             "playerid":req.query.playerid
            //         })
            //         console.log(recordresult)
            //         if(!!recordresult){
            //             res.json({code:20000, state: "success", msg:"创建成功1" })
            //         }else{
            //             res.json({state: "error", errorMsg:"创建使用记录失败2" })
            //         }
            //     }
            // }else{
            //     _.merge(param,{"totalprice":hotelresult.price,"time":1,"hotelprice":hotelresult.price*0.2,"jdprice":hotelresult.price*0.8})
            //     let orderesult = await orderManager.createOrder(param);
            //     if(!!orderesult){
            //         var recordresult = await deviceRecordManager.createDeviceRecord(
            //             {"orderid":orderesult.id,
            //             "deviceid":param.deviceid,
            //             "playerid":param.playerid
            //         })
            //         if(!!recordresult){
            //             res.json({code:20000, state: "success", msg:"创建成功3" })
            //         }else{
            //             res.json({state: "error", errorMsg:"创建使用记录失败4" })
            //         }
            //     }else{
            //         res.json({ state:"error", errorMsg:"创建订单失败" })
            //     }
            // }
        
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