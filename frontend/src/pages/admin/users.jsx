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
import UserEditDialog from '../../components/UserEditDialog';

const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const fetchUsers = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_HOST}/api/users/get-all`
			);
			setUsers(response.data);
		} catch (error) {
			console.error('Error fetching users:', error);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleEditClick = (user) => {
		setSelectedUser(user);
		setEditDialogOpen(true);
	};

	const handleUpdateUser = async (updatedUser) => {
		await axios.post(
			`${process.env.REACT_APP_HOST}/api/user/update/${updatedUser.id}`,
			updatedUser
		);
		fetchUsers();
	};

	const handleDeleteUser = async (userId) => {
		try {
			await axios.post(
				`${process.env.REACT_APP_HOST}/api/user/delete/${userId}`
			);
			setUsers(users.filter((user) => user.id !== userId));
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
								<TableCell>Username</TableCell>
								<TableCell>First Name</TableCell>
								<TableCell>Last Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.username}</TableCell>
									<TableCell>{user.first_name}</TableCell>
									<TableCell>{user.last_name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<Edit
											color='primary'
											style={{ cursor: 'pointer' }}
											onClick={() => handleEditClick(user)}
										/>
										<Delete
											color='secondary'
											style={{ cursor: 'pointer' }}
											onClick={() => handleDeleteUser(user.id)}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
			{selectedUser && (
				<UserEditDialog
					open={editDialogOpen}
					onClose={() => setEditDialogOpen(false)}
					user={selectedUser}
					onUpdate={handleUpdateUser}
				/>
			)}
		</div>
	);
};

export default UsersPage;
