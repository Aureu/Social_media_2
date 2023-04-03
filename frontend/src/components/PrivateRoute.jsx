import { Route, Navigate, Outlet } from 'react-router-dom';

import AuthService from '../services/auth.service';

function PrivateRoute() {
	const currentUser = AuthService.getCurrentUser();

	return currentUser ? <Outlet /> : <Navigate to='/' />;
}

export default PrivateRoute;
