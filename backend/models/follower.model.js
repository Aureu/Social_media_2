module.exports = (sequelize, Sequelize) => {
	const Follow = sequelize.define('followers', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		follower_user_id: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		following_user_id: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
	});
	return Follow;
};
