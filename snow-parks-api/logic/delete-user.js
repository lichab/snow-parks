const { validate } = require('snow-parks-utils');
const {
	models: { User },
} = require('snow-parks-data');
const bcrypt = require('bcryptjs');
const { NotAllowedError, NotFoundError } = require('snow-parks-errors');

/**
 * Removes user from storage
 *
 * @param {string} _id  user's unique id
 * @param {string} password user's password
 *
 * @returns {Promise<undefined>}
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if userId or password do not have the correct type
 * @throws {NotFoundError} when the provided userId does not match any user in storage
 * @throws {NotAllowedError} when the provided password does not match the user password
 */

module.exports = (id, password) => {
	validate.string(id, 'user id');
	validate.string(password, 'password');

	return (async () => {
		const user = await User.findById(id);

		if (!user) throw new NotFoundError(`user with id ${id} does not exist`);

		const validPassword = await bcrypt.compare(password, user.password);

		if (validPassword) {
			await User.deleteOne({ _id: id });

			return;
		}

		throw new NotAllowedError('incorrect password');
	})();
};
