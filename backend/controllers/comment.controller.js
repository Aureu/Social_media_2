const db = require('../models');
const Comment = db.comment;
const User = db.user;
const Notification = db.notification;
const Like = db.like;

const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

exports.get = (req, res) => {
	Comment.findAll({
		where: { id_post: req.body.postId },
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
		],
		attributes: {
			include: [
				[Sequelize.fn('COUNT', Sequelize.col('likes.id')), 'likesCount'],
			],
		},
		group: ['comments.id'],
	}).then((comments) => {
		res.send(comments).status(200);
	});
};

exports.create = (req, res) => {
	Comment.create({
		id_user: req.body.userId,
		id_post: req.body.postId,
		content: req.body.content,
		isDeleted: 0,
	})
		.then(() => {
			res.status(200).send({ message: 'Comment created' });
		})
		.catch((err) => {
			res.status(500).send({ message: err.message });
		});
};

exports.change = (req, res) => {
	Comment.update(
		{
			...req.body,
		},
		{
			where: { id: req.body.comment_id },
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
	Comment.update({ isDeleted: 1 }, { where: { id: req.body.comment_id } }).then(
		() => {
			res.sendStatus(200);
		}
	);
};

exports.toggleLike = async (req, res) => {
	try {
		const id_comment = req.body.commentId;
		const id_user = req.body.userId;

		// Check if the user has already liked the comment
		const existingLike = await Like.findOne({
			where: { id_comment, id_user, type: 'comment' },
		});

		// If a like exists, remove it. Otherwise, create a new like.
		if (existingLike) {
			await Like.destroy({ where: { id: existingLike.id } });
			res.status(200).send({ liked: false });
		} else {
			await Like.create({ id_comment, id_user, type: 'comment' });

			// Fetch user data to get the username
			const user = await User.findByPk(id_user);

			if (!user) {
				res.status(404).send({ message: 'User not found' });
				return;
			}

			const username = user.username;

			// Get the comment owner
			const comment = await Comment.findByPk(id_comment, {
				include: { model: User, as: 'user' },
			});

			if (!comment) {
				res.status(404).send({ message: 'Comment not found' });
				return;
			}

			// Create a new notification only if the user who liked the comment is not the same as the comment owner
			if (comment.id_user !== id_user) {
				await Notification.create({
					id_user: comment.id_user,
					id_source: id_user,
					type: 'like',
					description: `${username} liked your comment`,
				});
			}

			res.status(200).send({ liked: true });
		}
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};
