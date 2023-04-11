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

const PostsPage = () => {
	const [posts, setPosts] = useState([]);
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
			console.error('Error deleting user:', error);
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
								<TableRow key={post.id}>
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
