let Sequelize = require("sequelize");
import moment from 'moment'
import _ from 'lodash';
module.exports = function(sequelize, DataTypes) {
	let Order = sequelize.define("Order", {
		id: { type: Sequelize.STRING, primaryKey: true,allowNull: false},
        playerid :  { type: Sequelize.STRING},
        deviceid:  { type: Sequelize.STRING},
        wxorder:{ type: Sequelize.STRING},
        days:  { type: Sequelize.INTEGER,defaultValue:1},
        totalprice :  { type: Sequelize.FLOAT,defaultValue:0},
        realprice :  { type: Sequelize.FLOAT,defaultValue:0},
        hotelprice :  { type: Sequelize.FLOAT,defaultValue:0},
        jdprice :  { type: Sequelize.FLOAT,defaultValue:0},
        content :  { type: Sequelize.STRING},
        status :  { type:   Sequelize.ENUM,
            values: ['start', 'end']},
        time:{ type: Sequelize.INTEGER,defaultValue:1},
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
		'paranoid': true
	});
	Order.associate = function(models) {
        Order.belongsTo(models.Device, {
            onDelete: "CASCADE",
			foreignKey: {
				name : 'deviceid',
				allowNull: false
			}
        });
    }
	return Order;
};
