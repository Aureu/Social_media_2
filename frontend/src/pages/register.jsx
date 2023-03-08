import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../components/Navbar';

const RegisterPage = () => {
	const fname = useRef();
	const lname = useRef();
	const username = useRef();
	const email = useRef();
	const password = useRef();

	const navigate = useNavigate();

	const submitRegister = () => {
		axios
			.post(`${process.env.REACT_APP_HOST}/api/auth/register`, {
				first_name: fname.current.value,
				last_name: lname.current.value,
				username: username.current.value,
				email: email.current.value,
				password: password.current.value,
			})
			.then(navigate('/login'));
	};

	return (
		<>
			<div className='form-container'>
				<div className='form'>
					<h2 className='form__title'>Registrace</h2> <br />
					<br />
					<form onSubmit={submitRegister} className='form__form'>
						<label className='form__form__label'>Jmeno</label>
						<input className='form__form__input' type='text' ref={fname} />
						<label className='form__form__label'>Prijmeni</label>
						<input className='form__form__input' type='text' ref={lname} />
						<label className='form__form__label'>Prezdivka</label>
						<input className='form__form__input' type='text' ref={username} />
						<label className='form__form__label'>Email</label>
						<input className='form__form__input' type='email' ref={email} />
						<label className='form__form__label'>Heslo</label>
						<input
							className='form__form__input'
							type='password'
							ref={password}
						/>
						<input
							type='submit'
							value='Odeslat'
							className='form__form__submit'
						/>
					</form>
					<p>
						Máte již účet?
						<a href='/login' className='form__register-link'>
							Login
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default RegisterPage;
