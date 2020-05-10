require('dotenv').config();

const {
	env: { TEST_MONGODB_URL },
} = process;
const { NotFoundError, NotAllowedError } = require('snow-parks-errors');
const {
	mongoose,
	models: { User, Park, Location },
} = require('snow-parks-data');
const { expect } = require('chai');
const { random, floor } = Math;
const reportPark = require('./report-park');

describe('reportPark', () => {
	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await [User.deleteMany(), Park.deleteMany()];
	});

	let name, surname, email, password;
	let parkName, size, level, location;
	let problem;
	let validOptions = ['unreal', 'duplicate'];

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
		});

		it('should succeed on reporting the problem', async () => {
			const underReview = await reportPark(parkId, problem, userId);
			const park = await Park.findOne({ _id: parkId }).lean();

			expect(park.reports[0].user.toString()).to.equal(userId);
			expect(park.reports[0].problem).to.equal(problem);
			expect(typeof underReview).to.equal('boolean');
		});

		it('should add the parkId to the contributions of the user', async () => {
			await reportPark(parkId, problem, userId);

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
				parkId = park.id;

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
				const underReview = await reportPark(parkId, problem, userId);
				const _park = await Park.findById(parkId).lean();

				expect(_park.underReview).to.equal(true);
				expect(_park.underReview).to.equal(underReview);
			});
		});

		describe('when user already reported the problem', () => {
			it('should fail and throw', async () => {
				await reportPark(parkId, problem, userId);

				try {
					await reportPark(parkId, problem, userId);
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.instanceOf(NotAllowedError);
					expect(error.message).to.equal(
						`user ${userId} alredy filed this report`
					);
				}
			});
		});
	});

	describe('when park does not exist', () => {
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

			await Park.deleteOne({ _id });
		});

		it('should fail and throw', async () => {
			try {
				await reportPark(parkId, problem, userId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.equal(`park with id ${parkId} does not exist`);
			}
		});
	});

	describe('when user does not exist', () => {
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

			await User.deleteOne({ _id: id });
		});

		it('should fail and throw', async () => {
			try {
				await reportPark(parkId, problem, userId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.equal(`user with id ${userId} does not exist`);
			}
		});
	});

	describe('synchronous unhappy paths', () => {
		let parkId, userId;

		beforeEach(() => {
			parkId = `park-${random()}`;
			userId = `user-${random()}`;
			problem = `problem-${random()}`;
		});

		it('should fail on non-string or empty user id', () => {
			userId = 1;
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				TypeError,
				`user id ${userId} is not a string`
			);

			userId = true;
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				TypeError,
				`user id ${userId} is not a string`
			);

			userId = {};
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				TypeError,
				`user id ${userId} is not a string`
			);

			userId = '';
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				Error,
				`user id is empty`
			);
		});

		it('should fail on non-string or empty park id', () => {
			parkId = 1;
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				TypeError,
				`park id ${parkId} is not a string`
			);

			parkId = true;
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				TypeError,
				`park id ${parkId} is not a string`
			);

			parkId = {};
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				TypeError,
				`park id ${parkId} is not a string`
			);

			parkId = '';
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				Error,
				`park id is empty`
			);
		});

		it('should fail on non-string or empty problem', () => {
			problem = 1;
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				TypeError,
				`problem ${problem} is not a string`
			);

			problem = true;
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				TypeError,
				`problem ${problem} is not a string`
			);

			problem = {};
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				TypeError,
				`problem ${problem} is not a string`
			);

			problem = '';
			expect(() => reportPark(parkId, problem, userId)).to.throw(
				Error,
				`problem is empty`
			);
		});
	});

	after(async () => {
		await [User.deleteMany(), Park.deleteMany()];
		await mongoose.disconnect();
	});
});
