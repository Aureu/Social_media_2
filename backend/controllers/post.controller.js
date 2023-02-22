const db = require('../models');
const Post = db.post;

exports.get = (req, res) => {
	Post.findAll({ where: { id_user: req.body.user_id } }).then((posts) => {
		res.send(posts).status(200);
	});
};

exports.create = (req, res) => {
	Post.create({
		id_user: req.body.user_id,
		content: req.body.content,
	})
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err) => {
			res.status(500).send({ message: err.message });
		});
};
