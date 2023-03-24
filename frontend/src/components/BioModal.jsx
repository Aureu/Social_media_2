import React from 'react';

function ProfileModal({
	showModal,
	toggleModal,
	changeBio,
	changeUserBio,
	bio,
}) {
	return (
		<>
			{showModal && (
				<div className='modal'>
					<div className='modal-content'>
						<h2>Edit Bio</h2>
						<form onSubmit={changeUserBio}>
							<label>
								Bio:
								<textarea
									className='bio-textarea'
									name='bio'
									maxLength={255}
									placeholder={bio.bio}
									ref={changeBio}
								/>
							</label>
							<div className='modal-buttons'>
								<button className='save-button' type='submit'>
									Save
								</button>
								<button className='cancel-button' onClick={toggleModal}>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}

export default ProfileModal;
