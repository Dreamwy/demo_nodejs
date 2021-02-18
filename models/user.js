let Sequelize = require("sequelize");
import moment from 'moment'
module.exports = function(sequelize, DataTypes) {
	let User = sequelize.define("User", {
		id: { type: Sequelize.INTEGER, primaryKey: true,autoIncrement: true },
		fullname: { type: Sequelize.STRING},
		nickname: { type: Sequelize.STRING },
		gender :  { type: Sequelize.INTEGER},
		mobile :  { type: Sequelize.STRING},
		password :  { type: Sequelize.STRING},
		status :  { type: Sequelize.BOOLEAN,defaultValue:true},
		headimg :  { type: Sequelize.STRING},
		corpid :   { type: Sequelize.INTEGER},
		vip : { type: Sequelize.INTEGER},
		extra : {type:Sequelize.TEXT},
		username: { type: Sequelize.STRING },
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
		tableName: 'uc_user',
		comment: '用户基础表',
		underscored: true,
		'timestamps': true,
		'paranoid': true
	});
	User.associate = function(models) {
	
	}
	return User;
};
