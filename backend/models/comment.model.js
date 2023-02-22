module.exports = (sequelize, Sequelize) => {
	const Comment = sequelize.define('comments', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		post_id: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		content: {
			type: Sequelize.STRING,
		},
	});
	return Comment;
};
