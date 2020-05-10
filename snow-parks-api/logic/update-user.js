const { validate } = require('snow-parks-utils');
const {
	models: { User },
} = require('snow-parks-data');
const { NotAllowedError, NotFoundError } = require('snow-parks-errors');
const bcrypt = require('bcryptjs');

/**
 * Updates the user with the new given data.
 *
 * @param {string} id the user's unique id
 * @param {Object} data the modifications to be made
 *
 * @returns {Promise<undefined>}
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if userId or data and data keys do not have the correct type
 * @throws {Error} if the oldPassword or password are not given when required
 * @throws {NotFoundError} if the provided user id does not match any user in storage
 * @throws {NotAllowedError} if any of the keys in data are not valid
 * @throws {NotAllowedError} if the oldPassword does not match the password in storage
 *
 */

module.exports = (id, data) => {
	validate.string(id, 'userId');
	validate.type(data, 'updates', Object);

	const {
		name,
		surname,
		email,
		allowLocation,
		notifications,
		password,
		oldPassword,
	} = data;

	if (name !== undefined) {
		validate.string(name, 'name');
	}

	if (surname !== undefined) {
		validate.string(surname, 'surname');
	}

	if (email !== undefined) {
		validate.string(email, 'email');
	}

	if (notifications !== undefined) {
		validate.type(notifications, 'notifications', Boolean);
	}

	if (allowLocation !== undefined) {
		validate.type(allowLocation, 'allowLocation', Boolean);
	}

	if (password !== undefined) {
		validate.string(password, 'password');
	}

	if (oldPassword !== undefined) {
		validate.string(oldPassword, 'oldPassword');
	}

	if (password && !oldPassword) throw new Error('oldPassword is not defined');
	if (!password && oldPassword) throw new Error('password is not defined');

	const keys = Object.keys(data);

	const VALID_KEYS = [
		'name',
		'surname',
		'allowLocation',
		'email',
		'password',
		'oldPassword',
		'notifications',
	];

	for (const key of keys)
		if (!VALID_KEYS.includes(key))
			throw new NotAllowedError(`property ${key} is not allowed`);

	return (async () => {
		const _user = await User.findById(id);

		if (!_user) throw new NotFoundError(`user ${id} does not exist`);

		if (password) {
			const verifiedPassword = await bcrypt.compare(
				oldPassword,
				_user.password
			);

			if (!verifiedPassword) throw new NotAllowedError('wrong credentials');

			data.password = await bcrypt.hash(password, 10);
		}

		await User.findByIdAndUpdate(id, { $set: data });

		return;
	})();
};
