import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../services/auth.service';
import axios from 'axios';

const EditProfilePage = () => {
	const currentUser = AuthService.getCurrentUser();

	const [user, setUser] = useState();

	const changeFname = useRef();
	const changeLname = useRef();
	const changeUsername = useRef();
	const changeEmail = useRef();

	const changeUser = () => {
		const data = {
			user_id: user.id,
			first_name: changeFname.current.value || user.first_name,
			last_name: changeLname.current.value || user.last_name,
			username: changeUsername.current.value || user.username,
			email: changeEmail.current.value || user.email,
		};

		axios
			.post(`${process.env.REACT_APP_HOST}/api/user/change`, data)
			.then(() => {
				document.location.reload();
			});
	};

	const fetchUser = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/user/`,
			{ id: currentUser.id }
		);

		return response.data;
	};

	useEffect(() => {
		fetchUser().then((user) => {
			setUser(user);
		});
	}, []);

	return (
		<div>
			<div>
				<a href='/profile'>Profil</a> <br />
				<form onSubmit={changeUser}>
					{user && (
						<div>
							<label htmlFor=''>Jmeno</label>

							<input
								type='text'
								placeholder={user.first_name}
								ref={changeFname}
							/>
						</div>
					)}
					{user && (
						<div>
							<label htmlFor=''>Prijmeni</label>
							<input
								type='text'
								placeholder={user.last_name}
								ref={changeLname}
							/>
						</div>
					)}
					{user && (
						<div>
							<label>Prezdivka</label>
							<input
								type='text'
								placeholder={user.username}
								ref={changeUsername}
							/>
						</div>
					)}
					{user && (
						<div>
							<label htmlFor=''>Email</label>
							<input type='email' placeholder={user.email} ref={changeEmail} />
						</div>
					)}

					<input type='submit' value='Odeslat' />
				</form>
			</div>
		</div>
	);
};

export default EditProfilePage;
