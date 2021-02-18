export default class BaseManager {
  constructor(app, model_name) {
    this.app = app;
    this.model = app.db[model_name];
  }
  async getById(id) {
    let result = await this.model.findOne({
      where: {
        id: id
      }
    })
    return result;
  }
  async delete(query) {
    let result = await this.model.destroy({
      where: query
    });
    return result;
  }
  async create(param) {
		let [result] = await this.model.bulkCreate([param], {
			ignoreDuplicates: true
		});
		return result;
	}
  async update(param, query) {
    let result = await this.model.update(param, {
      where: query
    });
    return result;
  }
  async countAll(param = {}) {
    let count = await this.model.count({
      where: param
    });
    return count;
  }
  async getOne(param) {
    let result = await this.model.findOne({
      where: param,
      order: [
        ['created_at', 'DESC']
      ]
    })
    return result;
  }
  async findOrCreate(param, query) {
    let [result, iscreated] = await this.model.findOrCreate({
      where: query,
      defaults: param
    });
    return [result, iscreated];
  }
  async bulkCreate(data_list){
    let result = await this.model.bulkCreate(data_list, {
        ignoreDuplicates: true
    });
    return result;
}
}