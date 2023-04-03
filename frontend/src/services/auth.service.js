import axios from 'axios';

const API_URL = `${process.env.REACT_APP_HOST}/api/auth/`;

class AuthService {
	login(username, password) {
		return axios
			.post(API_URL + 'login', {
				username,
				password,
			})
			.then((response) => {
				if (response.data.accessToken) {
					localStorage.setItem('user', JSON.stringify(response.data));
				}

				return response.data;
			});
	}

	logout() {
		localStorage.removeItem('user');
	}

	register = async (
		first_name,
		last_name,
		username,
		job,
		location,
		email,
		password
	) => {
		try {
			const response = await axios.post(API_URL + 'signup', {
				first_name,
				last_name,
				username,
				job,
				location,
				email,
				password,
			});

			return response.data;
		} catch (error) {
			console.error('Register error:', error);
			throw error;
		}
	};

	getCurrentUser() {
		return JSON.parse(localStorage.getItem('user'));
	}
}

export default new AuthService();
