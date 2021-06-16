let Sequelize = require("sequelize");
import moment from 'moment'
import _ from 'lodash';
// {
//         appid: 'wxf65b8896f0bc3450',
//         attach: '2QpWXg3izXyrhT3',
//         bank_type: 'OTHERS',
//         cash_fee: '1',
//         fee_type: 'CNY',
//         is_subscribe: 'N',
//         mch_id: '1609182701',
//         nonce_str: 'lwbzaooTrqW5vrmi',
//         openid: 'oT7LH5KQrY0eluHiHZOnsP9B060o',
//         out_trade_no: '1621955637647',
//         result_code: 'SUCCESS',
//         return_code: 'SUCCESS',
//         sign: '7574EE791F8CA991317B8A1313FC5E15',
//         time_end: '20210525231421',
//         total_fee: '1',
//         trade_type: 'JSAPI',
//         transaction_id: '4200001041202105259992030163'
//       } 
module.exports = function(sequelize, DataTypes) {
	let WxOrder = sequelize.define("WxOrder", {
		transaction_id: { type: Sequelize.STRING, primaryKey: true,allowNull: false},
        fee_type :  { type: Sequelize.STRING},
        appid :  { type: Sequelize.STRING},
        trade_type :  { type: Sequelize.STRING},
        mch_id :  { type: Sequelize.STRING},
        is_subscribe :  { type: Sequelize.STRING},
        sign :  { type: Sequelize.STRING},
        time_end :  { type: Sequelize.STRING},
        total_fee:  { type: Sequelize.STRING},
        cash_fee:  { type: Sequelize.STRING},
        bank_type:  { type: Sequelize.STRING},
        result_code :  { type: Sequelize.STRING},
        return_code :  { type: Sequelize.STRING},
        openid :  { type: Sequelize.STRING},
        out_trade_no :  { type: Sequelize.STRING},
        nonce_str :  { type: Sequelize.STRING},
        attach :  { type: Sequelize.STRING},
        created_at: {
            type: Sequelize.DATE,
            get() {
                let time = this.getDataValue('created_at')
                return !time?null:moment(time).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        deleted_at:{
            type: Sequelize.DATE,
            get() {
                let time = this.getDataValue('deleted_at')
                return !time?null:moment(time).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updated_at:{
            type: Sequelize.DATE,
            get() {
                let time = this.getDataValue('updated_at')
                return !time?null:moment(time).format('YYYY-MM-DD HH:mm:ss');
            }
        }
	}, {
		tableName: 'wxorder',
		comment: '微信订单表',
		underscored: true,
		'paranoid': true
	});
	WxOrder.associate = function(models) {
    }
	return WxOrder;
};
