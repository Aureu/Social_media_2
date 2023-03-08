module.exports = (sequelize, Sequelize) => {
	const Comment = sequelize.define('comments', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		id_user: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		id_post: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		content: {
			type: Sequelize.STRING,
		},
		isDeleted: {
			type: Sequelize.BOOLEAN,
		},
	});
	return Comment;
};
