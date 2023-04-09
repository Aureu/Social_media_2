const express = require('express');
const cors = require('cors');

const app = express();

const db = require('./models');

const User = db.user;

// Remove the "force: true" option from the sync method
db.sequelize.sync().then(() => {
	console.log('Database is connected');
	initial();
});

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require('./routes/auth.route')(app);
require('./routes/user.route')(app);
require('./routes/post.route')(app);
require('./routes/comment.route')(app);
require('./routes/follower.route')(app);
require('./routes/notification.route')(app);

app.use('/upload', express.static('upload'));

// set port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});

function initial() {}
