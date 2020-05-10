require('dotenv').config();

const logic = require('.');
const { deletePark } = logic;
const {
	TEST_JWT_SECRET: JWT_SECRET,
	TEST_MONGODB_URL: MONGODB_URL,
	TEST_API_URL: API_URL,
} = process.env;
const jwt = require('jsonwebtoken');
const { NotFoundError, NotAllowedError } = require('snow-parks-errors');
const {
	mongoose,
	models: { User, Park, Location },
} = require('snow-parks-data');
const AsyncStorage = require('not-async-storage');
const { expect } = require('chai');
const { random } = Math;

logic.__context__.storage = AsyncStorage;
logic.__context__.API_URL = API_URL;

describe('deletePark', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await [User.deleteMany(), Park.deleteMany()];
	});

	let name, surname, email, password;
	let parkName, size, level, location;
	let userId, parkId;

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

	describe('when user exists', () => {
		beforeEach(async () => {
			const { _id } = await User.create({ name, surname, email, password });
			userId = _id.toString();

			const { id } = await Park.create({
				name: parkName,
				size,
				level,
				location,
				creator: userId,
			});
			parkId = id;

			const _token = jwt.sign({ sub: userId }, JWT_SECRET);

			await logic.__context__.storage.setItem('token', _token);
		});

		it('should succeed deleting the park from parks collection', async () => {
			await deletePark(userId, parkId);

			const park = await Park.findById(parkId);

			expect(park).to.equal(null);
		});

		it('should remove the park from the user parks', async () => {
			await deletePark(userId, parkId);

			const user = await User.findById(userId);

			const foundPark = user.parks.find(id => id === parkId);

			expect(foundPark).to.be.undefined;
		});

		describe('park does not exist', () => {
			beforeEach(async () => await Park.deleteOne({ _id: parkId }));

			it('should fail on non existing park and throw ', async () => {
				try {
					await deletePark(userId, parkId);
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.instanceOf(NotFoundError);
					expect(error.message).to.equal(`park ${parkId} does not exist`);
				}
			});
		});

		describe('when user is not park creator', () => {
			let _id;
			beforeEach(async () => {
				const { id } = await User.create({ name, surname, email, password });
				_id = id;

				const _token = jwt.sign({ sub: id }, JWT_SECRET);
				await logic.__context__.storage.setItem('token', _token);
			});

			it('should fail and throw', async () => {
				try {
					await deletePark(userId, parkId);
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.instanceOf(NotAllowedError);
					expect(error.message).to.equal(
						`user ${_id} did not create this park`
					);
				}
			});
		});
	});

	describe('user does not exist', () => {
		beforeEach(async () => {
			const { id } = await Park.create({
				name: parkName,
				size,
				level,
				location,
				creator: userId,
			});
			parkId = id;

			const _token = jwt.sign({ sub: userId }, JWT_SECRET);

			await logic.__context__.storage.setItem('token', _token);

			await User.deleteOne({ _id: userId });
		});

		it('should fail and throw ', async () => {
			try {
				await deletePark(userId, parkId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.equal(`user ${userId} does not exist`);
			}
		});
	});

	describe('sychronous unhappy paths', () => {
		beforeEach(() => {
			parkId = `park-${random()}`;
			userId = `user-${random()}`;
		});

		it('should fail on non-string or park id', () => {
			parkId = 1;
			expect(() => deletePark(userId, parkId)).to.throw(
				TypeError,
				`park id ${parkId} is not a string`
			);

			parkId = true;
			expect(() => deletePark(userId, parkId)).to.throw(
				TypeError,
				`park id ${parkId} is not a string`
			);

			parkId = {};
			expect(() => deletePark(userId, parkId)).to.throw(
				TypeError,
				`park id ${parkId} is not a string`
			);

			parkId = '';
			expect(() => deletePark(userId, parkId)).to.throw(
				Error,
				`park id is empty`
			);
		});

		it('should fail on non-string or user id', () => {
			userId = 1;
			expect(() => deletePark(userId, userId)).to.throw(
				TypeError,
				`user id ${userId} is not a string`
			);

			userId = true;
			expect(() => deletePark(userId, userId)).to.throw(
				TypeError,
				`user id ${userId} is not a string`
			);

			userId = {};
			expect(() => deletePark(userId, userId)).to.throw(
				TypeError,
				`user id ${userId} is not a string`
			);

			userId = '';
			expect(() => deletePark(userId, userId)).to.throw(
				Error,
				`user id is empty`
			);
		});
	});

	after(async () => {
		await [User.deleteMany(), Park.deleteMany()];
		return await mongoose.disconnect();
	});
});
