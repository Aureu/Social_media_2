import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AuthService from '../services/auth.service';

const FollowingsPage = () => {
	const [followings, setFollowings] = useState([]);

	const currentUser = AuthService.getCurrentUser();

	const navigate = useNavigate();

	const handleClick = (id) => {
		navigate(`/profile/${id}`);
	};

	const handleUnfollow = async (id) => {
		const following_user_id = currentUser.id;
		const follower_user_id = id;

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_HOST}/api/user/unfollow`,
				{
					following_user_id: following_user_id,
					follower_user_id: follower_user_id,
				}
			);

			if (response.status === 200) {
				console.log(
					`User ${following_user_id} has unfollowed user ${follower_user_id}`
				);
				window.location.reload();
			} else {
				console.error('Failed to unfollow user');
			}
		} catch (error) {
			console.error('Error while unfollowing user:', error);
		}
	};

	useEffect(() => {
		const fetchFollowings = async () => {
			try {
				const response = await axios.post(
					`${process.env.REACT_APP_HOST}/api/users/get-followings`,
					{
						id_user: currentUser.id,
					}
				);
				console.log(response.data);
				setFollowings(response.data);
			} catch (error) {
				console.error('Error fetching followings:', error);
			}
		};

		fetchFollowings();
	}, []);

	return (
		<>
			<Navbar />
			<br />
			<br />
			<br />
			<br />
			<br />
			<div class='users-i-follow'>
				<h1>Users I Follow</h1>
				<div class='followings-container'>
					{followings.map((following) => (
						<div key={following.id} class='following-user'>
							<img
								className='profile-picture'
								alt={'profile picture'}
								src={`${process.env.REACT_APP_HOST}/upload/${following.followerUser.id}.webp`}
								onError={({ currentTarget }) => {
									currentTarget.onerror = null; // prevents looping
									currentTarget.src = `${process.env.REACT_APP_HOST}/upload/noimage.webp`;
								}}
							></img>
							<h3>@{following.followerUser.username}</h3>
							<p>
								{following.followerUser.first_name}{' '}
								{following.followerUser.last_name}
							</p>
							<button
								className='view-button'
								onClick={() => handleClick(following.followerUser.id)}
							>
								View
							</button>
							<button
								className='view-button'
								onClick={() => handleUnfollow(following.followerUser.id)}
							>
								Unfollow
							</button>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default FollowingsPage;
