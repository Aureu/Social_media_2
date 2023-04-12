import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../services/auth.service';
import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import Navbar from '../components/Navbar';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const HomePage = () => {
	const [posts, setPosts] = useState([]);

	const currentUser = AuthService.getCurrentUser();

	const [user, setUser] = useState();

	const [likesCount, setLikesCount] = useState(0);
	const [isLikedByPost, setIsLikedByPost] = useState({});
	const [isLikedByComment, setIsLikedByComment] = useState({});
	const [commentsCount, setCommentsCount] = useState();

	const [openedPostId, setOpenedPostId] = useState(null);
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);

	const content = useRef();

	const fetchPosts = async () => {
		try {
			// Replace this URL with your backend API URL
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/posts/get-following-posts`,
				{
					id: currentUser.id, // Replace this with the current user's ID
				}
			);

			setPosts(response.data.posts);
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
	};
	useEffect(() => {
		fetchPosts();
	}, []);

	useEffect(() => {
		fetchPosts();
	}, []);

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

	const handleComment = async (postId) => {
		if (openedPostId === postId) {
			setOpenedPostId(null);
		} else {
			setOpenedPostId(postId);
			await fetchComments(postId); // Fetch the comments for this post
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

	const handleLikeComment = async (commentId) => {
		try {
			// Call your API to like/unlike the comment
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/comment/like`,
				{
					commentId,
					userId: currentUser.id,
				}
			);
			// Check if the comment was liked or unliked
			if (response.data.liked) {
				setCommentsCount((prevCount) => prevCount + 1);
				setIsLikedByComment((prevState) => ({
					...prevState,
					[commentId]: true,
				}));
			} else {
				setCommentsCount((prevCount) => prevCount - 1);
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
		<div>
			<Navbar />
			<br /> <br />
			<br /> <br />
			<br /> <br />
			<div className='mainpage-container'>
				{posts
					?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
											src={`${process.env.REACT_APP_HOST}/upload/${post?.id_user}.webp`}
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
										{openedPostId === post.id ? 'Hide Comments' : 'Comment'}{' '}
										{post.commentsCount}
									</button>
									<button onClick={() => handleShare(post.id)}>Share</button>
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
																src={`${process.env.REACT_APP_HOST}/upload/${comment.id_user}.webp`}
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
																onClick={() => handleRemoveComment(comment.id)}
															>
																<DeleteForeverIcon />
															</span>
														)}
													</div>
													<div class='comment-content'>{comment.content}</div>
													<div class='comment-footer'>
														<button
															onClick={() => handleLikeComment(comment.id)}
															className={
																isLikedByComment[comment.id] ? 'liked' : ''
															}
														>
															{isLikedByComment[comment.id] ? 'Unlike' : 'Like'}{' '}
															{comment?.likesCount}
														</button>
														<button onClick={() => handleReply(comment.id)}>
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
												required
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
	);
};

export default HomePage;
