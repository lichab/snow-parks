const { validate } = require('snow-parks-utils');
const { NotFoundError, NotAllowedError } = require('snow-parks-errors');
const {
	models: { User },
} = require('snow-parks-data');

/**
 * Retrieves the requested user from the storage
 * 
 * @param {object} payload the token's payload
 * @param {string} payload.sub the user's unique id
 
 * 
 * @returns {Object} user data
 * 
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if user id does not have the correct type
 * @throws {NotFoundError} when the provided user id does not match any user
 * @throws {NotAllowedError} when the provided user id belongs to a deactivated user
 */

// Will need to change it to alson receive id through params if need to go to other user profile
module.exports = _id => {
	validate.string(_id, 'user id');

	return (async () => {
		const user = await User.findById(_id);

		if (!user) throw new NotFoundError(`user with id ${_id} does not exist`);
		if (user.deactivated)
			throw new NotAllowedError(`user with id ${_id} is deactivated`);

		user.retrieved = new Date();

		user.save();

		const {
			id,
			name,
			surname,
			email,
			contributions,
			image,
			allowLocation,
			notifications,
		} = user;

		return {
			id,
			name,
			surname,
			email,
			contributions,
			image,
			allowLocation,
			notifications,
		};
	})();
};
