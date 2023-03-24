module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('users', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		first_name: {
			type: Sequelize.STRING,
		},
		last_name: {
			type: Sequelize.STRING,
		},
		username: {
			type: Sequelize.STRING,
		},
		email: {
			type: Sequelize.STRING,
		},
		password: {
			type: Sequelize.STRING,
		},
		location: {
			type: Sequelize.STRING,
		},
		job: {
			type: Sequelize.STRING,
		},
		isDeleted: {
			type: Sequelize.BOOLEAN,
		},
	});

	return User;
};
