let Sequelize = require("sequelize");
import BaseManager from './baseManager';
class MacManager extends BaseManager {
    constructor(app) {
        super(app,'Mac');
    }
	

	async getBydeviceqrid(deviceqrid) {
        let result = await this.model.findOne({
			where: {
			  deviceqrid: deviceqrid
			}
		  })
		  return result;
    }
}
module.exports = app => {
    return new MacManager(app)
};
