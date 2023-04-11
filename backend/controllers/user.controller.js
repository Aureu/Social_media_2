const db = require('../models');
const User = db.user;
const UserBio = db.user_info;

const { Op } = require('sequelize');

exports.getUser = (req, res) => {
	User.findOne({ where: { id: req.body.id } }).then((user) => {
		res.send(user).status(200);
	});
};

exports.getUsers = (req, res) => {
	User.findAll().then((users) => {
		res.status(200).send(users);
	});
};

exports.getBio = (req, res) => {
	console.log(req.body.id);
	UserBio.findOne({ where: { id_user: req.body.id } }).then((bio) => {
		res.send(bio).status(200);
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

exports.changeBio = (req, res) => {
	UserBio.update(
		{
			bio: req.body.bio,
		},

		{
			where: { id_user: req.body.user_id },
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

exports.upload = (req, res) => {
	//if (req.body.api_key !== process.env.API_TOKEN) return res.sendStatus(401);

	res.sendStatus(200);
};
