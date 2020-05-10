const context = require('./context');
const { NotFoundError, NotAllowedError } = require('snow-parks-errors');
const { validate } = require('snow-parks-utils');
const fetch = require('node-fetch');

/**
 * Adds a user's vote to the park.
 *
 * @param {string} userId user's unique id
 * @param {string} parkId park's unique id
 * @param {Boolean} vote the up or down vote from the user
 *
 * @returns {undefined}
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if user id, park id or vote do not have the correct type
 * @throws {NotFoundError} when the provided id's are do not match any records
 * @throws {NotAllowedError} when the user has already upVoted
 * @throws {NotAllowedError} when the user has already downVoted
 */

module.exports = function (userId, parkId, vote) {
	validate.stringFrontend(userId, 'userId');
	validate.stringFrontend(parkId, 'parkId');
	validate.type(vote, 'vote', Boolean);

	return (async () => {
		const token = await this.storage.getItem('token');

		const response = await fetch(
			`${this.API_URL}/users/${userId}/parks/${parkId}/vote`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ vote }),
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
