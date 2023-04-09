const config = require('../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
	host: config.HOST,
	dialect: config.dialect,
	operatorsAliases: false,

	pool: {
		max: config.pool.max,
		min: config.pool.min,
		acquire: config.pool.acquire,
		idle: config.pool.idle,
	},
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

sequelize.options.timezone = 'Europe/Prague';

db.user = require('./user.model.js')(sequelize, Sequelize);
db.post = require('./post.model.js')(sequelize, Sequelize);
db.comment = require('./comment.model.js')(sequelize, Sequelize);
db.follower = require('./follower.model.js')(sequelize, Sequelize);
db.like = require('./like.model.js')(sequelize, Sequelize);
db.user_avatar = require('./user_avatar.model.js')(sequelize, Sequelize);
db.user_info = require('./user_info.model.js')(sequelize, Sequelize);
db.notification = require('./notification.model.js')(sequelize, Sequelize);

// USER RELATIONS
db.user_info.belongsTo(db.user, {
	foreignKey: 'id_user',
});

db.user_avatar.belongsTo(db.user, {
	foreignKey: 'id_user',
});

// POST RELATIONS
db.post.belongsTo(db.user, {
	foreignKey: 'id_user',
});

db.post.hasMany(db.like, {
	foreignKey: 'id_post',
	as: 'likes',
});

// COMMENT RELATIONS
db.comment.belongsTo(db.user, {
	foreignKey: 'id_user',
});

db.comment.belongsTo(db.comment, {
	foreignKey: 'parent_comment_id',
});

db.comment.hasMany(db.like, {
	foreignKey: 'id_comment',
	as: 'likes',
});

// LIKE RELATIONS
db.like.belongsTo(db.user, {
	foreignKey: 'id_user',
});

db.like.belongsTo(db.post, {
	foreignKey: 'id_post',
});

db.like.belongsTo(db.comment, {
	foreignKey: 'id_comment',
});

// FOLLOWER RELATIONS
db.follower.belongsTo(db.user, {
	foreignKey: 'id_follower_user',
});

db.follower.belongsTo(db.user, {
	foreignKey: 'id_following_user',
});

module.exports = db;
