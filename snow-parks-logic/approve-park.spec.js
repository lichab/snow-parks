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
const { approvePark } = logic;
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

describe('approvePark', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await [Park.deleteMany(), User.deleteMany()];
	});

	let parkName, size, level, location;
	let name, surname, email, password;

	beforeEach(() => {
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

	describe('when user and park exist', () => {
		let userId, parkId;

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

		describe('when park has less than 4 approvals', () => {
			it('should succeed on incrementing approvals by 1', async () => {
				await approvePark(userId, parkId);

				const park = await Park.findById(parkId);

				expect(park.approvals.length).to.equal(1);
				expect(park.approvals[0].toString()).to.equal(userId);
			});

			it('should fail when user already gave approval', async () => {
				await approvePark(userId, parkId);

				try {
					await approvePark(userId, parkId);
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.instanceOf(NotAllowedError);
					expect(error.message).to.equal('You already approved this park');
				}
			});
		});

		describe('when park already has 4 approvals', () => {
			beforeEach(async () => {
				const park = await Park.findById(parkId);

				for (let i = 1; i < 5; i++) {
					const { id } = await User.create({ name, surname, email, password });

					park.approvals.push(id);

					await park.save();
				}
			});

			it('should succeed on verifying the park', async () => {
				await approvePark(userId, parkId);

				const _park = await Park.findById(parkId).lean();

				expect(_park.verified).to.be.true;
			});
		});
	});

	describe('when park does not exist', () => {
		let userId;
		let parkId;
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

			await Park.deleteOne({ _id });
		});

		it('should fail and throw', async () => {
			try {
				await approvePark(userId, parkId);
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
		let userId;
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

			const _token = jwt.sign({ sub: userId }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);

			await User.deleteOne({ _id: id });
		});

		it('should fail and throw', async () => {
			try {
				await approvePark(userId, parkId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.be.equal(
					`user with id ${userId} does not exist`
				);
			}
		});
	});

	describe('synchronous unhappy paths', () => {
		beforeEach(() => {
			userId = `user-${random()}`;
			parkId = `park-${random()}`;
		});

		it('should fail on non-string userId', () => {
			userId = 1;
			expect(() => approvePark(userId, parkId)).to.Throw(
				TypeError,
				`userId ${userId} is not a string`
			);

			userId = undefined;
			expect(() => approvePark(userId, parkId)).to.Throw(
				ContentError,
				`userId is empty`
			);

			userId = true;
			expect(() => approvePark(userId, parkId)).to.Throw(
				TypeError,
				`userId ${userId} is not a string`
			);
		});

		it('should fail on non-string parkId', () => {
			parkId = 1;
			expect(() => approvePark(userId, parkId)).to.Throw(
				TypeError,
				`parkId ${parkId} is not a string`
			);

			parkId = undefined;
			expect(() => approvePark(userId, parkId)).to.Throw(
				ContentError,
				`parkId is empty`
			);

			parkId = true;
			expect(() => approvePark(userId, parkId)).to.Throw(
				TypeError,
				`parkId ${parkId} is not a string`
			);
		});
	});

	after(async () => {
		await [User.deleteMany(), Park.deleteMany()];
		return await mongoose.disconnect();
	});
});
