const {
	models: { Park },
} = require('snow-parks-data');
const { validate, sanitize } = require('snow-parks-utils');
const { NotFoundError } = require('snow-parks-errors');

/**
 * Search for the parks in storage that match the given query.
 * Ordering them by distance.
 *
 * @param {string} query the query itself provided by the user
 * @param {Array}  location the location of the user
 *
 * @returns {Promise<Array>} list of matching results. Empty if no matches
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if query does not have the correct type
 * @throws {NotFoundError} if query returns no results
 *
 */

module.exports = (query, location) => {
	validate.string(query, 'query', false);
	validate.type(location, 'location', Array);

	location = location.map(coordinate => parseFloat(coordinate));

	let filter = {
		$and: [
			{
				location: {
					$near: {
						$geometry: {
							type: 'Point',
							coordinates: location,
						},
					},
				},
			},
		],
	};

	switch (true) {
		case query.toLowerCase() === 'latest':
			filter = 'latest';
			break;
		case query.toLowerCase() === 'verified':
			filter.$and.unshift({ verified: true });
			break;
		case query !== '':
			filter.$and.unshift({
				$or: [
					{ name: { $regex: query, $options: 'i' } },
					{ resort: { $regex: query, $options: 'i' } },
					{ level: { $regex: query, $options: 'i' } },
					{ size: { $regex: query, $options: 'i' } },
				],
			});
			break;
		default:
			break;
	}

	return (async () => {
		let results;

		if (filter === 'latest')
			results = await Park.find().sort({ created: -1 }).lean();
		else results = await Park.find(filter).lean();

		if (!results.length) throw new NotFoundError(`No results for ${query}`);

		const sanitizedResults = results.map(result => {
			result = sanitize(result);

			result.name = result.name.charAt(0).toUpperCase() + result.name.slice(1);
			result.resort =
				result.resort.charAt(0).toUpperCase() + result.resort.slice(1);

			const { id, name, resort, size, verified, rating } = result;

			return { id, name, resort, size, verified, rating };
		});

		return sanitizedResults;
	})();
};
