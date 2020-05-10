const { NotFoundError, NotAllowedError } = require('snow-parks-errors');
const {
	models: { Park, User },
} = require('snow-parks-data');
const { validate } = require('snow-parks-utils');

/**
 * Adds a user's vote to the park. Sets the park rating to the difference
 * between upVotes and downVotes
 *
 * @param {string} userId user's unique id
 * @param {string} parkId park's unique id
 * @param {Boolean} vote the up or down vote from the user
 *
 * @returns {Promise<undefined>}
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if user data, park data or vote does not have the correct type
 * @throws {NotFoundError} when the provided id's don't match any document in storage
 * @throws {NotAllowedError} when the user has already upVoted
 * @throws {NotAllowedError} when the user has already downVoted
 */

module.exports = (userId, parkId, vote) => {
	validate.string(userId, 'userId');
	validate.string(parkId, 'parkId');
	validate.type(vote, 'vote', Boolean);

	return (async () => {
		const user = await User.findById(userId);
		if (!user) throw new NotFoundError(`user with id ${userId} does not exist`);

		const park = await Park.findById(parkId);
		if (!park) throw new NotFoundError(`park with id ${parkId} does not exist`);

		if (vote) {
			if (park.upVotes.includes(user._id))
				throw new NotAllowedError(`user with id ${userId} already upVoted`);

			const index = park.downVotes.indexOf(user._id);

			if (index !== -1) park.downVotes.splice(index, 1);
			else park.upVotes.push(user._id);
		} else {
			if (park.downVotes.includes(user._id))
				throw new NotAllowedError(`user with id ${userId} already downVoted`);

			const index = park.upVotes.indexOf(user._id);

			if (index !== -1) park.upVotes.splice(index, 1);
			else park.downVotes.push(user._id);
		}

		park.rating = park.upVotes.length - park.downVotes.length;

		await park.save();

		return;
	})();
};
