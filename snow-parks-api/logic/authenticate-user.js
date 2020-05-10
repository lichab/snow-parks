const { validate } = require('snow-parks-utils');
const {
	models: { User },
} = require('snow-parks-data');
const { NotAllowedError } = require('snow-parks-errors');
const bcrypt = require('bcryptjs');

/**
 * Checks user credentials against the storage
 *
 * @param {string} email user's unique e-mail
 * @param {string} password user's password
 *
 * @returns {Promise<string>} user id from storage
 *
 * @throws {ContentError} if user data does not follow the format and content rules
 * @throws {TypeError} if user data does not have the correct type
 * @throws {NotAllowedError} on wrong credentials
 */

module.exports = (email, password) => {
	validate.string(email, 'email');
	validate.email(email);
	validate.string(password, 'password');

	return (async () => {
		const user = await User.findOne({ email });
		if (!user) throw new NotAllowedError('wrong credentials');

		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) throw new NotAllowedError('wrong credentials');

		user.authenticated = new Date();

		await user.save();

		return user.id;
	})();
};
