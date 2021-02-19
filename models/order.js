let Sequelize = require("sequelize");
import moment from 'moment'
import _ from 'lodash';
module.exports = function(sequelize, DataTypes) {
	let Order = sequelize.define("Order", {
		id: { type: Sequelize.STRING, primaryKey: true,allowNull: false},
        playerid :  { type: Sequelize.STRING},
        deviceid:  { type: Sequelize.STRING},
        content :  { type: Sequelize.STRING},
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
		tableName: 'order',
		comment: '订单表',
		underscored: true,
		'timestamps': true,
		'paranoid': true
	});
	Order.associate = function(models) {

    }
	return Order;
};
