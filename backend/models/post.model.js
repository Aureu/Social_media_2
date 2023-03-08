module.exports = (sequelize, Sequelize) => {
	const Post = sequelize.define('posts', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		id_user: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		content: {
			type: Sequelize.TEXT,
		},
		isDeleted: {
			type: Sequelize.BOOLEAN,
		},
	});
	return Post;
};
