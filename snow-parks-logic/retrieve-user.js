const context = require('./context');
const fetch = require('node-fetch');
const { NotFoundError } = require('snow-parks-errors');

/**
 * Retrieves the the requested user
 *
 * @returns {Object} user data
 *
 * @throws {NotFoundError} when the provided user id in token does not match any user
 */

module.exports = function retrieveUser(fresh = false) {
	//TODO add userId as arg fro retrieveing user other than the current user
	return (async () => {
		if (fresh || !this.user) {
			const token = await this.storage.getItem('token');

			const response = await fetch(`${this.API_URL}/users`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			});

			const data = await response.json();
			const { error: _error } = data;

			if (_error) throw new NotFoundError(_error);

			const { id, name, surname, email, contributions } = data;
			//TODO create logic to retrieve {contributions, image, allowLocation, notifications} separately
			this.user = { id, name, surname, email, contributions };
		}

		return this.user;
	})();
}.bind(context);
