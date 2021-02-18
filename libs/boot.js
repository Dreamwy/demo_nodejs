import http from 'http';
import pjson from '../package.json';
module.exports = app => {
    app.db.sequelize.sync().done(() => {
        let server = http.createServer(app)
        server.listen(app.get('port'), () => {
            console.log(`${pjson.name} api - Port ${app.get('port')}`);
        });
    });
};
