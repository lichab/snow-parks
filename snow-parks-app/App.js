import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { Providers } from './src/components/Providers';
import config from './config';
import logic, { setAnonymousUser, isAnonymousUser } from 'snow-parks-logic';
import { __handleErrors__ } from './src/handlers';

logic.__context__.storage = AsyncStorage;
logic.__context__.API_URL = config.API_URL;

export default function App() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			if (await isAnonymousUser()) await setAnonymousUser(false);
		})();
	}, []);

	const getFonts = () =>
		Font.loadAsync({
			montserrat: require('./assets/fonts/Montserrat-Regular.ttf'),
			'montserrat-semi': require('./assets/fonts/Montserrat-SemiBold.ttf'),
			'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf'),
		});

	if (isLoading)
		return (
			<AppLoading
				startAsync={getFonts}
				onError={({ message }) => __handleErrors__(message, setError)}
				onFinish={() => setIsLoading(false)}
			/>
		);

	if (!isLoading) return <Providers />;
}
