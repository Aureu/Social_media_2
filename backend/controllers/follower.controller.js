const db = require('../models');
const Follower = db.follower;

/* exports.get = (req, res) => {
	Follower.findAll({ where: { id_post: req.body.post_id } }).then((comments) => {
		res.send(comments).status(200);
	});
}; */

exports.create = (req, res) => {
	Follower.create({
		id_following_user: req.body.following_id,
		id_follower_user: req.body.follower_id,
	})
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err) => {
			res.status(500).send({ message: err.message });
		});
};
