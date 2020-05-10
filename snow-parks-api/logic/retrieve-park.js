const {
	models: { Park },
} = require('snow-parks-data');
const { validate, sanitize } = require('snow-parks-utils');
const { NotFoundError } = require('snow-parks-errors');

/**
 * Retrieves the requested park from the storage
 *
 * @param {string} parkId the park's unique id
 *
 * @returns {Promise<Object>} park data
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if parkId does not have the correct type
 * @throws {NotFoundError} when the provided parkId does not match any park
 */

module.exports = parkId => {
	validate.string(parkId, 'park id');

	return (async () => {
		const park = await Park.findById(parkId)
			.populate('creator', 'name')
			.populate('comments.postedBy', 'name')
			.lean();

		if (!park) throw new NotFoundError(`park ${parkId} does not exist`);

		sanitize(park.creator);

		park.features.forEach(feature => sanitize(feature));

		return sanitize(park);
	})();
};
