const db = require('../models');
const User = db.user;

exports.getUser = (req, res) => {
	User.findOne({ where: { id: req.body.id } }).then((user) => {
		res.send(user).status(200);
	});
};

exports.change = (req, res) => {
	User.update(
		{
			...req.body,
		},
		{
			where: { id: req.body.user_id },
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
	User.update({ isDeleted: 1 }, { where: { id: req.body.user_id } }).then(
		() => {
			res.sendStatus(200);
		}
	);
};
