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

const UsersPage = () => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
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

		fetchUsers();
	}, []);
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
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.username}</TableCell>
									<TableCell>{user.first_name}</TableCell>
									<TableCell>{user.last_name}</TableCell>
									<TableCell>
										<Edit color='primary' style={{ cursor: 'pointer' }} />
										<Delete color='secondary' style={{ cursor: 'pointer' }} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default UsersPage;
