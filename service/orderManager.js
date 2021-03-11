let Sequelize = require("sequelize");
let shortid=require("js-shortid");
import _ from 'lodash';
import BaseManager from './baseManager';
class OrderManager extends BaseManager {
    constructor(app) {
        super(app,'Order');
    }

    async createOrder(param) {
        _.merge(param,{"id":shortid.uuid(),"status":"start"})
		let [result] = await this.model.bulkCreate([param], {
			ignoreDuplicates: true
		});
		return result;
    }

    async getMany(param) {
		let {page = 0, size = 10, query = {}} = param
        let result = await this.app.db.Order.findAndCountAll({
            include:[{model:this.app.db.Device}],
			where: query,
			order: [['created_at', 'DESC']],
			offset: Number(page) * Number(size),
			limit: Number(size)
		});
		return result;
    }

    async getByDeviceId(id) {
        let result = await this.model.findOne({
          where: {
            deviceid: id
          },
          order: [['created_at', 'DESC']],
        })
        return result;
      }
}
module.exports = app => {
    return new OrderManager(app)
};
