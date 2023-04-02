const db = require('../models');
const Follower = db.follower;
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
