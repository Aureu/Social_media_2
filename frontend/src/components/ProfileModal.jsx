import React from 'react';
import Select from 'react-select';
import countries from '../countries.js';
import jobPositions from '../jobPositions.js';

function ProfileModal({
	showModal,
	toggleModal,
	changeUserData,
	changeFname,
	changeLname,
	changeUsername,
	handleCountryChange,
	handleJobChange,
	user,
}) {
	return (
		<>
			{showModal && (
				<div className='modal'>
					<div className='modal-content'>
						<h2>Edit Profile</h2>
						<form onSubmit={changeUserData}>
							<label>
								First Name:
								<input
									type='text'
									name='fName'
									placeholder={user?.first_name}
									ref={changeFname}
								/>
							</label>
							<label>
								Last Name:
								<input
									type='text'
									name='lName'
									placeholder={user?.last_name}
									ref={changeLname}
								/>
							</label>
							<label>
								Username:
								<input
									type='text'
									name='username'
									placeholder={user?.username}
									ref={changeUsername}
								/>
							</label>
							<label>
								Job:
								<Select
									options={jobPositions}
									placeholder={user?.job}
									onChange={handleJobChange}
								/>
							</label>
							<label>
								Location:
								<Select
									options={countries}
									placeholder={user?.location}
									onChange={handleCountryChange}
								/>
							</label>
							<input type='submit' value='Save' />
							<button onClick={toggleModal}>Cancel</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
}

export default ProfileModal;
