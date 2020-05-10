const context = require('./context');
const { validate } = require('snow-parks-utils');
const { NotAllowedError, NotFoundError } = require('snow-parks-errors');
const fetch = require('node-fetch');

/**
 * Updates the park with the new given property values.
 *
 * @param {string} userId the user's unique id
 * @param {string} parkid the park's unique id
 * @param {Object} updates the modifications to be made
 *
 *
 * @returns {undefined}
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if userId, parkId or updates does not have the correct type
 * @throws {NotFoundError} if the provided parkId or id in token do not match any park or user on the API side
 * @throws {NotAllowedError} if the provided userId does not match the parks creator id
 * @throws {NotAllowedError} if the keys in updates are not valid
 *
 */

module.exports = function (userId, parkId, updates) {
	validate.string(userId, 'userId');
	validate.string(parkId, 'parkId');
	validate.type(updates, 'updates', Object);

	return (async () => {
		const token = await this.storage.getItem('token');

		const response = await fetch(
			`${this.API_URL}/users/${userId}/parks/${parkId}/update`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ ...updates }),
			}
		);

		if (response.status === 200) return;

		if (response.status >= 400 || response.status < 500) {
			const { error } = await response.json();

			if (response.status === 404) throw new NotFoundError(error);
			if (response.status === 403) throw new NotAllowedError(error);

			throw new Error(error);
		} else throw new Error('Server error');
	})();
}.bind(context);
