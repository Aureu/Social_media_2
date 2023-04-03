const db = require('../models');
const Notification = db.notification;

exports.get = (req, res) => {
	Notification.findAll({
		where: { id_user: req.body.id_user },
		order: [['createdAt', 'DESC']], // Sort by createdAt column in descending order
	})
		.then((notifications) => {
			res.send(notifications).status(200);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Unable to fetch notifications.' });
		});
};
