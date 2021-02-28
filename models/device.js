let Sequelize = require("sequelize");
import moment from 'moment'
module.exports = function(sequelize, DataTypes) {
	let Device = sequelize.define("Device", {
		id: { type: Sequelize.STRING, primaryKey: true,allowNull: false},
		status: { type: Sequelize.STRING},
        hotelid:  { type: Sequelize.STRING,allowNull: false},
		room : {type:Sequelize.STRING},
		installman: { type: Sequelize.STRING },
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
		tableName: 'device',
		comment: '设备表',
		underscored: true,
        'paranoid':
         true
	});
	Device.associate = function(models) {
        Device.belongsTo(models.Hotel, {
            onDelete: "CASCADE",
			foreignKey: {
				name : 'hotelid',
				allowNull: false
			}
        });
        
	}
	return Device;
};
