// UserEditDialog.jsx
import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
} from '@mui/material';

const UserEditDialog = ({ open, onClose, user, onUpdate }) => {
	const [updatedUser, setUpdatedUser] = useState({ ...user });

	const handleChange = (e) => {
		setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
	};

	const handleUpdate = () => {
		onUpdate(updatedUser);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Edit User</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin='dense'
					name='username'
					label='Username'
					value={updatedUser.username}
					onChange={handleChange}
					fullWidth
				/>
				<TextField
					margin='dense'
					name='first_name'
					label='First Name'
					value={updatedUser.first_name}
					onChange={handleChange}
					fullWidth
				/>
				<TextField
					margin='dense'
					name='last_name'
					label='Last Name'
					value={updatedUser.last_name}
					onChange={handleChange}
					fullWidth
				/>
				<TextField
					margin='dense'
					name='email'
					label='Email'
					value={updatedUser.email}
					onChange={handleChange}
					fullWidth
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
