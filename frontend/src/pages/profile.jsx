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
				<div className='wrapper'>
					<div className='border'>
						<div className='profile-header'>
							<img
								src='img/farma_rochov.png'
								alt='Profile Photo'
								className='profile-photo'
							/>
							<div className='user-info'>
								<h1>
									{user?.first_name} {user?.last_name}
								</h1>
								<p>@{user?.username}</p>
								<p>Sledujici 50</p>
								<p>Sleduji 68</p>
							</div>
						</div>
						<div className='profile-main'>
							<div className='left'>
								<h3>User info</h3>
								<p>Web Developer</p>
								<p>New York, NY</p>
							</div>
							<div className='right'>
								<h3>Posts</h3>
								<form onSubmit={sendPost}>
									<textarea
										name=''
										id=''
										cols='53'
										rows='5'
										placeholder='Napiste prispevek'
										maxLength={500}
										ref={content}
									></textarea>
									<input type='submit' value='Odeslat' />
								</form>
								{posts
									?.sort(
										(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
									)
									.map((post) => {
										const date = new Date(post.createdAt);
										const formattedDate = `${date.getDate()}.${
											date.getMonth() + 1
										}.${date.getFullYear()} - ${date.getHours()}:${(
											'0' + date.getMinutes()
										).slice(-2)}`;
										return (
											<div class='post'>
												<div class='post-header'>
													<div class='post-icon'></div>
													<div class='post-author'>John Doe</div>
													<div class='post-date'>{formattedDate}</div>
												</div>
												<div class='post-content'>{post.content}</div>
												<div class='post-footer'>
													<button>Like</button>
													<button>Comment</button>
													<button>Share</button>
												</div>
											</div>
										);
									})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
