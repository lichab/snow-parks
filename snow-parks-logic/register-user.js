const { validate } = require('snow-parks-utils');
const fetch = require('node-fetch');
const context = require('./context');

/**
 * Sends new user data to API for registration

 * @param {string} name the name of the user
 * @param {string} surname the surname of the user
 * @param {string} email   the email of the user
 * @param {string} password the password of the user
 * 
 * @returns {Promise<undefined>}
 * 
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if user's name, surname, email or password do not have the correct type
 * @throws {NotAllowedError} when provided email already exists
 */

module.exports = function (name, surname, email, password) {
	validate.stringFrontend(email, 'email');
	validate.stringFrontend(name, 'name');
	validate.stringFrontend(surname, 'surname');
	validate.stringFrontend(password, 'password');
	validate.email(email, 'email');

	return (async () => {
		const response = await fetch(`${this.API_URL}/users`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, surname, email, password }),
		});

		if (response.status === 201) return;

		if (response.status >= 400 || response.status < 500) {
			const { error } = await response.json();

			throw new Error(error);
		} else throw new Error('Unknown error');
	})();
}.bind(context);
