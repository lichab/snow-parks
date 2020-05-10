const { validate } = require('snow-parks-utils');
const { NotFoundError, NotAllowedError } = require('snow-parks-errors');
const context = require('./context');
const fetch = require('node-fetch');

/**
 * Creates a new Park on parks collection, adding it to the user parks property
 *
 * @param {object} data all the park data
 * @param {object} data.park all the park specific properties
 * @param {Array} data.features all the features from the park
 *
 * @returns {Promise<undefined>}
 *
 * @throws {ContentError} if data inside data.park or data.features don't follow the format and content rules
 * @throws {TypeError} if data.park and data.features props do not have the correct type
 * @throws {NotFoundError} when the API can't match the user id in token with data in storage
 * @throws {NotAllowedError} when the park name already exists
 */

module.exports = function (data) {
	validate.type(data, 'park data', Object);

	const { features, park } = data;

	if (park.flow) validate.stringFrontend(park.flow, 'flow');

	for (key in park) {
		if (key === 'location') validate.type(park[key], key, Object);
		else if (key !== 'flow') validate.stringFrontend(park[key], key);
	}

	if (features.length) {
		validate.type(features, 'features', Array);

		features.forEach(feature => {
			for (key in feature)
				if (key !== 'location')
					validate.stringFrontend(feature[key], key, false);
				else validate.type(feature[key], key, Object);
		});
	}

	return (async () => {
		const token = await this.storage.getItem('token');

		const response = await fetch(`${this.API_URL}/users/parks`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ park, features }),
		});

		if (response.status === 201) return;

		if (response.status >= 400 || response.status < 500) {
			const { error } = await response.json();

			if (response.status === 404)
				throw new NotFoundError(
					'It seems you are not logged in or you deleted your account'
				);
			if (response.status === 403) throw new NotAllowedError(error);

			throw new Error(error);
		} else throw new Error('Server error');
	})();
}.bind(context);
