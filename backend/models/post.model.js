module.exports = (sequelize, Sequelize) => {
	const Post = sequelize.define('posts', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		content: {
			type: Sequelize.STRING,
		},
	});
	return Post;
};
