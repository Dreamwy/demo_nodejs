let Sequelize = require("sequelize");
import moment from 'moment'
import _ from 'lodash';
module.exports = function(sequelize, DataTypes) {
	let Hotel = sequelize.define("Hotel", {
		id: { type: Sequelize.STRING, primaryKey: true,allowNull: false},
        province :  { type: Sequelize.STRING},
        city :  { type: Sequelize.STRING},
        address :  { type: Sequelize.STRING},
        name :  { type: Sequelize.STRING},
        payway :    { type:   Sequelize.ENUM,
            values: ['hotelpay', 'wxpay']},
        price :  { type: Sequelize.INTEGER,defaultValue:15},
        saletime: { type: Sequelize.INTEGER,defaultValue:38},
        divide: { type: Sequelize.FLOAT,defaultValue:0.4},
        selldivide: { type: Sequelize.FLOAT,defaultValue:0.2},
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
		tableName: 'hotel',
		comment: '酒店表',
		underscored: true,
		'paranoid': true
    });
    
	Hotel.associate = function(models) {
        // Hotel.hasMany(models.Device, {foreignKey: 'id'})

    }
	return Hotel;
};
