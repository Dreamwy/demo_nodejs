let Sequelize = require("sequelize");
import moment from 'moment'
module.exports = function(sequelize, DataTypes) {
	let DeviceRecord = sequelize.define("DeviceRecord", {
		id: { type: Sequelize.STRING, primaryKey: true,allowNull: false},
        deviceid: { type: Sequelize.STRING},
        orderid: { type: Sequelize.STRING},
        playerid :  { type: Sequelize.STRING},
        content:  { type: Sequelize.INTEGER},
		installtime: {
            type: Sequelize.DATE,
            get() {
                let time = this.getDataValue('installtime')
                return !time?null:moment(time).format('YYYY-MM-DD HH:mm:ss');
            }
        },
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
		tableName: 'deviceRecord',
		comment: '设备使用记录',
		underscored: true,
        'paranoid':
         true
	});
	DeviceRecord.associate = function(models) {
        DeviceRecord.belongsTo(models.Device, {
            onDelete: "CASCADE",
			foreignKey: {
				name : 'deviceid',
				allowNull: false
			}
        });
        DeviceRecord.belongsTo(models.Order, {
            onDelete: "CASCADE",
			foreignKey: {
				name : 'orderid',
				allowNull: false
			}
        });
        
	}
	return DeviceRecord;
};
