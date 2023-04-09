const db = require('../models');
const Follower = db.follower;
const Notification = db.notification;
const User = db.user;

/* exports.get = (req, res) => {
	Follower.findAll({ where: { id_post: req.body.post_id } }).then((comments) => {
		res.send(comments).status(200);
	});
}; */

exports.create = async (req, res) => {
	try {
		const { id } = req.params;
		const { userId } = req.body;

		console.log(`User ${userId} is following user ${id}.`);

		// Find the user that is being followed
		const followedUser = await User.findByPk(id);

		// Find the user that is following
		const followingUser = await User.findByPk(userId);

		// Create a new follow relationship between the two users
		const follow = await Follower.create({
			id_follower_user: followedUser.id,
			id_following_user: followingUser.id,
		});

		// Create a new notification
		await Notification.create({
			id_user: followedUser.id,
			id_source: followingUser.id,
			type: 'follow',
			description: `${followingUser.username} is now following you.`,
		});

		res.status(201).json(follow);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Unable to follow user.' });
	}
};

exports.getFollow = async (req, res) => {
	try {
		const { id } = req.params;
		const { userId } = req.body;

		const follow = await Follower.findOne({
			where: {
				id_follower_user: id,
				id_following_user: userId,
			},
		});

		res.status(200).json(follow);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Unable to check follow status.' });
	}
};

exports.getFollowers = async (req, res) => {
	Follower.findAll({
		where: { id_follower_user: req.body.id_user },
	}).then((followers) => {
		res.send(followers).status(200);
	});
};

exports.getFollowings = async (req, res) => {
	Follower.findAll({
		where: { id_following_user: req.body.id_user },
	}).then((followers) => {
		res.send(followers).status(200);
	});
};
