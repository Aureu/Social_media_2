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
			<div className='form-container'>
				<div className='form'>
					<h2 className='form__title'>Prihlaseni</h2>

					<form className='form__form' onSubmit={handleLogin}>
						<label className='form__form__label'>Prezdivku</label>
						<input className='form__form__input' type='text' ref={user} />
						<label className='form__form__label'>Heslo</label>
						<input className='form__form__input' type='password' ref={pass} />
						<input
							className='form__form__submit'
							type='submit'
							value='Prihlasit se'
						/>
					</form>
					<br />
					<p>
						Nemáte účet?
						<a className='form__register-link' href='/register'>
							Registrovat
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
