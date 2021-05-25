let Sequelize = require("sequelize");
import BaseManager from './baseManager';
class WxOrderManager extends BaseManager {
    constructor(app) {
        super(app,'WxOrder');
    }
}
module.exports = app => {
    return new WxOrderManager(app)
};
