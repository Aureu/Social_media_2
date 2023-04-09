const controller = require('../controllers/notification.controller');

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'x-access-token, Origin, Content-Type, Accept'
		);
		next();
	});

	app.post('/api/notifications/get', controller.get);
	app.post('/api/notification/viewed', controller.markNotificationAsViewed);
};
