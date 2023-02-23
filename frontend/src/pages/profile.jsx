import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../services/auth.service';
import axios from 'axios';

import Navbar from '../components/Navbar';

const ProfilePage = () => {
	const currentUser = AuthService.getCurrentUser();

	const [user, setUser] = useState();
	const [posts, setPosts] = useState();

	const content = useRef();

	const sendPost = () => {
		axios
			.post(`${process.env.REACT_APP_HOST}/api/post/create`, {
				user_id: currentUser.id,
				content: content.current.value,
			})
			.then(window.location.reload());
	};

	const fetchPost = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/post`,
			{ user_id: currentUser.id }
		);

		return response.data;
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

	useEffect(() => {
		fetchPost().then((post) => {
			setPosts(post);
		});
	}, []);

	return (
		<>
			<Navbar />
			<div className='profile-container'>
				<div className='user-info'>
					<div>
						Jmeno: {user?.first_name} <br /> Prijmeni: {user?.last_name} <br />{' '}
						Email: {user?.email} <br />
						<a href={`/profile/edit`}>Upravit profil</a>
					</div>
					<hr />
					<div className='post-form'>
						<form onSubmit={sendPost}>
							<textarea
								name=''
								id=''
								cols='53'
								rows='5'
								placeholder='Napiste prispevek'
								maxLength={200}
								ref={content}
							></textarea>
							<input type='submit' value='Odeslat' />
						</form>
						<br />
						{posts?.map((post) => {
							const date = new Date(post.createdAt);
							const formattedDate = `${date.getDate()}.${
								date.getMonth() + 1
							}.${date.getFullYear()} - ${date.getHours()}:${(
								'0' + date.getMinutes()
							).slice(-2)}`;

							return (
								<div className='post'>
									<h3>{post.content}</h3>
									<span>{formattedDate}</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
