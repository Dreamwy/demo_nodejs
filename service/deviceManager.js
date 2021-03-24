let Sequelize = require("sequelize");
import BaseManager from './baseManager';
class DeviceManager extends BaseManager {
    constructor(app) {
        super(app,'Device');
    }
    
    async getMany(param) {
		let {page = 0, size = 10, query = {}} = param
        let result = await this.app.db.Device.findAndCountAll({
            include:[{model:this.app.db.Hotel}],
			where: query,
			order: [['created_at', 'DESC']],
			offset: Number(page) * Number(size),
			limit: Number(size)
		});
		return result;
    }

    async getIdsByhotelid(param){
        let {page = 0, size = 10} = param
        let result = await this.app.db.Device.findAndCountAll({
			where: {hotelid:param},
			order: [['created_at', 'DESC']],
			offset: Number(page) * Number(size),
			limit: Number(size)
		});
		return result;
    }
}
module.exports = app => {
    return new DeviceManager(app)
};
