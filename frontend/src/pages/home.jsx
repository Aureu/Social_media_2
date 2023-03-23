import React, { useState } from 'react';
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
			<br />
			<br />
		</div>
	);
};

export default HomePage;
