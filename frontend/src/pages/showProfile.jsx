import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../services/auth.service';

import WorkIcon from '@mui/icons-material/Work';
import PublicIcon from '@mui/icons-material/Public';

import Navbar from '../components/Navbar';

function ShowProfilePage() {
	const { id } = useParams();

	const currentUser = AuthService.getCurrentUser();

	const [user, setUser] = useState();
	const [posts, setPosts] = useState();
	const [bio, setBio] = useState();
	const [isFollowing, setIsFollowing] = useState(false);

	const [followers, setFollowers] = useState();
	const [followings, setFollowings] = useState();

	const fetchPost = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/post`,
			{ user_id: id }
		);
		console.log(response.data);
		return response.data;
	};

	const fetchUser = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/user/`,
			{ id: id }
		);

		return response.data;
	};

	const fetchBio = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/user/bio`,
			{ id: id }
		);

		return response.data;
	};

	const checkFollow = async (userId) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/users/${id}/check-follow`,
				{ userId }
			);

			if (response.data) {
				setIsFollowing(true);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleFollowClick = async () => {
		try {
			// Send a request to the backend to follow the user
			await axios.post(`${process.env.REACT_APP_HOST}/api/users/${id}/follow`, {
				userId: currentUser.id,
			});

			// If the request is successful, update the state to show that the user is being followed
			setIsFollowing(true);
		} catch (error) {
			// Handle any errors that occur during the request
			console.error(error);
		}
	};

	const fetchFollowers = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/users/get-followers`,
			{ id_user: id }
		);

		return response.data;
	};

	const fetchFollowings = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/users/get-followings`,
			{ id_user: id }
		);

		return response.data;
	};

	useEffect(() => {
		fetchFollowings().then((following) => {
			setFollowings(following);
		});
	}, []);

	useEffect(() => {
		fetchFollowers().then((follower) => {
			setFollowers(follower);
		});
	}, []);

	useEffect(() => {
		fetchBio().then((bio) => {
			setBio(bio);
		});
	}, []);

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

	useEffect(() => {
		if (currentUser) {
			checkFollow(currentUser.id);
		}
	}, [currentUser]);
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
								<p>
									<span>
										<WorkIcon />
									</span>{' '}
									{user?.job}
								</p>
								<p>
									<span>
										<PublicIcon />
									</span>{' '}
									{user?.location}
								</p>
								<p>Followers: {followers?.length}</p>
								<p>Following: {followings?.length}</p>
								<button onClick={handleFollowClick} disabled={isFollowing}>
									{isFollowing ? 'Following' : 'Follow'}
								</button>
							</div>
						</div>
						<div className='profile-main'>
							<div className='left'>
								<h3>About Me</h3>
								<p>{bio?.bio}</p>

								<h3>Skills</h3>
								<ul>
									<li>HTML</li>
									<li>CSS</li>
									<li>JavaScript</li>
									<li>React</li>
									<li>Node.js</li>
									<li>SQL</li>
								</ul>
							</div>
							<div className='right'>
								<h3>Posts</h3>

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
													<div class='post-author'>
														{post.user.first_name} {post.user.last_name}
													</div>
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
}

export default ShowProfilePage;
