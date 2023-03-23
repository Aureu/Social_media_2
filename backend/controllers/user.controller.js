const db = require('../models');
const User = db.user;

const { Op } = require('sequelize');

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

exports.deleteUser = (req, res) => {
	User.update({ isDeleted: 1 }, { where: { id: req.body.user_id } })
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err) => {
			res.status(500).send({ message: err.message });
		});
};

exports.searchUsers = async (req, res) => {
	const { q } = req.query;

	if (!q) {
		return res.status(400).json({ message: 'Search query is required' });
	}

	try {
		const users = await User.findAll({
			where: {
				[Op.or]: [
					{ first_name: { [Op.like]: `%${q}%` } },
					{ last_name: { [Op.like]: `%${q}%` } },
				],
			},
		});

		res.json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
