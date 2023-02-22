module.exports = (sequelize, Sequelize) => {
	const UserAvatar = sequelize.define('user_avatars', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		id_user: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		file_src: {
			type: Sequelize.STRING,
		},
	});
	return UserAvatar;
};
