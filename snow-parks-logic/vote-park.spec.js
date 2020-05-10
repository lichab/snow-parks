require('dotenv').config();

const {
	NotFoundError,
	NotAllowedError,
	ContentError,
} = require('snow-parks-errors');
const {
	mongoose,
	models: { User, Park, Location },
} = require('snow-parks-data');
const logic = require('.');
const { votePark } = logic;
const { expect } = require('chai');
const { random } = Math;
const AsyncStorage = require('not-async-storage');
const {
	TEST_JWT_SECRET: JWT_SECRET,
	TEST_MONGODB_URL: MONGODB_URL,
	TEST_API_URL: API_URL,
} = process.env;
const jwt = require('jsonwebtoken');

logic.__context__.storage = AsyncStorage;
logic.__context__.API_URL = API_URL;

describe('votePark', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await [Park.deleteMany(), User.deleteMany()];
	});

	let parkName, size, level, location;
	let name, surname, email, password;
	let upVote, downVote;

	beforeEach(() => {
		name = `name-${random()}`;
		surname = `surname-${random()}`;
		email = `email-${random()}`;
		password = `password-${random()}`;

		upVote = true;
		downVote = false;

		parkName = `parkName-${random()}`;
		size = `l`;
		level = `begginer`;
		location = new Location({
			coordinates: [random() * 15 + 1, random() * 15 + 1],
		});
	});

	describe('when user and park exist', () => {
		let userId, parkId;

		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });
			userId = id;

			const _token = jwt.sign({ sub: id }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);
		});
		describe('when park has no votes from user', () => {
			beforeEach(async () => {
				const { id: _id } = await Park.create({
					name: parkName,
					size,
					level,
					location,
				});
				parkId = _id;
			});

			it('should succeed on upvoting', async () => {
				await votePark(userId, parkId, upVote);

				const park = await Park.findById(parkId);

				expect(park.rating).to.equal(1);
				expect(park.upVotes[0].toString()).to.equal(userId);
			});

			it('should succeed on downvoting', async () => {
				await votePark(userId, parkId, downVote);

				const park = await Park.findById(parkId);

				expect(park.rating).to.equal(-1);
				expect(park.downVotes[0].toString()).to.equal(userId);
			});

			it('should fail when user already upvoted', async () => {
				await votePark(userId, parkId, upVote);

				try {
					await votePark(userId, parkId, upVote);
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.instanceOf(NotAllowedError);
					expect(error.message).to.equal(
						`user with id ${userId} already upVoted`
					);
				}
			});

			it('should fail when user already downVoted', async () => {
				await votePark(userId, parkId, downVote);

				try {
					await votePark(userId, parkId, downVote);
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.instanceOf(NotAllowedError);
					expect(error.message).to.equal(
						`user with id ${userId} already downVoted`
					);
				}
			});
		});
	});

	describe('when park does not exist', () => {
		let userId;
		let parkId = 'asdfasdfasfd';
		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });
			userId = id;

			const _token = jwt.sign({ sub: id }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);
		});

		it('should fail and throw', async () => {
			try {
				await votePark(userId, parkId, upVote);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.be.equal(
					`park with id ${parkId} does not exist`
				);
			}
		});
	});

	describe('when user does not exist', () => {
		let parkId;
		let userId = 'asdfasdfasfd';
		beforeEach(async () => {
			const { id: _id } = await Park.create({
				name: parkName,
				size,
				level,
				location,
			});
			parkId = _id;

			const _token = jwt.sign({ sub: userId }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);
		});

		it('should fail and throw', async () => {
			try {
				await votePark(userId, parkId, upVote);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.be.equal(
					`user with id ${userId} does not exist`
				);
			}
		});
	});

	it('should fail on non-string userId', () => {
		userId = 1;
		parkId = 'string';
		expect(() => votePark(userId, parkId, upVote)).to.Throw(
			TypeError,
			`userId ${userId} is not a string`
		);

		userId = undefined;
		parkId = 'string';
		expect(() => votePark(userId, parkId, upVote)).to.Throw(
			ContentError,
			`userId is empty`
		);

		userId = true;
		parkId = 'string';
		expect(() => votePark(userId, parkId, upVote)).to.Throw(
			TypeError,
			`userId ${userId} is not a string`
		);
	});

	it('should fail on non-string parkId', () => {
		parkId = 1;
		userId = 'string';
		expect(() => votePark(userId, parkId, upVote)).to.Throw(
			TypeError,
			`parkId ${parkId} is not a string`
		);

		parkId = undefined;
		userId = 'string';
		expect(() => votePark(userId, parkId, upVote)).to.Throw(
			ContentError,
			`parkId is empty`
		);

		parkId = true;
		userId = 'string';
		expect(() => votePark(userId, parkId, upVote)).to.Throw(
			TypeError,
			`parkId ${parkId} is not a string`
		);
	});

	after(() =>
		Promise.all([User.deleteMany(), Park.deleteMany()]).then(() =>
			mongoose.disconnect()
		)
	);
});
