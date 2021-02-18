let Sequelize = require("sequelize");
import BaseManager from './baseManager';
import _ from 'lodash';
class HotelManager extends BaseManager {
    constructor(app) {
        super(app,'Hotel');
    }
    
    async createHotel(param) {
        console.log(param);
        _.merge(param,{"id":uuid()})
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

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
