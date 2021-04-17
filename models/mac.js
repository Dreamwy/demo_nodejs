let Sequelize = require("sequelize");
import moment from 'moment'
module.exports = function(sequelize, DataTypes) {
	let Mac = sequelize.define("Mac", {
		mac: { type: Sequelize.STRING, primaryKey: true,allowNull: false},
		deviceqrid: { type: Sequelize.STRING},
        deviceqr:  { type: Sequelize.DataTypes.BLOB('medium')},
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
		tableName: 'mac',
		comment: '设备表',
		underscored: true,
        'paranoid':
         true
	});
	Mac.associate = function(models) {
        
	}
	return Mac;
};
