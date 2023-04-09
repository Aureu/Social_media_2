import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../services/auth.service';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import WorkIcon from '@mui/icons-material/Work';
import PublicIcon from '@mui/icons-material/Public';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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

	const [isLikedByPost, setIsLikedByPost] = useState({});
	const [isLikedByComment, setIsLikedByComment] = useState({});
	const [likesCount, setLikesCount] = useState(0);

	const [openedPostId, setOpenedPostId] = useState(null);
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);

	const fetchPosts = async () => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/post`,
				{ user_id: id }
			);

			setPosts(response.data);
		} catch (error) {
			console.error('Error fetching the posts:', error);
		}
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

			window.location.reload();

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
		fetchPosts();
	}, []);

	useEffect(() => {
		if (currentUser) {
			checkFollow(currentUser.id);
		}
	}, [currentUser]);

	const handleLike = async (postId) => {
		try {
			// Call your API to like/unlike the post
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/post/like`,
				{
					postId,
					userId: currentUser.id,
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

	const handleShare = (postId) => {
		// Share the post on social media or copy the post link to the clipboard
		console.log(postId);
	};

	const fetchComments = async (postId) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/comment`,
				{
					postId: postId,
				}
			);

			// Update the comments state with the fetched data
			setComments(response.data);
		} catch (error) {
			console.error('Error fetching comments:', error);
		}
	};

	const handleSubmitComment = async (postId) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/comment/create`,
				{
					postId,
					userId: currentUser.id,
					content: comment,
				}
			);

			setComment(''); // Reset the comment input field

			await fetchComments(postId);
		} catch (error) {
			console.error('Error submitting the comment:', error);
		}
	};

	const handleComment = async (postId) => {
		if (openedPostId === postId) {
			setOpenedPostId(null);
		} else {
			setOpenedPostId(postId);
			await fetchComments(postId); // Fetch the comments for this post
		}
	};

	const handleLikeComment = async (commentId) => {
		try {
			// Call your API to like/unlike the comment
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/comment/like`,
				{
					commentId,
					userId: user.id,
				}
			);

			// Check if the comment was liked or unliked
			if (response.data.liked) {
				setLikesCount((prevCount) => ({
					...prevCount,
					[commentId]: prevCount[commentId] ? prevCount[commentId] + 1 : 1,
				}));
				setIsLikedByComment((prevState) => ({
					...prevState,
					[commentId]: true,
				}));
			} else {
				setLikesCount((prevCount) => ({
					...prevCount,
					[commentId]: prevCount[commentId] ? prevCount[commentId] - 1 : 0,
				}));
				setIsLikedByComment((prevState) => ({
					...prevState,
					[commentId]: false,
				}));
			}
		} catch (error) {
			console.error('Error liking the comment:', error);
		}
	};

	const handleRemoveComment = (commentId) => {
		axios
			.post(`${process.env.REACT_APP_HOST}/api/comment/delete/${commentId}`)
			.then((response) => {
				// If the request is successful, you can update the UI accordingly
				console.log(`Comment ${commentId} removed successfully`);
				window.location.reload();
			})
			.catch((error) => {
				console.error(`Error removing post ${commentId}:`, error);
			});
	};

	const handleReply = () => {};

	return (
		<>
			<Navbar />
			<div className='profile-container'>
				<div className='wrapper'>
					<div className='border'>
						<div className='profile-header'>
							<img
								className='profile-photo'
								alt={'profile picture'}
								src={`${process.env.REACT_APP_HOST}/upload/${id}.webp`}
								onError={({ currentTarget }) => {
									currentTarget.onerror = null; // prevents looping
									currentTarget.src = `${process.env.REACT_APP_HOST}/upload/noimage.webp`;
								}}
							></img>
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
														{isLikedByPost[post.id] ? 'Unlike' : 'Like'}{' '}
														{post.likesCount}
													</button>
													<button onClick={() => handleComment(post.id)}>
														{openedPostId === post.id
															? 'Hide Comments'
															: 'Comment'}{' '}
														{post.commentsCount}
													</button>
													<button onClick={() => handleShare(post.id)}>
														Share
													</button>
												</div>
												{/* Comments Section */}
												{openedPostId === post.id && (
													<div class='comments-section'>
														{comments.map((comment) => {
															const date = new Date(comment.createdAt);
															const timeAgo = formatDistanceToNow(date, {
																addSuffix: true,
															});

															return (
																<div key={comment?.id} class='comment'>
																	<div class='comment-header'>
																		<div class='comment-icon'>
																			<img
																				alt={'profile picture'}
																				src={`${process.env.REACT_APP_HOST}/upload/${comment?.user.id}.webp`}
																				onError={({ currentTarget }) => {
																					currentTarget.onerror = null; // prevents looping
																					currentTarget.src = `${process.env.REACT_APP_HOST}/upload/noimage.webp`;
																				}}
																			></img>
																		</div>
																		<div class='comment-author'>
																			{comment?.user.first_name}{' '}
																			{comment?.user.last_name}
																		</div>
																		<div class='comment-date'>{timeAgo}</div>
																		{comment?.id_user === currentUser.id && (
																			<span
																				onClick={() =>
																					handleRemoveComment(comment.id)
																				}
																			>
																				<DeleteForeverIcon />
																			</span>
																		)}
																	</div>
																	<div class='comment-content'>
																		{comment.content}
																	</div>
																	<div class='comment-footer'>
																		<button
																			onClick={() =>
																				handleLikeComment(comment.id)
																			}
																			className={
																				isLikedByComment[comment.id]
																					? 'liked'
																					: ''
																			}
																		>
																			{isLikedByComment[comment.id]
																				? 'Unlike'
																				: 'Like'}{' '}
																			{comment?.likesCount}
																		</button>

																		<button
																			onClick={() => handleReply(comment.id)}
																		>
																			Reply
																		</button>
																	</div>
																</div>
															);
														})}
														<form
															onSubmit={(e) => {
																e.preventDefault();
																handleSubmitComment(post.id);
															}}
														>
															<input
																type='text'
																value={comment}
																onChange={(e) => setComment(e.target.value)}
																placeholder='Add a comment...'
															/>
															<button type='submit'>Post</button>
														</form>
													</div>
												)}
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
