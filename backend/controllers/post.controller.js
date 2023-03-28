const db = require('../models');
const Post = db.post;
const User = db.user;

exports.get = (req, res) => {
	Post.findAll({
		where: { id_user: req.body.user_id },
		include: [
			{
				model: User,
				attributes: ['first_name', 'last_name'],
			},
		],
	}).then((posts) => {
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

exports.change = (req, res) => {
	Post.update(
		{
			...req.body,
		},
		{
			where: { id: req.body.post_id },
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
	Post.update({ isDeleted: 1 }, { where: { id: req.body.post_id } }).then(
		() => {
			res.sendStatus(200);
		}
	);
};
