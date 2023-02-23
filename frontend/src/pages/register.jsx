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
			<Navbar />
			<br /> <br /> <br /> <br />
			<div className='login-form'>
				<h2 className=''>Registrace</h2> <br />
				<a href='/login' className='login-form__register-link'>
					Login
				</a>{' '}
				<br />
				<form onSubmit={submitRegister} className='login-form__form'>
					<label className='login-form__label'>Jmeno</label>
					<input className='login-form__input' type='text' ref={fname} />
					<label className='login-form__label'>Prijmeni</label>
					<input className='login-form__input' type='text' ref={lname} />
					<label className='login-form__label'>Prezdivka</label>
					<input className='login-form__input' type='text' ref={username} />
					<label className='login-form__label'>Email</label>
					<input className='login-form__input' type='email' ref={email} />
					<label className='login-form__label'>Heslo</label>
					<input className='login-form__input' type='password' ref={password} />
					<input type='submit' value='Odeslat' className='login-form__submit' />
				</form>
			</div>
		</>
	);
};

export default RegisterPage;
