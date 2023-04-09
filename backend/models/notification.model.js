module.exports = (sequelize, Sequelize) => {
	const Like = sequelize.define('notifications', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		id_user: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		id_source: {
			type: Sequelize.INTEGER,
			foreignKey: true,
		},
		type: {
			type: Sequelize.STRING,
		},
		description: {
			type: Sequelize.STRING,
		},
		viewed: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		},
	});
	return Like;
};
