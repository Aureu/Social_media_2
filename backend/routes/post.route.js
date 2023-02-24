const controller = require('../controllers/post.controller');

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'x-access-token, Origin, Content-Type, Accept'
		);
		next();
	});

	app.post('/api/post/create', controller.create);

	app.post('/api/post', controller.get);

	app.post('/api/post/edit', controller.change);

	app.post('/api/post/delete', controller.delete);
};
