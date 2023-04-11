import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
	RegisterPage,
	LoginPage,
	ProfilePage,
	ShowProfilePage,
	FollowingsPage,
	HomePage,
	AdminPage,
	UsersPage,
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
					<Route path='/admin' element={<PrivateRoute />}>
						<Route index element={<AdminPage />} />
					</Route>
					<Route path='/admin/users' element={<PrivateRoute />}>
						<Route index element={<UsersPage />} />
					</Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
