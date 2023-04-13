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
	try {
		const followings = await Follower.findAll({
			where: { id_following_user: req.body.id_user },
			include: [
				{
					model: User,
					as: 'followerUser', // Update the alias here
					attributes: ['id', 'username', 'first_name', 'last_name'],
				},
			],
		});

		res.status(200).json(followings);
	} catch (error) {
		console.error('Error fetching followings:', error);
		res.status(500).json({ message: 'Error fetching followings', error });
	}
};

exports.unfollowUser = async (req, res) => {
	const following_user_id = req.body.following_user_id;
	const follower_user_id = req.body.follower_user_id;

	try {
		const result = await Follower.destroy({
			where: {
				id_following_user: following_user_id,
				id_follower_user: follower_user_id,
			},
		});

		if (result) {
			res.status(200).json({
				message: `User ${following_user_id} has unfollowed user ${follower_user_id}`,
			});
		} else {
			res.status(404).json({
				error: 'No follower relationship found',
			});
		}
	} catch (error) {
		res.status(500).json({
			error: 'Error while unfollowing user',
		});
	}
};
