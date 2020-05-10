import React, { useState, useEffect, useContext } from 'react';
import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import {
	updatePark,
	publishComment,
	reportPark,
	votePark,
	approvePark,
	retrieveUser,
	retrievePark,
	deletePark,
} from 'snow-parks-logic';
import { __handleErrors__ } from '../handlers';
import Loading from './Loading';
import ParkDetails from './ParkDetails';
import { AuthContext } from './AuthProvider';

export default function ParkDetailsContainer({ navigation, route }) {
	const { isAnonymous, isUser } = useContext(AuthContext);
	const [park, setPark] = useState(route.params.park);
	const [error, setError] = useState(route.params.error);
	const [user, setUser] = useState({});

	useEffect(() => {
		(async () => {
			if (isUser) {
				const _user = await retrieveUser(true);
				setUser(_user);
			}
		})();
	}, []);

	const __handleParkUpdate__ = async id => {
		try {
			setError(null);

			const _park = await retrievePark(id);

			setPark(_park);
		} catch ({ message }) {
			__handleErrors__(message, setError);
		}
	};

	const __handleAnonymous__ = () =>
		Alert.alert('This action needs you to be registered');

	const handleOnDelete = async () => {
		try {
			await deletePark(user.id, park.id);
			await retrieveUser(true);

			Alert.alert('Park deleted');
		} catch ({ message }) {
			__handleErrors__(message, setError);
			Alert.alert('Sorry, Something went wrong');
		} finally {
			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: 'Home' }],
				})
			);
		}
	};

	const handleUpdate = async update => {
		try {
			await updatePark(user.id, park.id, update);

			__handleParkUpdate__(park.id);
		} catch ({ message }) {
			__handleErrors__(message, setError);
		}
	};

	const handleVote = async vote => {
		if (isAnonymous) return __handleAnonymous__();

		try {
			await votePark(user.id, park.id, vote);

			__handleParkUpdate__(park.id);
		} catch (error) {
			if (error.name === 'NotAllowedError')
				Alert.alert('This action cannot be performed twice by the same user');
			else __handleErrors__(error.message, setError);
		}
	};

	const handleCommentSubmit = async body => {
		if (isAnonymous) return __handleAnonymous__();

		try {
			await publishComment(user.id, park.id, body);

			__handleParkUpdate__(park.id);
		} catch ({ message }) {
			__handleErrors__(message, setError);
		}
	};

	const handleContribution = async action => {
		if (isAnonymous) return __handleAnonymous__();

		try {
			if (action === 'unreal' || action === 'duplicate')
				await reportPark(user.id, park.id, action);
			else if (action === 'approve') await approvePark(user.id, park.id);

			__handleParkUpdate__(park.id);

			await retrieveUser(true);

			Alert.alert('Thanks for contributing!');
		} catch ({ message }) {
			__handleErrors__(message, setError);
		}
	};

	if (!user || !park) return <Loading />;

	return (
		<ParkDetails
			park={park}
			user={user}
			onVote={handleVote}
			onDeletePark={handleOnDelete}
			onUpdate={handleUpdate}
			onCommentSubmit={handleCommentSubmit}
			onContribution={handleContribution}
			error={error}
		/>
	);
}
