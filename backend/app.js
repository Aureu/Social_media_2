const express = require('express');
const cors = require('cors');

const app = express();

const db = require('./models');

const User = db.user;

db.sequelize.sync({ force: true }).then(() => {
	console.log('Drop and Resync DB');
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

// set port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
function initial() {
	User.create({
		first_name: 'John',
		last_name: 'Doe',
		username: 'test',
		email: 'john@example.com',
		password: 'test',
	});
}
