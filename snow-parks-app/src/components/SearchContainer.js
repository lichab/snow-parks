import React, { useState, useEffect } from 'react';
import { __handleErrors__ } from '../handlers';
import { searchParks } from 'snow-parks-logic';
import Search from './Search';

export default function SearchContainer({ navigation }) {
	const [location, setLocation] = useState();

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(function ({ coords }) {
			const _location = [coords.longitude, coords.latitude];
			setLocation(_location);
		});
	}, []);

	const handleOnSubmit = async query => {
		try {
			const results = await searchParks(query, location);

			if (!results.length) throw new Error(`No ${query} parks found`);

			navigation.navigate('Results', { results });
		} catch ({ message }) {
			navigation.navigate('Results', { error: message });
		}
	};

	return <Search onSubmit={handleOnSubmit} />;
}
