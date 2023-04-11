import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Select from 'react-select';
import countries from '../countries.js';
import jobPositions from '../jobPositions.js';

const RegisterPage = () => {
	const fname = useRef();
	const lname = useRef();
	const username = useRef();
	const email = useRef();
	const password = useRef();

	const [selectedCountry, setSelectedCountry] = useState(null);
	const [selectedJob, setSelectedJob] = useState(null);

	const [error, setError] = useState('');

	const navigate = useNavigate();

	const submitRegister = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`${process.env.REACT_APP_HOST}/api/auth/register`, {
				first_name: fname.current.value,
				last_name: lname.current.value,
				username: username.current.value,
				job: selectedJob.label,
				location: selectedCountry.label,
				email: email.current.value,
				password: password.current.value,
			});
			navigate('/');
		} catch (error) {
			setError('Registration failed. Username or email may already be in use.');
		}
	};

	const handleCountryChange = (selectedOption) => {
		setSelectedCountry(selectedOption);
	};

	const handleJobChange = (selectedOption) => {
		setSelectedJob(selectedOption);
	};

	return (
		<>
			<div className='form-container'>
				<div className='form'>
					<h2 className='form__title'>Register</h2> <br />
					{error && <div className='error-message'>{error}</div>}
					<form onSubmit={submitRegister} className='form__form'>
						<div className='form__form__row'>
							<div>
								<label className='form__form__label'>First name</label>
								<input className='form__form__input' type='text' ref={fname} />
							</div>
							<div>
								<label className='form__form__label'>Last name</label>
								<input className='form__form__input' type='text' ref={lname} />
							</div>
						</div>
						<label className='form__form__label'>Username</label>
						<input className='form__form__input' type='text' ref={username} />
						<label className='form__form__label'>Job</label>
						<Select
							options={jobPositions}
							placeholder='Select a job'
							onChange={handleJobChange}
						/>
						<label className='form__form__label'>Country</label>
						<Select
							options={countries}
							placeholder='Select a country'
							onChange={handleCountryChange}
						/>
						<label className='form__form__label'>Email</label>
						<input className='form__form__input' type='email' ref={email} />
						<label className='form__form__label'>Password</label>
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
						Have already an an account?
						<a href='/' className='form__register-link'>
							Login here
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default RegisterPage;
