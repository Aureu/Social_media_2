import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import React, { useState } from 'react';

const ChangeProfileImage = (props) => {
	const [image, setImage] = useState({ preview: '', data: '' });
	const [status, setStatus] = useState('');

	const handleEdit = async (event) => {
		event.preventDefault(); //prevent reload of page

		setStatus('Ukládání');

		let formData = new FormData();
		formData.append('file', image.data);
		fetch(`${process.env.REACT_APP_HOST}/api/user/upload`, {
			method: 'POST',
			body: formData,
		}).then(() => {
			props.setShow(false);
			setStatus(null);
			document.location.reload();
		});
	};

	const handleFileChange = async (e) => {
		const file = e.target.files[0];

		// Validate file size
		if (file && file.size > 10 * 1024 * 1024) {
			setStatus('Soubor je moc velký. Maximální velikost je 10MB.');
			return;
		}

		// Validate file type
		if (file && !file.type.startsWith('image/')) {
			setStatus('Soubor není obrázek.');
			return;
		}

		const img = {
			preview: URL.createObjectURL(e.target.files[0]),
			data: new File([e.target.files[0]], `${props.user.id}.webp`),
		};
		setImage(img);
	};

	return (
		<div className='modal' style={{ display: props.show ? 'block' : 'none' }}>
			<div className='modal-content'>
				<div className='profile-header__image'>
					{image.preview && (
						<img
							alt={'profile'}
							className={'profile-photo'}
							src={image.preview}
						/>
					)}
				</div>
				<form>
					<div className={'d-flex justify-content-between'}>
						<input onChange={handleFileChange} name={'file'} type='file' />
					</div>
				</form>
				{status && <h4>{status}</h4>}

				<Button className={'btn1'} onClick={handleEdit}>
					Uložit
				</Button>
			</div>
		</div>
	);
};

export default ChangeProfileImage;
