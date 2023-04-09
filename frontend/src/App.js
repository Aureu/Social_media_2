import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
	RegisterPage,
	LoginPage,
	ProfilePage,
	ShowProfilePage,
	FollowingsPage,
	HomePage,
} from './pages';
import PrivateRoute from './components/PrivateRoute';

function App() {
	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route path='/register' element={<RegisterPage />} />
					<Route path='/' element={<LoginPage />} />
					<Route path='/home' element={<HomePage />} />
					<Route path='/profile' element={<PrivateRoute />}>
						<Route index element={<ProfilePage />} />
						<Route path=':id' element={<ShowProfilePage />} />
					</Route>
					<Route path='/followings' element={<PrivateRoute />}>
						<Route index element={<FollowingsPage />} />
					</Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
