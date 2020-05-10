const { validate } = require('snow-parks-utils');
const {
	models: { Park, Location, Feature },
} = require('snow-parks-data');
const { NotAllowedError, NotFoundError } = require('snow-parks-errors');

/**
 * Updates the park with the new given property values.
 *
 * @param {string} userId the user's unique id
 * @param {string} parkid the park's unique id
 * @param {Object} updates the modifications to be made
 *
 * @returns {Promise<undefined>}
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if userId, parkId or updates does not have the correct type
 * @throws {NotFoundError} if the provided parkId does not match any park in storage
 * @throws {NotAllowedError} if the provided userId does not match the parks creator id
 * @throws {NotAllowedError} if the keys in updates are not valid
 *
 */

module.exports = (userId, parkId, updates) => {
	validate.string(userId, 'userId');
	validate.string(parkId, 'parkId');
	validate.type(updates, 'updates', Object);

	return (async () => {
		const park = await Park.findById(parkId);
		if (!park) throw new NotFoundError(`park ${parkId} does not exist`);

		if (park.creator._id.toString() !== userId)
			throw new NotAllowedError(`user ${userId} did not create this park`);

		for (key in updates) {
			if (!park[key]) throw new NotAllowedError(`field ${key} is not a valid`);

			if (key === 'location')
				updates[key] = new Location({ coordinates: updates[key].coordinates });

			if (key === 'features')
				updates[key].forEach(feature => {
					if (feature.location)
						feature.location = new Location({
							coordinates: feature.location.coordinates,
						});

					feature = new Feature(feature);
				});

			park[key] = updates[key];
		}

		await park.save();

		return;
	})();
};
