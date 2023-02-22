import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
	const fname = useRef();
	const lname = useRef();
	const username = useRef();
	const email = useRef();
	const password = useRef();

	const navigate = useNavigate();

	const submitRegister = () => {
		console.log(fname.current.value);
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
		<div>
			<h2>Registrace</h2>
			<form onSubmit={submitRegister}>
				<label>Jmeno</label>
				<input type='text' ref={fname} />
				<label>Prijmeni</label>
				<input type='text' ref={lname} />
				<label>Prezdivka</label>
				<input type='text' ref={username} />
				<label>Email</label>
				<input type='email' ref={email} />
				<label>Heslo</label>
				<input type='password' ref={password} />
				<input type='submit' value='Odeslat' />
			</form>
		</div>
	);
};

export default RegisterPage;
