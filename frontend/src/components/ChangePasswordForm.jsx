import React, { useState } from 'react';
import axios from 'axios';
import authService from '../services/auth.service';

const ChangePasswordForm = () => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const currentUser = authService.getCurrentUser();

	const handleChangePassword = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/user/change-password`,
				{
					userId: currentUser.id, // Replace with your user ID source
					oldPassword: oldPassword,
					newPassword: newPassword,
				}
			);
			console.log(newPassword, oldPassword);
			if (response.status === 200) {
				alert('Password updated successfully');
			} else {
				alert('Failed to update password');
			}
		} catch (error) {
			alert('Error updating password:', error.response.data.error);
		}
	};

	return (
		<form onSubmit={handleChangePassword}>
			<label>
				Old Password:
				<input
					type='password'
					value={oldPassword}
					onChange={(e) => setOldPassword(e.target.value)}
				/>
			</label>
			<label>
				New Password:
				<input
					type='password'
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>
			</label>
			<button type='submit'>Change Password</button>
		</form>
	);
};

export default ChangePasswordForm;
