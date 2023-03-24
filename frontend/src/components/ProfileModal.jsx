import React from 'react';

function ProfileModal({
	showModal,
	toggleModal,
	changeUserData,
	changeFname,
	changeLname,
	changeUsername,
	changeJob,
	changeLocation,
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
								<input
									type='text'
									name='job'
									placeholder={user?.job}
									ref={changeJob}
								/>
							</label>
							<label>
								Location:
								<input
									type='text'
									name='location'
									placeholder={user?.location}
									ref={changeLocation}
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
