const controller = require('../controllers/user.controller');

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'x-access-token, Origin, Content-Type, Accept'
		);
		next();
	});

	app.post('/api/user', controller.getUser);

	app.post('/api/user/change', controller.change);

	app.post('/api/user/delete', controller.deleteUser);
};
