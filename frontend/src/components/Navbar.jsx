import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import authService from '../services/auth.service';

const Navbar = () => {
	const [showNavbar, setShowNavbar] = useState(false);

	const handleShowNavbar = () => {
		setShowNavbar(!showNavbar);
	};
	return (
		<>
			<nav className='navbar'>
				<div className='container'>
					<div className='logo'>
						<p>logo</p>
					</div>
					<div className='menu-icon' onClick={handleShowNavbar}>
						<p>...</p>
					</div>
					<div className={`nav-elements  ${showNavbar && 'active'}`}>
						<ul>
							<li>
								<NavLink to='/' className='nav-item'>
									Domů
								</NavLink>
							</li>
							<li>
								<NavLink to='/test' className='nav-item'>
									O nás
								</NavLink>
							</li>
							<li>
								<NavLink to='/sluzby' className='nav-item'>
									Ceník
								</NavLink>
							</li>
							<li>
								<NavLink to='/kontakt' className='nav-item'>
									Kontakt
								</NavLink>
							</li>
							<li>
								{authService.getCurrentUser() ? (
									<a onClick={authService.logout} href={'/login'}>
										Odhlásit se
									</a>
								) : (
									<a
										href='/login'
										className='nav-button'
										style={{ color: 'white' }}
									>
										Přihlásit se
									</a>
								)}
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
