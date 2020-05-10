const {
	models: { Park },
} = require('snow-parks-data');
const { validate } = require('snow-parks-utils');
const { NotFoundError } = require('snow-parks-errors');

module.exports = parkId => {
	validate.string(parkId, 'parkId');

	return (async () => {
		const park = await Park.findById(parkId).lean();
		if (!park) throw new NotFoundError(`park ${parkId} does not exist`);

		park.id = park._id.toString();

		const { name, id, resort, size, location } = park;

		return { name, id, resort, size, location };
	})();
};
