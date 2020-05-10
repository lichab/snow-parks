const { validate } = require('snow-parks-utils');
const { NotAllowedError, NotFoundError } = require('snow-parks-errors');
const context = require('./context');
const fetch = require('node-fetch');

/**
 * Adds user aproval to the park.
 *
 * @param {string} userId user's unique id
 * @param {string} parkID the park unique id
 *
 * @returns {Promise<undefined>}
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if user data and park does not have the correct type
 * @throws {NotFoundError} when the provided id's trigger a 404 response from API
 * @throws {NotAllowedError} when the userId already approved and the API responds with a 403
 */

module.exports = function (userId, parkId) {
	validate.stringFrontend(userId, 'userId');
	validate.stringFrontend(parkId, 'parkId');

	return (async () => {
		const token = await this.storage.getItem('token');

		const response = await fetch(
			`${this.API_URL}/users/${userId}/parks/${parkId}/approve`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (response.status === 200) return;

		if (response.status >= 400 || response.status < 500) {
			const data = await response.json();
			const { error } = data;

			if (response.status === 404) throw new NotFoundError(error);
			if (response.status === 403)
				throw new NotAllowedError('You already approved this park');

			throw new Error(error);
		} else throw new Error('Server error');
	})();
}.bind(context);
