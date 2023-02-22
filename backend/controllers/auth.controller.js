const db = require('../models');
const config = require('../config/auth.config');
const User = db.user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
	User.create({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8),
	})
		.then(() => {
			res.sendStatus(200);
		})
		.catch(() => {
			res.status(500).send({ message: err.message });
		});
};

exports.login = (req, res) => {
	User.findOne({
		where: {
			username: req.body.username,
		},
	})
		.then((user) => {
			if (!user) {
				return res.status(404).send({ message: 'User not found' });
			}
			let passwordIsValid = bcrypt.compareSync(
				req.body.password,
				user.password
			);

			if (!passwordIsValid) {
				return res.status(401).send({
					accessToken: null,
					message: 'Invalid Password!',
				});
			}
			let token = jwt.sign({ id: user.id }, config.secret, {
				expiresIn: 86400, //24hours
			});
			if (user) {
				res.status(200).send({
					id: user.id,
					first_name: user.first_name,
					last_name: user.last_name,
					username: user.username,
					email: user.email,
					accessToken: token,
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send(err.message);
		});
};
