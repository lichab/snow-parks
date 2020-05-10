import React, { useState } from 'react';
import { retrievePark } from 'snow-parks-logic';
import Results from './Results';

export default function ResultsContainer({ navigation, route }) {
	const [error, setError] = useState(route.params.error);

	const handleGoToDetails = async id => {
		try {
			const park = await retrievePark(id);

			navigation.navigate('ParkDetails', { park });
		} catch (error) {
			if (error.name === 'NotFoundError') Alert.alert(error.message);
			else setError(error.message);
		}
	};

	return (
		<Results
			results={route.params.results}
			error={error}
			onToDetails={handleGoToDetails}
		/>
	);
}
