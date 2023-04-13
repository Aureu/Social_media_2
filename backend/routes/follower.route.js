const controller = require('../controllers/follower.controller');

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'x-access-token, Origin, Content-Type, Accept'
		);
		next();
	});

	app.post('/api/users/:id/follow', controller.create);
	app.post('/api/users/:id/check-follow', controller.getFollow);
	app.post('/api/users/get-followers', controller.getFollowers);
	app.post('/api/users/get-followings', controller.getFollowings);
	app.post('/api/user/unfollow', controller.unfollowUser);
};
