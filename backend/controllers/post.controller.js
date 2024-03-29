const db = require('../models');
const Post = db.post;
const User = db.user;
const Like = db.like;
const Notification = db.notification;
const Comment = db.comment;
const Follower = db.follower;

const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

exports.get = (req, res) => {
	Post.findAll({
		where: { id_user: req.body.user_id },
		include: [
			{
				model: User,
				attributes: ['first_name', 'last_name'],
			},
			{
				model: Like,
				as: 'likes',
				attributes: [],
			},
			{
				model: Comment,
				as: 'comments',
				attributes: [],
			},
		],
		attributes: {
			include: [
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn('DISTINCT', Sequelize.col('likes.id'))
					),
					'likesCount',
				],
				[
					Sequelize.fn(
						'COUNT',
						Sequelize.fn('DISTINCT', Sequelize.col('comments.id'))
					),
					'commentsCount',
				],
			],
		},
		group: ['posts.id'],
		subQuery: false,
	})
		.then((posts) => {
			res.send(posts).status(200);
		})
		.catch((err) => {
			res.status(500).send({ message: err.message });
		});
};

exports.getPosts = (req, res) => {
	Post.findAll({
		include: [
			{
				model: User,
				attributes: ['first_name', 'last_name'],
			},
		],
	}).then((posts) => {
		res.status(200).send(posts);
	});
};

exports.create = (req, res) => {
	Post.create({
		id_user: req.body.user_id,
		content: req.body.content,
		isDeleted: 0,
	})
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err) => {
			res.status(500).send({ message: err.message });
		});
};

exports.change = (req, res) => {
	Post.update(
		{
			...req.body,
		},
		{
			where: { id: req.params.id },
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
	Post.destroy({ where: { id: req.params.postId } })
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err) => {
			res.status(500).send({ message: err.message });
		});
};

exports.toggleLike = async (req, res) => {
	try {
		const id_post = req.body.postId;
		const id_user = req.body.userId;

		// Check if the user has already liked the post
		const existingLike = await Like.findOne({ where: { id_post, id_user } });

		// If a like exists, remove it. Otherwise, create a new like.
		if (existingLike) {
			await Like.destroy({ where: { id: existingLike.id } });
			res.status(200).send({ liked: false });
		} else {
			await Like.create({ id_post, id_user, type: 'post' });

			// Fetch user data to get the username
			const user = await User.findByPk(id_user);

			if (!user) {
				res.status(404).send({ message: 'User not found' });
				return;
			}

			const username = user.username;

			// Get the post owner
			const post = await Post.findByPk(id_post, {
				include: { model: User, as: 'user' },
			});

			if (!post) {
				res.status(404).send({ message: 'Post not found' });
				return;
			}

			// Create a new notification only if the user who liked the post is not the same as the post owner
			if (post.id_user !== id_user) {
				await Notification.create({
					id_user: post.id_user,
					id_source: id_user,
					type: 'like',
					description: `${username} liked your post`,
				});
			}

			res.status(200).send({ liked: true });
		}
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

exports.getFollowingPosts = async (req, res) => {
	try {
		const currentUserId = req.body.id; // Assuming you have user ID in req.user object

		// Fetch users the current user is following
		const user = await User.findOne({
			where: { id: currentUserId },
			include: [{ model: Follower, as: 'followingUser' }],
		});

		const followingIds = user.followingUser.map(
			(followingUser) => followingUser.id_follower_user
		);

		console.log(user);

		// Fetch posts and comments created by the followed users
		const posts = await Post.findAll({
			where: { id_user: followingIds },
			include: [
				{ model: User, attributes: ['first_name', 'last_name'] },
				{
					model: Comment,
					as: 'comments',
					include: [
						{
							model: User,
							attributes: ['first_name', 'last_name'],
						},
					],
				},
				{ model: Like, as: 'likes' },
			],

			order: [['createdAt', 'DESC']],
		});

		res.json({ posts });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal server error' });
	}
};
