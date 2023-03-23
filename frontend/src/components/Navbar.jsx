import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import AuthService from '../services/auth.service';
import axios from 'axios';

const Navbar = () => {
	const [showNavbar, setShowNavbar] = useState(false);
	const [query, setQuery] = useState('');
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState();

	const currentUser = AuthService.getCurrentUser();

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

	useEffect(() => {
		fetchUser().then((user) => {
			setUser(user);
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
			const response = await axios.get(
				`${process.env.REACT_APP_HOST}/api/user/search?q=${query}`
			);
			setUsers(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleChange = (event) => {
		setQuery(event.target.value);
	};

	return (
		<nav className='navbar'>
			<div className='container'>
				<div className='logo'>
					<input
						type='text'
						value={query}
						onChange={handleChange}
						placeholder='Search users'
					/>
				</div>
				<div className='menu-icon' onClick={handleShowNavbar}>
					<p>...</p>
				</div>
				<div className={`nav-elements ${showNavbar && 'active'}`}>
					<ul>
						<li>
							<NavLink to='/' className='nav-item'>
								Home
							</NavLink>
						</li>
						<li>
							<NavLink to='/messages' className='nav-item'>
								Messages
							</NavLink>
						</li>
						<li>
							<NavLink to='/friends' className='nav-item'>
								Friends
							</NavLink>
						</li>
						<li>
							<NavLink to='/notifications' className='nav-item'>
								Notifications
							</NavLink>
						</li>
					</ul>
				</div>
				<div className='nav-profile'>
					<div className='profile-wrapper'>
						<div className='profile-image'>
							<img
								src='img/farma_rochov.png'
								alt=''
								className='profile-image'
							/>
						</div>
						<span>{user?.first_name}</span>
					</div>
					<div className='profile-dropdown' onClick={handleShowNavbar}>
						<ul>
							<li>
								<NavLink to='/profile' className='nav-item'>
									Profile
								</NavLink>
							</li>
							<li>
								<NavLink to='/settings' className='nav-item'>
									Settings
								</NavLink>
							</li>
							<li>
								<a
									href='/login'
									className='nav-item'
									onClick={AuthService.logout}
								>
									Logout
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div>
				<ul>
					{users.map((user) => (
						<li key={user.id}>
							{user.first_name} {user.last_name}
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
