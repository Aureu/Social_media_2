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

	/* MODALS */
	const [showModal, setShowModal] = useState(false);

	const handleChange = (event) => {
		event.preventDefault();
	};

	const toggleInfoModal = () => {
		setShowModal(!showModal);
	};

	/* CHANGE USER INFO */
	const changeFname = useRef();
	const changeLname = useRef();
	const changeUsername = useRef();
	const changeJob = useRef();
	const changeLocation = useRef();

	const changeUserData = () => {
		const data = {
			user_id: user.id,
			first_name: changeFname.current.value || user.first_name,
			last_name: changeLname.current.value || user.last_name,
			username: changeUsername.current.value || user.username,
			job: changeJob.current.value || user.job,
			location: changeLocation.current.value || user.location,
		};

		axios
			.post(`${process.env.REACT_APP_HOST}/api/user/change`, data)
			.then(() => {
				document.location.reload();
			});
	};

	return (
		<>
			<Navbar />
			<div className='profile-container'>
				<div className='wrapper'>
					<div className='border'>
						<div className='profile-header'>
							<img
								src='profile-photo.png'
								alt='Profile Photo'
								className='profile-photo'
							/>
							<div className='user-info'>
								<h1>
									{user?.first_name} {user?.last_name}
								</h1>
								<p>@{user?.username}</p>
								<p>{user?.job}</p>
								<p>{user?.location}</p>
								<button className='edit-button' onClick={toggleInfoModal}>
									Edit
								</button>
							</div>
						</div>
						<div className='profile-main'>
							<div className='left'>
								<h3>About Me</h3>
								<p>
									I am a web developer with 5 years of experience. I am
									passionate about creating websites and web applications that
									are both functional and beautiful.
								</p>
								<button className='edit-button'>Edit</button>
								<h3>Skills</h3>
								<ul>
									<li>HTML</li>
									<li>CSS</li>
									<li>JavaScript</li>
									<li>React</li>
									<li>Node.js</li>
									<li>SQL</li>
								</ul>
								<button className='edit-button'>Edit</button>
							</div>
							<div className='right'>
								<h3>Posts</h3>
								<form onSubmit={sendPost}>
									<textarea
										name=''
										id=''
										cols='53'
										rows='5'
										placeholder='Write a post...'
										maxLength={500}
										ref={content}
									></textarea>
									<input type='submit' value='Post' />
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

			{/* modals */}
			{showModal && (
				<div className='modal'>
					<div className='modal-content'>
						<h2>Edit Profile</h2>
						<form onSubmit={changeUserData}>
							<label>
								First Name:
								<input
									type='text'
									name='fName'
									placeholder={user?.first_name}
									ref={changeFname}
								/>
							</label>
							<label>
								Last Name:
								<input
									type='text'
									name='lName'
									placeholder={user?.last_name}
									ref={changeLname}
								/>
							</label>
							<label>
								Username:
								<input
									type='text'
									name='username'
									placeholder={user?.username}
									ref={changeUsername}
								/>
							</label>
							<label>
								Job:
								<input
									type='text'
									name='job'
									placeholder={user?.job}
									ref={changeJob}
								/>
							</label>
							<label>
								Location:
								<input
									type='text'
									name='location'
									placeholder={user?.location}
									ref={changeLocation}
								/>
							</label>
							<input type='submit' value='Save' />
							<button onClick={toggleInfoModal}>Cancel</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default ProfilePage;
