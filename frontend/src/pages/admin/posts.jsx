// UsersPage.jsx
import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import axios from 'axios';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import PostEditDialog from '../../components/PostEditDialog';
import {
	Collapse,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	ListItemSecondaryAction,
} from '@mui/material';

const PostsPage = () => {
	const [posts, setPosts] = useState([]);
	const [comments, setComments] = useState([]);
	const [expandedPostId, setExpandedPostId] = useState(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);

	const fetchPosts = async () => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/posts/get-all`
			);
			setPosts(response.data);
			console.log(response.data);
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
	};

	const fetchComments = async (postId) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/comments/${postId}`
			);
			setComments(response.data);
		} catch (error) {
			console.error('Error fetching comments:', error);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	const handleEditClick = (post) => {
		setSelectedPost(post);
		setEditDialogOpen(true);
	};

	const handleUpdatePost = async (updatedPost) => {
		await axios.post(
			`${process.env.REACT_APP_HOST}/api/post/edit/${updatedPost.id}`,
			updatedPost
		);
		fetchPosts();
	};

	const handleDeletePost = async (postId) => {
		try {
			await axios.post(
				`${process.env.REACT_APP_HOST}/api/post/delete/${postId}`
			);
			setPosts(posts.filter((post) => post.id !== postId));
		} catch (error) {
			console.error('Error deleting post:', error);
		}
	};

	const handleDeleteComment = async (commentId) => {
		try {
			await axios.post(
				`${process.env.REACT_APP_HOST}/api/comment/delete/${commentId}`
			);
			window.location.reload();
		} catch (error) {
			console.error('Error deleting comment:', error);
		}
	};

	const handleRowClick = async (post) => {
		if (expandedPostId === post.id) {
			setExpandedPostId(null);
		} else {
			setExpandedPostId(post.id);
			await fetchComments(post.id);
		}
	};

	return (
		<div>
			<AdminNav />
			<br />
			<br />
			<br />
			<br />
			<div className='admin-container'>
				<h1>All Users</h1>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>First Name</TableCell>
								<TableCell>Last Name</TableCell>
								<TableCell>Content</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{posts.map((post) => (
								<>
									<TableRow
										key={post.id}
										style={{ cursor: 'pointer' }} // Add a pointer cursor when hovering over the post
										onClick={() => handleRowClick(post)} // Call handleRowClick when the post is clicked
									>
										<TableCell>{post.user.first_name}</TableCell>
										<TableCell>{post.user.last_name}</TableCell>
										<TableCell>{post.content}</TableCell>

										<TableCell>
											<Edit
												color='primary'
												style={{ cursor: 'pointer' }}
												onClick={() => handleEditClick(post)}
											/>
											<Delete
												color='secondary'
												style={{ cursor: 'pointer' }}
												onClick={() => handleDeletePost(post.id)}
											/>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell colSpan={4} padding='none'>
											<Collapse in={expandedPostId === post.id}>
												<List>
													{comments.map((comment) => (
														<ListItem key={comment.id}>
															<ListItemText
																primary={comment.content}
																secondary={`By ${comment.user.first_name} ${comment.user.last_name}`}
															/>
															<ListItemIcon>
																<Delete
																	color='secondary'
																	style={{ cursor: 'pointer' }}
																	onClick={() =>
																		handleDeleteComment(comment.id)
																	}
																/>
															</ListItemIcon>
														</ListItem>
													))}
												</List>
											</Collapse>
										</TableCell>
									</TableRow>
								</>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
			{selectedPost && (
				<PostEditDialog
					open={editDialogOpen}
					onClose={() => setEditDialogOpen(false)}
					post={selectedPost}
					onUpdate={handleUpdatePost}
				/>
			)}
		</div>
	);
};

export default PostsPage;
