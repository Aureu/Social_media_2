import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AuthService from '../services/auth.service';

const RegisterPage = () => {
	const fname = useRef();
	const lname = useRef();
	const username = useRef();
	const email = useRef();
	const password = useRef();
	const job = useRef();
	const location = useRef();

	const [error, setError] = useState('');

	const navigate = useNavigate();

	const submitRegister = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`${process.env.REACT_APP_HOST}/api/auth/register`, {
				first_name: fname.current.value,
				last_name: lname.current.value,
				username: username.current.value,
				job: job.current.value,
				location: location.current.value,
				email: email.current.value,
				password: password.current.value,
			});
			navigate('/');
		} catch (error) {
			setError('Registration failed. Username or email may already be in use.');
		}
	};

	return (
		<>
			<div className='form-container'>
				<div className='form'>
					<h2 className='form__title'>Registrace</h2> <br />
					{error && <div className='error-message'>{error}</div>}
					<form onSubmit={submitRegister} className='form__form'>
						<div className='form__form__row'>
							<div>
								<label className='form__form__label'>Jmeno</label>
								<input className='form__form__input' type='text' ref={fname} />
							</div>
							<div>
								<label className='form__form__label'>Prijmeni</label>
								<input className='form__form__input' type='text' ref={lname} />
							</div>
						</div>
						<label className='form__form__label'>Prezdivka</label>
						<input className='form__form__input' type='text' ref={username} />
						<label className='form__form__label'>Práce</label>
						<input className='form__form__input' type='text' ref={job} />
						<label className='form__form__label'>Lokace</label>
						<input className='form__form__input' type='text' ref={location} />
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
						<a href='/' className='form__register-link'>
							Login
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default RegisterPage;
