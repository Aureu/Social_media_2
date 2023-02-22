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

// USER RELATIONS
db.user_info.belongsTo(db.user, {
	foreign_key: 'user_id',
});

db.user_avatar.belongsTo(db.user, {
	foreign_key: 'user_id',
});

// POST RELATIONS
db.post.belongsTo(db.user, {
	foreign_key: 'user_id',
});

// COMMENT RELATIONS
db.comment.belongsTo(db.user, {
	foreign_key: 'user_id',
});

db.comment.belongsTo(db.comment, {
	foreign_key: 'parent_comment_id',
});

// LIKE RELATIONS
db.like.belongsTo(db.user, {
	foreign_key: 'user_id',
});

db.like.belongsTo(db.post, {
	foreign_key: 'post_id',
});

// FOLLOWER RELATIONS
db.follower.belongsTo(db.user, {
	foreign_key: 'follower_user_id',
});

db.follower.belongsTo(db.user, {
	foreign_key: 'following_user_id',
});

module.exports = db;
