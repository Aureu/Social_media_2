module.exports = (sequelize, Sequelize) => {
	const Follow = sequelize.define('followers', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		id_follower_user: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		id_following_user: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
	});
	return Follow;
};
