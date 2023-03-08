import React from 'react';
import Navbar from '../components/Navbar';

const HomePage = () => {
	return (
		<div>
			<Navbar />
			<br /> <br />
			<br /> <br />
			<br /> <br />
			HomePage
			<br />
			<a href='/login'>Login</a>
			<br />
			<a href='/register'>Register</a>
		</div>
	);
};

export default HomePage;
