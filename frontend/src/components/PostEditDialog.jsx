// UserEditDialog.jsx
import React, { useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material';

const UserEditDialog = ({ open, onClose, post, onUpdate }) => {
	const [updatedPost, setUpdatedPost] = useState({ ...post });

	const handleChange = (e) => {
		setUpdatedPost({ ...updatedPost, [e.target.name]: e.target.value });
	};

	const handleUpdate = () => {
		onUpdate(updatedPost);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Edit Post</DialogTitle>
			<DialogContent>
				<TextField
					margin='dense'
					name='content'
					label='Content'
					value={updatedPost.content}
					onChange={handleChange}
					fullWidth
					multiline
					rows={4}
					inputProps={{ maxLength: 254 }}
					style={{ width: '500px' }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleUpdate}>Update</Button>
			</DialogActions>
		</Dialog>
	);
};

export default UserEditDialog;
