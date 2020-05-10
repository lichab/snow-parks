const context = require('./context');
const { validate } = require('snow-parks-utils');
const { NotAllowedError } = require('snow-parks-errors');
const fetch = require('node-fetch');

/**
 * Calls API to verifify user credentials and saves the returned token in the context
 *
 * @param {string} email user's unique e-mail
 * @param {string} password user's password
 *
 * @returns {Promise<undefined>}
 *
 * @throws {ContentError} if user data does not follow the format and content rules
 * @throws {NotAllowedError} if user credentials don't match
 * @throws {TypeError} if user data does not have the correct type
 * @throws {Error} on wrong credentials
 */

module.exports = function (email, password) {
	validate.stringFrontend(email, 'email');
	validate.stringFrontend(password, 'password');
	validate.email(email, 'email');

	return (async () => {
		const response = await fetch(`${this.API_URL}/users/auth`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		if (response.status === 200) {
			const { token } = await response.json();

			await this.storage.setItem('token', token);

			return;
		}

		if (response.status >= 400 || response.status < 500) {
			const { error } = await response.json();

			if (response.status === 403) throw new NotAllowedError(error);
			else throw new Error(error);
		} else throw new Error('Unknown error');
	})();
}.bind(context);
