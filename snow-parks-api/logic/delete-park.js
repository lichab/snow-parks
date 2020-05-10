const { validate } = require('snow-parks-utils');
const { NotFoundError, NotAllowedError } = require('snow-parks-errors');
const {
	models: { User, Park },
} = require('snow-parks-data');

/**
 * Removes park from storage and from user parks array. If no userId is provided,
 * will remove the park if requirementes are met.
 * When userId is provided, it must match the park creator id
 *
 * @param {string} userId user's unique id
 * @param {string} parkId park's unique id
 *
 * @returns {Promise<undefined>}
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if userId and parkId do not have the correct type
 * @throws {NotFoundError} when the provided userId or parkId do not match document
 * @throws {NotAllowedError} when the provided userId does not match the creator id
 * @throws {NotAllowedError} no userId is provided and park does not meet requirements to be deleted
 */

module.exports = (parkId, userId) => {
	validate.string(parkId, 'parkId');
	if (userId || userId === '') validate.string(userId, 'userId');

	return (async () => {
		const park = await Park.findById(parkId);

		if (!park) throw new NotFoundError(`park ${parkId} does not exist`);

		if (userId) {
			const user = await User.findById(userId);
			if (!user) throw new NotFoundError(`user ${userId} does not exist`);

			const { deletedCount } = await Park.deleteOne({
				_id: parkId,
				creator: userId,
			});

			if (deletedCount === 0)
				throw new NotAllowedError(`user ${userId} did not create this park`);

			const parks = user.parks.filter(id => id.toString() !== parkId);
			user.parks = parks;

			await user.save();

			return;
		}

		if (!park.underReview)
			throw new NotAllowedError(
				`park ${parkId} is not under review. A user id is required`
			);

		const difference = park.approvals.length - park.reports.length;

		if (!park.approvals.length || difference < 0) {
			await Park.deleteOne({ _id: parkId });
			await User.updateOne(
				{ _id: park.creator },
				{ $pull: { parks: { $in: [parkId] } } }
			);

			return;
		}

		return;
	})();
};
