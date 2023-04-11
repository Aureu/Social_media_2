const controller = require('../controllers/user.controller');

module.exports = function (app) {
	const multer = require('multer');

	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, 'upload/');
		},
		filename: (req, file, cb) => {
			cb(null, file.originalname);
		},
	});

	const upload = multer({ storage: storage });

	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'x-access-token, Origin, Content-Type, Accept'
		);
		next();
	});

	app.post('/api/user', controller.getUser);

	app.post('/api/user/change', controller.change);

	app.post('/api/user/delete/:id', controller.deleteUser);

	app.get('/api/user/search', controller.searchUsers);

	app.post('/api/user/bio', controller.getBio);

	app.post('/api/user/change_bio', controller.changeBio);

	app.post('/api/user/upload', upload.single('file'), controller.upload);

	app.get('/api/users/get-all', controller.getUsers);

	app.post('/api/user/update/:id', controller.updateUser);
};
