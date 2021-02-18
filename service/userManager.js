let Sequelize = require("sequelize");
import BaseManager from './baseManager';
class UserManager extends BaseManager {
    constructor(app) {
        super(app,'User');
    }
    
    async getMany(param) {
		let {page = 0, size = 10, query = {}} = param
        let result = await this.app.db.User.findAndCountAll({
			where: query,
			order: [['created_at', 'DESC']],
			offset: Number(page) * Number(size),
			limit: Number(size)
		});
		return result;
    }
}
module.exports = app => {
    return new UserManager(app)
};
