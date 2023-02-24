const db = require('../models');
const Comment = db.comment;

exports.get = (req, res) => {
	Comment.findAll({ where: { id_post: req.body.post_id } }).then((comments) => {
		res.send(comments).status(200);
	});
};

exports.create = (req, res) => {
	Comment.create({
		id_user: req.body.user_id,
		id_post: req.body.post_id,
		content: req.body.content,
	})
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err) => {
			res.status(500).send({ message: err.message });
		});
};

exports.change = (req, res) => {
	Comment.update(
		{
			...req.body,
		},
		{
			where: { id: req.body.comment_id },
		}
	)
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err) => {
			res.status(500).send({ message: err.message });
		});
};

exports.delete = (req, res) => {
	Comment.update({ isDeleted: 1 }, { where: { id: req.body.comment_id } }).then(
		() => {
			res.sendStatus(200);
		}
	);
};
