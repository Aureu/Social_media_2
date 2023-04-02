const db = require('../models');
const Notification = db.notification;

exports.get = (req, res) => {
	const { id_user } = req.body;

	Notification.findAll({
		where: { id_user },
	})
		.then((notifications) => {
			res.send(notifications).status(200);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Unable to fetch notifications.' });
		});
};
