const db = require('../models');
const Notification = db.notification;

exports.get = (req, res) => {
	Notification.findAll({
		where: { id_user: req.body.id_user, viewed: false },
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

exports.markNotificationAsViewed = async (req, res) => {
	try {
		const id = req.body.notificationId;

		await Notification.update({ viewed: true }, { where: { id } });

		res.sendStatus(200);
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};
