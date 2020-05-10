const { validate } = require('snow-parks-utils');
const {
	models: { Park, User },
} = require('snow-parks-data');
const { NotAllowedError, NotFoundError } = require('snow-parks-errors');

/**
 * Registers a user's report for a fake or duplicate park. If requirements are met,
 * it will place the park's underReview property to true
 *
 * @param {string} parkId the park unique id
 * @param {string} problem the reported problem, can be wither 'unreal' or 'duplicate'
 * @param {string} userId the user's unique id
 *
 * @returns {Promise<Boolean>} underReview property of the park
 *
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if user id, park id or problem do not have the correct type
 * @throws {NotFoundError} when the provided id's don't match any document on the DB
 * @throws {NotAllowedError} when the park has already been verified
 * @throws {NotAllowedError} when the user provided already filed the report
 *
 */

module.exports = (parkId, problem, userId) => {
	validate.string(userId, 'user id');
	validate.string(parkId, 'park id');
	validate.string(problem, 'problem');

	return (async () => {
		const user = await User.findById(userId);

		if (!user) throw new NotFoundError(`user with id ${userId} does not exist`);

		const park = await Park.findById(parkId);

		if (!park) throw new NotFoundError(`park with id ${parkId} does not exist`);

		if (park.verified)
			throw new NotAllowedError(`park ${parkId} has already been verified`);

		park.reports.forEach(_report => {
			if (_report.user._id.toString() === userId && _report.problem === problem)
				throw new NotAllowedError(`user ${userId} alredy filed this report`);
		});

		let duplicate = 0;
		let unreal = 0;

		const report = {
			user: userId,
			problem,
		};

		park.reports.push(report);
		user.contributions.push(parkId);

		if (report.problem === 'duplicate') duplicate++;
		if (report.problem === 'unreal') unreal++;

		park.reports.forEach(_report => {
			if (_report.problem === 'duplicate') duplicate++;
			if (_report.problem === 'unreal') unreal++;

			if (duplicate === 5 || unreal === 5) park.underReview = true;
		});

		await user.save();
		await park.save();

		return park.underReview;
	})();
};
