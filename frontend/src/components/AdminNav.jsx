import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import axios from 'axios';

const Navbar = () => {
	const [showNavbar, setShowNavbar] = useState(false);
	const [query, setQuery] = useState('');
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState();
	const [notifications, setNotifications] = useState([]);
	const navigate = useNavigate();

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

	const handleChange = (event) => {
		setQuery(event.target.value);
	};

	const [showDropdown, setShowDropdown] = useState(false);
	const handleShowDropdown = () => {
		setShowDropdown(!showDropdown);
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
							<NavLink to='/admin/users' className='nav-item'>
								User Management
							</NavLink>
						</li>

						<li>
							<NavLink to='/admin/content' className='nav-item'>
								Content Management
							</NavLink>
						</li>
					</ul>
				</div>
				<div className='right'>
					<div className='nav-profile'>
						<div className='profile-wrapper'>
							<span>
								<li>
									<a
										href='/'
										className='nav-item'
										onClick={authService.logout}
										style={{ color: 'black' }}
									>
										Logout
									</a>
								</li>
							</span>
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
		</nav>
	);
};

export default Navbar;
