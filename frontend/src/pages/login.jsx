import { useRef, useState } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
	const user = useRef();
	const pass = useRef();

	const [error, setError] = useState('');

	const navigate = useNavigate();

	const handleLogin = (e) => {
		e.preventDefault();

		AuthService.login(user.current.value, pass.current.value)
			.then((response) => {
				const { isAdmin } = response;

				if (isAdmin) {
					// Redirect the user to the admin page
					navigate('/admin');
				} else {
					// Redirect the user to the regular user page (profile)
					navigate('/profile');
				}
			})
			.catch((error) => {
				if (error.response) {
					if (error.response.status === 401) {
						setError('Invalid Password!');
					} else if (error.response.status === 404) {
						setError('User not found');
					} else {
						setError('An error occurred. Please try again.');
					}
				} else {
					setError('An unexpected error occurred. Please try again.');
				}
			});
	};

	return (
		<>
			<div className='form-container'>
				<div className='form'>
					<h2 className='form__title'>Login</h2>

					{error && <p className='error-message'>{error}</p>}
					<form className='form__form' onSubmit={handleLogin}>
						<label className='form__form__label'>Username</label>
						<input className='form__form__input' type='text' ref={user} />
						<label className='form__form__label'>Password</label>
						<input className='form__form__input' type='password' ref={pass} />
						<input className='form__form__submit' type='submit' value='Login' />
					</form>
					<br />
					<p>
						You don't have account?
						<a className='form__register-link' href='/register'>
							Create one!
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
