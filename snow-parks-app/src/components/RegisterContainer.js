import { registerUser } from 'snow-parks-logic';
import { __handleErrors__ } from '../handlers';
import Register from './Register';
import React, { useState } from 'react';

export default function RegisterScreen({ navigation }) {
	const [error, setError] = useState(null);

	const handleSubmit = async (name, surname, email, password) => {
		try {
			await registerUser(name, surname, email, password);

			setError(null);

			navigation.navigate('Login');
		} catch ({ message }) {
			__handleErrors__(message, setError);
		}
	};

	const handleGoToLogin = () => navigation.navigate('Login');

	return (
		<Register
			onSubmit={handleSubmit}
			onToLogin={handleGoToLogin}
			error={error}
		/>
	);
}
