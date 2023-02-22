module.exports = (sequelize, Sequelize) => {
	const Like = sequelize.define('likes', {
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
	});
	return Like;
};
