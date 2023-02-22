import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../services/auth.service';
import axios from 'axios';

const ProfilePage = () => {
	const currentUser = AuthService.getCurrentUser();

	const [user, setUser] = useState();

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
				Jmeno: {user?.first_name} <br /> Prijmeni: {user?.last_name} <br />{' '}
				Email: {user?.email} <br />
				<a href={`/profile/edit`}>Upravit profil</a>
			</div>
			<div>
				<h3>Prispevky</h3>
			</div>
		</div>
	);
};

export default ProfilePage;
