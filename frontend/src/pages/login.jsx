import { useRef } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
	const user = useRef();
	const pass = useRef();

	const navigate = useNavigate();

	const handleLogin = (e) => {
		e.preventDefault();

		AuthService.login(user.current.value, pass.current.value).then(() => {
			navigate('/profile');
		});
	};

	return (
		<div>
			<h2>Prihlaseni</h2> <br />
			<a href='/register'>Register</a> <br />
			<form onSubmit={handleLogin}>
				<label>Prezdivku</label>
				<input type='text' ref={user} />
				<label>Heslo</label>
				<input type='password' ref={pass} />
				<input type='submit' value='Prihlasit se' />
			</form>
		</div>
	);
};

export default LoginPage;
