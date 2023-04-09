import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../services/auth.service';
import axios from 'axios';

import ProfileModal from '../components/ProfileModal';
import BioModal from '../components/BioModal';

import Navbar from '../components/Navbar';

import WorkIcon from '@mui/icons-material/Work';
import PublicIcon from '@mui/icons-material/Public';
import EditIcon from '@mui/icons-material/Edit';

import ChangeProfileImage from '../components/ChangeProfileImage';

const ProfilePage = () => {
	const currentUser = AuthService.getCurrentUser();

	const [user, setUser] = useState();
	const [posts, setPosts] = useState();
	const [bio, setBio] = useState();
	const [followers, setFollowers] = useState();
	const [followings, setFollowings] = useState();
	const [imgModal, setImgModal] = useState(false);

	const [likesCount, setLikesCount] = useState(0);
	const [isLikedByPost, setIsLikedByPost] = useState({});

	const content = useRef();

	const sendPost = () => {
		axios
			.post(`${process.env.REACT_APP_HOST}/api/post/create`, {
				user_id: currentUser.id,
				content: content.current.value,
			})
			.then(window.location.reload());
	};

	const fetchPosts = async () => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/post`,
				{ user_id: currentUser.id }
			);

			setPosts(response.data);
		} catch (error) {
			console.error('Error fetching the posts:', error);
		}
	};

	const fetchUser = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/user/`,
			{ id: currentUser.id }
		);

		return response.data;
	};

	const fetchBio = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/user/bio`,
			{ id: currentUser.id }
		);

		return response.data;
	};

	const fetchFollowers = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/users/get-followers`,
			{ id_user: currentUser.id }
		);

		return response.data;
	};

	const fetchFollowings = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/users/get-followings`,
			{ id_user: currentUser.id }
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
		fetchPosts();
	}, []);

	/* MODALS */
	const [showInfoModal, setShowInfoModal] = useState(false);

	const toggleInfoModal = () => {
		setShowInfoModal(!showInfoModal);
	};

	/* CHANGE USER INFO */
	const changeFname = useRef();
	const changeLname = useRef();
	const changeUsername = useRef();
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [selectedJob, setSelectedJob] = useState(null);

	const changeUserData = () => {
		const data = {
			user_id: user.id,
			first_name: changeFname.current.value || user.first_name,
			last_name: changeLname.current.value || user.last_name,
			username: changeUsername.current.value || user.username,
			job: selectedJob ? selectedJob.label : user.job,
			location: selectedCountry ? selectedCountry.label : user.location,
		};
		console.log(data);
		axios
			.post(`${process.env.REACT_APP_HOST}/api/user/change`, data)
			.then(() => {
				document.location.reload();
			});
	};

	/* BIO MODAL */
	const [showBioModal, setShowBioModal] = useState(false);

	const toggleBioModal = () => {
		setShowBioModal(!showInfoModal);
	};

	const changeBio = useRef();

	const changeUserBio = () => {
		const data = {
			user_id: user.id,
			bio: changeBio.current.value || bio.bio,
		};

		axios
			.post(`${process.env.REACT_APP_HOST}/api/user/change_bio`, data)
			.then(() => {
				document.location.reload();
			});
	};

	const handleCountryChange = (selectedOption) => {
		setSelectedCountry(selectedOption);
	};

	const handleJobChange = (selectedOption) => {
		setSelectedJob(selectedOption);
	};

	const handleLike = async (postId) => {
		try {
			// Call your API to like/unlike the post
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/post/like`,
				{
					postId,
					userId: user.id,
				}
			);

			fetchPosts();
			// Check if the post was liked or unliked
			if (response.data.liked) {
				setLikesCount((prevCount) => prevCount + 1);
				setIsLikedByPost((prevState) => ({ ...prevState, [postId]: true }));
			} else {
				setLikesCount((prevCount) => prevCount - 1);
				setIsLikedByPost((prevState) => ({ ...prevState, [postId]: false }));
			}
		} catch (error) {
			console.error('Error liking the post:', error);
		}
	};

	const handleComment = (postId) => {
		// Open a comment modal or expand a comment section to add a new comment
		console.log(postId);
	};

	const handleShare = (postId) => {
		// Share the post on social media or copy the post link to the clipboard
		console.log(postId);
	};

	return (
		<>
			<Navbar />
			<div className='profile-container'>
				<div className='wrapper'>
					<div className='border'>
						<div className='profile-header'>
							<div
								className='profile-header__image'
								onClick={() => {
									setImgModal(true);
								}}
							>
								<img
									className='profile-photo'
									alt={'profile picture'}
									src={`${process.env.REACT_APP_HOST}/upload/${user?.id}.webp`}
									onError={({ currentTarget }) => {
										currentTarget.onerror = null; // prevents looping
										currentTarget.src = `${process.env.REACT_APP_HOST}/upload/noimage.webp`;
									}}
								></img>
								&nbsp;
								<EditIcon className='edit' />
								<ChangeProfileImage
									show={imgModal}
									setShow={setImgModal}
									user={user}
								/>
							</div>
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
								<button className='edit-button' onClick={toggleInfoModal}>
									Edit
								</button>
								<ProfileModal
									showModal={showInfoModal}
									toggleModal={toggleInfoModal}
									changeUserData={changeUserData}
									changeFname={changeFname}
									changeLname={changeLname}
									changeUsername={changeUsername}
									changeJob={setSelectedJob}
									changeLocation={setSelectedCountry}
									user={user}
									handleCountryChange={handleCountryChange}
									handleJobChange={handleJobChange}
								/>
							</div>
						</div>
						<div className='profile-main'>
							<div className='left'>
								<h3>About Me</h3>
								<p>{bio?.bio}</p>
								<button className='edit-button' onClick={toggleBioModal}>
									Edit
								</button>
								<BioModal
									showModal={showBioModal}
									toggleModal={toggleBioModal}
									changeBio={changeBio}
									changeUserBio={changeUserBio}
									bio={bio}
								/>
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
										required
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
													<div class='post-icon'>
														<img
															alt={'profile picture'}
															src={`${process.env.REACT_APP_HOST}/upload/${user?.id}.webp`}
															onError={({ currentTarget }) => {
																currentTarget.onerror = null; // prevents looping
																currentTarget.src = `${process.env.REACT_APP_HOST}/upload/noimage.webp`;
															}}
														></img>
													</div>
													<div class='post-author'>
														{post.user.first_name} {post.user.last_name}
													</div>
													<div class='post-date'>{formattedDate}</div>
												</div>
												<div class='post-content'>{post.content}</div>
												<div class='post-footer'>
													<button
														onClick={() => handleLike(post.id)}
														className={isLikedByPost[post.id] ? 'liked' : ''}
													>
														Like {post.likesCount}
													</button>

													<button onClick={() => handleComment(post.id)}>
														Comment
													</button>
													<button onClick={() => handleShare(post.id)}>
														Share
													</button>
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
