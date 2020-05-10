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
const { reportPark } = logic;
const { expect } = require('chai');
const { random, floor } = Math;
const AsyncStorage = require('not-async-storage');
const {
	TEST_JWT_SECRET: JWT_SECRET,
	TEST_MONGODB_URL: MONGODB_URL,
	TEST_API_URL: API_URL,
} = process.env;
const jwt = require('jsonwebtoken');

logic.__context__.storage = AsyncStorage;
logic.__context__.API_URL = API_URL;

describe('reportPark', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await [User.deleteMany(), Park.deleteMany()];
	});

	let name, surname, email, password;
	let parkName, size, level, location;
	let validOptions = ['unreal', 'duplicate'];
	let problem;

	beforeEach(() => {
		problem = validOptions[floor(random() * 2)];

		name = `name-${random()}`;
		surname = `surname-${random()}`;
		email = `email-${random()}`;
		password = `password-${random()}`;

		parkName = `parkName-${random()}`;
		size = `l`;
		level = `begginer`;
		location = new Location({
			coordinates: [random() * 15 + 1, random() * 15 + 1],
		});
	});

	describe('when user and park ids are valid and exist', () => {
		let parkId, userId;

		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });
			userId = id;

			const { id: _id } = await Park.create({
				name: parkName,
				size,
				level,
				location,
			});
			parkId = _id;

			const _token = jwt.sign({ sub: id }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);
		});

		it('should succeed on reporting the problem', async () => {
			await reportPark(userId, parkId, problem);

			const park = await Park.findOne({ _id: parkId }).lean();

			expect(park.reports[0].user.toString()).to.equal(userId);
			expect(park.reports[0].problem).to.equal(problem);
			expect(typeof park.underReview).to.equal('boolean');
		});

		it('should add the parkId to the contributions of the user', async () => {
			await reportPark(userId, parkId, problem);

			const user = await User.findOne({ _id: userId }).lean();

			expect(user.contributions[0].toString()).to.equal(parkId);
		});

		describe('when reports duplicate or unreal reach 5', () => {
			beforeEach(async () => {
				const park = await Park.create({
					name: parkName,
					size,
					level,
					location,
				});
				parkId = park._id.toString();

				for (let i = 1; i < 5; i++) {
					const { id } = await User.create({ name, surname, email, password });

					const report = {
						user: id,
						problem: 'duplicate',
					};
					const report2 = {
						user: id,
						problem: 'unreal',
					};
					park.reports.push(report);
					park.reports.push(report2);
					await park.save();
				}
			});

			it('should set the park under review', async () => {
				await reportPark(userId, parkId, problem);
				const _park = await Park.findById(parkId).lean();

				expect(_park.underReview).to.equal(true);
			});
		});

		describe('when user already reported the problem', () => {
			it('should fail and throw', async () => {
				await reportPark(userId, parkId, problem);

				try {
					await reportPark(userId, parkId, problem);
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.instanceOf(NotAllowedError);
					expect(error.message).to.equal(`You already filed this report`);
				}
			});
		});
	});

	describe('synchronous unahappy paths', () => {
		let userId, parkId, problem;

		beforeEach(() => {
			problem = validOptions[floor(random() * 2)];
			userId = `user${random()}`;
			parkId = `park${random()}`;
		});

		it('should fail on non-string userId', () => {
			userId = 1;
			expect(() => reportPark(userId, parkId, problem)).to.Throw(
				TypeError,
				`userId ${userId} is not a string`
			);

			userId = undefined;
			expect(() => reportPark(userId, parkId, problem)).to.Throw(
				ContentError,
				`userId is empty`
			);

			userId = true;
			expect(() => reportPark(userId, parkId, problem)).to.Throw(
				TypeError,
				`userId ${userId} is not a string`
			);
		});

		it('should fail on non-string parkId', () => {
			parkId = 1;
			expect(() => reportPark(userId, parkId, problem)).to.Throw(
				TypeError,
				`parkId ${parkId} is not a string`
			);

			parkId = undefined;
			expect(() => reportPark(userId, parkId, problem)).to.Throw(
				ContentError,
				`parkId is empty`
			);

			parkId = true;
			expect(() => reportPark(userId, parkId, problem)).to.Throw(
				TypeError,
				`parkId ${parkId} is not a string`
			);
		});

		it('should fail on non-string problem', () => {
			problem = 1;
			expect(() => reportPark(userId, parkId, problem)).to.Throw(
				TypeError,
				`problem ${problem} is not a string`
			);

			problem = undefined;
			expect(() => reportPark(userId, parkId, problem)).to.Throw(
				ContentError,
				`problem is empty`
			);

			problem = true;
			expect(() => reportPark(userId, parkId, problem)).to.Throw(
				TypeError,
				`problem ${problem} is not a string`
			);
		});
	});

	after(async () => {
		await [User.deleteMany(), Park.deleteMany()];
		await mongoose.disconnect();
	});
});
