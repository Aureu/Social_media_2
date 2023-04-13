import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import ChangePasswordForm from './ChangePasswordForm';

const Navbar = () => {
	const [showNavbar, setShowNavbar] = useState(false);
	const [query, setQuery] = useState('');
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState();
	const [notifications, setNotifications] = useState([]);
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleClick = (id) => {
		navigate(`/profile/${id}`);
	};

	const currentUser = authService.getCurrentUser();

	const handleShowNavbar = () => {
		setShowNavbar(!showNavbar);
	};

	const fetchUser = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/user/`,
			{ id: currentUser.id }
		);

		return response.data;
	};

	const fetchNotifications = async () => {
		const response = await axios.post(
			`${process.env.REACT_APP_HOST}/api/notifications/get`,
			{ id_user: currentUser.id }
		);
		return response.data;
	};

	useEffect(() => {
		fetchUser().then((user) => {
			setUser(user);
		});
	}, []);

	useEffect(() => {
		fetchNotifications().then((notifications) => {
			setNotifications(notifications);
		});
	}, []);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			handleSearch();
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [query]);

	const handleSearch = async () => {
		try {
			if (query.trim() !== '') {
				const response = await axios.get(
					`${process.env.REACT_APP_HOST}/api/user/search?q=${query}`,
					{ id: currentUser.id }
				);
				setUsers(response.data);
			} else {
				setUsers([]);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleNotificationClick = async (notificationId) => {
		try {
			// Call the API to mark the notification as viewed
			await axios.post(
				`${process.env.REACT_APP_HOST}/api/notification/viewed`,
				{
					notificationId,
				}
			);

			// Remove the notification from the list
			setNotifications((prevNotifications) =>
				prevNotifications.filter(
					(notification) => notification.id !== notificationId
				)
			);
			window.location.reload();
		} catch (error) {
			console.error('Error marking the notification as viewed:', error);
		}
	};

	const handleChange = (event) => {
		setQuery(event.target.value);
	};

	const [showDropdown, setShowDropdown] = useState(false);
	const handleShowDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	const [notifDropdown, setNotifDropdown] = useState(false);
	const handleShowNotificationDropdown = () => {
		setNotifDropdown(!notifDropdown);
	};

	return (
		<nav className='navbar'>
			<div className='container'>
				<div className='left'>
					<div className='logo'>
						<input
							type='text'
							value={query}
							onChange={handleChange}
							placeholder='Search users'
						/>
					</div>
				</div>
				<div className='middle'>
					<ul>
						<li>
							<NavLink to='/home' className='nav-item'>
								Home
							</NavLink>
						</li>

						<li>
							<NavLink to='/followings' className='nav-item'>
								Following
							</NavLink>
						</li>
						<li>
							<div className='dropdown'>
								<div
									className='nav-item'
									onClick={handleShowNotificationDropdown}
								>
									Notifications ({notifications.length})
								</div>
								{notifDropdown && (
									<div className='dropdown-content'>
										{notifications.map((notification) => (
											<div key={notification.id} className='notification'>
												<p>
													<Link
														to={`/profile/${notification.id_source}`}
														onClick={() =>
															handleNotificationClick(notification.id)
														}
													>
														{notification.description}
													</Link>{' '}
												</p>
											</div>
										))}
									</div>
								)}
							</div>
						</li>
					</ul>
				</div>
				<div className='right'>
					<div className='nav-profile'>
						{authService.getCurrentUser() ? (
							<div className='profile-wrapper' onClick={handleShowDropdown}>
								<span>
									{user?.first_name} {user?.last_name}
								</span>
							</div>
						) : (
							<a
								href='/login'
								className='nav-button'
								style={{ color: 'white' }}
							>
								Přihlásit se
							</a>
						)}

						<div className={`profile-dropdown ${showDropdown && 'active'}`}>
							<ul>
								<li>
									<NavLink to='/profile' className='nav-item'>
										Profile
									</NavLink>
								</li>
								<li>
									<Button
										className='nav-item'
										onClick={handleOpenModal}
										style={{ color: 'black' }}
									>
										Change Password
									</Button>
								</li>
								<li>
									<a href='/' className='nav-item' onClick={authService.logout}>
										Logout
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className='search-results'>
				<ul>
					{users.map((user) => (
						<li key={user.id}>
							{user.first_name} {user.last_name} | @{user.username}{' '}
							<a href='' onClick={() => handleClick(user.id)}>
								View
							</a>
						</li>
					))}
				</ul>
			</div>
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Change Password</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ChangePasswordForm />
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleCloseModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</nav>
	);
};

export default Navbar;
