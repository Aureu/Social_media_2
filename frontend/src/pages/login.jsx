import { useRef } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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
		<>
			<Navbar />
			<br /> <br /> <br /> <br />
			<div className='login-form'>
				<h2 className='login-form__title'>Prihlaseni</h2>
				<a className='login-form__register-link' href='/register'>
					Register
				</a>
				<form className='login-form__form' onSubmit={handleLogin}>
					<label className='login-form__label'>Prezdivku</label>
					<input className='login-form__input' type='text' ref={user} />
					<label className='login-form__label'>Heslo</label>
					<input className='login-form__input' type='password' ref={pass} />
					<input
						className='login-form__submit'
						type='submit'
						value='Prihlasit se'
					/>
				</form>
			</div>
		</>
	);
};

export default LoginPage;
