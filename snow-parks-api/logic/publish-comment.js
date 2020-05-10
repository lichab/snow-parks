const { validate } = require('snow-parks-utils');
const {
	models: { Park, User, Comment },
} = require('snow-parks-data');
const { NotFoundError } = require('snow-parks-errors');

/**
 * Embeds a new comment into the park comments Array
 *
 * @param {string} userId user's unique id
 * @param {string} parkId park's unique id
 * @param {string} body the comment body itself
 *
 * @returns {Promise<undefined>}
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if userId, parkId or body.body do not have the correct type
 * @throws {NotFoundError} when the provided userId or parkId do not match document
 */

module.exports = (userId, parkId, body) => {
	validate.string(userId, 'user id');
	validate.string(parkId, 'park id');
	validate.string(body, 'body');

	return (async () => {
		const user = await User.findById(userId);

		if (!user) throw new NotFoundError(`user with id ${userId} does not exist`);

		const park = await Park.findById(parkId);

		if (!park) throw new NotFoundError(`park with id ${parkId} does not exist`);

		const comment = new Comment({ postedBy: user, body });
		park.comments.push(comment);

		await park.save();

		return;
	})();
};
