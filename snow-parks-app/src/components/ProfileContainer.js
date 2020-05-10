import React, { useEffect, useState, useContext } from 'react';
import {
	retrievePublishedParks,
	retrieveUser,
	updateUser,
	retrievePark,
} from 'snow-parks-logic';
import Profile from './Profile';
import Loading from './Loading';
import { AuthContext } from './AuthProvider';
import { __handleErrors__ } from '../handlers';
import { Alert } from 'react-native';

export default function PorfileContainer({ navigation }) {
	const { logout, isUserLogged } = useContext(AuthContext);
	const [error, setError] = useState(null);
	const [publishedParks, setPublishedParks] = useState([]);
	const [user, setUser] = useState();

	useEffect(() => {
		(async () => {
			try {
				if (isUserLogged()) {
					const _user = await retrieveUser();

					const parks = await retrievePublishedParks(_user.id);

					setUser(_user);
					setPublishedParks(parks);
				}
			} catch (error) {
				__handleErrors__('Sorry something went wrong', setError);
				await logout();
			}
		})();
	}, []);

	const handleLogout = async () => await logout();

	const handleUpdateUser = async updates => {
		try {
			await updateUser(user.id, updates);

			const updated = await retrieveUser(true);

			Alert.alert('Update succesful');

			setUser(updated);
		} catch ({ message }) {
			__handleErrors__(message, setError);
		}
	};

	const handleGoToDetails = async id => {
		try {
			const park = await retrievePark(id);

			navigation.navigate('ParkDetails', { park });
		} catch (error) {
			if (error.name === 'NotFoundError') Alert.alert(error.message);
			else setError(error.message);
		}
	};

	if (!user) return <Loading error={error} />;

	return (
		<Profile
			user={user}
			error={error}
			userParks={publishedParks}
			onUpdateUser={handleUpdateUser}
			goToDetails={handleGoToDetails}
			onLogout={handleLogout}
		/>
	);
}
