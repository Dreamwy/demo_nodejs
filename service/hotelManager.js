let Sequelize = require("sequelize");
let shortid=require("js-shortid");
import BaseManager from './baseManager';
import _ from 'lodash';
class HotelManager extends BaseManager {
    constructor(app) {
        super(app,'Hotel');
    }
    
    async createHotel(param) {
        console.log(param)
        _.merge(param,{"id":shortid.gen()})
		let [result] = await this.model.bulkCreate([param], {
			ignoreDuplicates: true
		});
		return result;
    }
    
    async getMany(param) {
		let {page = 0, size = 10, query = {}} = param
        let result = await this.app.db.Hotel.findAndCountAll({
			where: query,
			order: [['created_at', 'DESC']],
			offset: Number(page) * Number(size),
			limit: Number(size)
		});
		return result;
    }
}
module.exports = app => {
    return new HotelManager(app)
};
