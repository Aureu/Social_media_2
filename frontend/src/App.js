import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { HomePage, RegisterPage, LoginPage } from './pages';

function App() {
	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route exact path='/' element={<HomePage />} />
					<Route exact path='/register' element={<RegisterPage />} />
					<Route exact path='/login' element={<LoginPage />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
