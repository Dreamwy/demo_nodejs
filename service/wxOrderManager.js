let Sequelize = require("sequelize");
import BaseManager from './baseManager';
class WxOrderManager extends BaseManager {
    constructor(app) {
        super(app,'WxOrder');
    }
    async getByPlayeridandDeviceid(playerid,deviceid) {
        let result = await this.app.db.WxOrder.findOne({
          where: {
            openid: playerid,
            attach: deviceid
            
          },
          order: [['created_at', 'DESC']],
        })
        return result;
      }
}
module.exports = app => {
    return new WxOrderManager(app)
};
