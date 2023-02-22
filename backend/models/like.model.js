module.exports = (sequelize, Sequelize) => {
	const Like = sequelize.define('likes', {
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
	});
	return Like;
};
