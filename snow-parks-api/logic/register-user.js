const { validate } = require('snow-parks-utils');
const {
	models: { User },
} = require('snow-parks-data');
const { NotAllowedError } = require('snow-parks-errors');
const bcrypt = require('bcryptjs');

/**
 * Creates a new user and adds it to the storage
 *
 * @param {object} user the new user to be added
 * @param {string} user.name the name of the user
 * @param {string} user.surname the surname of the user
 * @param {string} user.email   the email of the user
 * @param {string} user.password the password of the user
 *
 * @returns {Promise<undefined>} returns an empty promise
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if user's name, surname, email or password do not have the correct type
 * @throws {NotAllowedError} when provided email already exists in storage
 */

module.exports = ({ name, surname, email, password }) => {
	validate.string(name, 'name');
	validate.string(surname, 'surname');
	validate.string(email, 'email');
	validate.email(email);
	validate.string(password, 'password');

	return (async () => {
		const user = await User.findOne({ email });

		if (user) throw new NotAllowedError(`user ${email} already exists`);

		password = await bcrypt.hash(password, 10);

		await User.create({ name, surname, email, password });

		return;
	})();
};
