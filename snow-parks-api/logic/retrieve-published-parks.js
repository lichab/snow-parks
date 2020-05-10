const {
	models: { Park, User },
} = require('snow-parks-data');
const { validate, sanitize } = require('snow-parks-utils');
const { NotFoundError } = require('snow-parks-errors');

/**
 * Retrieves the parks created by a specific user
 *
 * @param {string} id the user's unique id
 *
 * @returns {Promise<Array>} a list of al parks data. Empty if user has no created parks
 *
 * @throws {ContentError} if id doesn't follow the format and content rules
 * @throws {TypeError} if id does not have the correct type
 */

module.exports = id => {
	validate.string(id, 'user id');

	return (async () => {
		const user = await User.findById(id).lean();

		if (!user) throw new NotFoundError(`user with id ${id} does not exist`);

		const results = await Park.find({ creator: id }).lean();

		if (!results.length) return results;

		const sanitizedResults = results.map(result => {
			const { id, name, resort, size, verified, rating } = sanitize(result);

			return { id, name, resort, size, verified, rating };
		});

		return sanitizedResults;
	})();
};
