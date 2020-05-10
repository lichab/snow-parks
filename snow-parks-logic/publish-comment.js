const context = require('./context');
const { validate } = require('snow-parks-utils');
const { NotFoundError } = require('snow-parks-errors');
const fetch = require('node-fetch');

/**
 * Publishes a new comment into the park, on the user's behalf.
 *
 * @param {string} userId user's unique id
 * @param {string} parkId park's unique id
 * @param {string} body the comment body itself
 *
 * @returns {undefined}
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if userId, parkId or body do not have the correct type
 * @throws {NotFoundError} when the API does not recognize the provided id's
 */

module.exports = function (userId, parkId, body) {
	validate.stringFrontend(userId, 'userId');
	validate.stringFrontend(parkId, 'parkId');
	validate.stringFrontend(body, 'body');

	return (async () => {
		const token = await this.storage.getItem('token');

		const response = await fetch(
			`${this.API_URL}/users/${userId}/parks/${parkId}/comment`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ body }),
			}
		);

		if (response.status === 201) return;

		if (response.status >= 400 || response.status < 500) {
			const data = await response.json();
			const { error } = data;

			if (response.status === 404) throw new NotFoundError(error);

			throw new Error(error);
		} else throw new Error('Server error');
	})();
}.bind(context);
