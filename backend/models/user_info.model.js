module.exports = (sequelize, Sequelize) => {
	const UserInfo = sequelize.define('user_info', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		id_user: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		bio: {
			type: Sequelize.STRING,
		},
	});
	return UserInfo;
};
