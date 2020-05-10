require('dotenv').config();

const {
	mongoose,
	models: { Park, User, Location, Feature },
} = require('snow-parks-data');
const { NotFoundError, NotAllowedError } = require('snow-parks-errors');
const logic = require('.');
const { updatePark } = logic;
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

describe('updatePark', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await [Park.deleteMany(), User.deleteMany()];
	});

	let parkName, size, level, location;
	let name, surname, email, password;
	let feature;

	beforeEach(() => {
		feature = {
			name: `rail`,
			size: `l`,
			location: {
				coordinates: [random() * 15 + 1, random() * 15 + 1],
			},
		};

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

			const _token = jwt.sign({ sub: id }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);
		});

		describe('when user is the creator', () => {
			let newName, newSize, newLevel, newLocation;
			beforeEach(async () => {
				const { id: _id } = await Park.create({
					name: parkName,
					size,
					level,
					location,
					creator: userId,
				});
				parkId = _id;

				newName = 'newName';
				newSize = 'xl';
				newLevel = 'advanced';
				newLocation = new Location({
					coordinates: [random() * 15 + 1, random() * 15 + 1],
				});
				features = [feature];
			});

			it('should succeed on valid fields', async () => {
				await updatePark(userId, parkId, {
					name: newName,
					location: newLocation,
					size: newSize,
					level: newLevel,
					features,
				});

				const park = await Park.findById(parkId).lean();

				expect(park.name).to.equal(newName);
				expect(park.size).to.equal(newSize);
				expect(park.level).to.equal(newLevel);
				expect(park.location.coordinates).to.deep.equal(
					newLocation.coordinates
				);

				expect(park.features[0].location.coordinates).to.deep.equal(
					feature.location.coordinates
				);
				expect(park.features[0].name).to.equal(feature.name);
				expect(park.features[0].size).to.equal(feature.size);
			});

			it('should fail on invalid field', async () => {
				let invalid = 'invalid';
				try {
					await updatePark(userId, parkId, {
						invalid,
						name: newName,
						location: newLocation,
						size: newSize,
						level: newLevel,
					});
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.instanceOf(NotAllowedError);
					expect(error.message).to.equal(`field ${invalid} is not a valid`);
				}
			});
		});

		describe('when user did not create the park', () => {
			let update = {};
			let invalidUser;
			beforeEach(async () => {
				const { id: _id } = await Park.create({
					name: parkName,
					size,
					level,
					location,
					creator: userId,
				});
				parkId = _id;
				const { id } = await User.create({ name, surname, email, password });
				invalidUser = id;
			});

			it('should fail and throw', async () => {
				try {
					await updatePark(invalidUser, parkId, update);
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.instanceOf(NotAllowedError);
					expect(error.message).to.equal(
						`user ${invalidUser} did not create this park`
					);
				}
			});
		});
	});

	describe('when park or user do not exist', () => {
		let userId, parkId;
		let update = {};

		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });
			userId = id;

			const { id: _id } = await Park.create({
				name: parkName,
				size,
				level,
				location,
				creator: userId,
			});
			parkId = _id;

			const _token = jwt.sign({ sub: id }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);
		});

		it('should fail and throw on non existing park', async () => {
			await Park.deleteOne({ _id: parkId });

			try {
				await updatePark(userId, parkId, update);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.equal(`park ${parkId} does not exist`);
			}
		});
	});

	it('should fail on non string user id', () => {
		let userId = 1;
		let parkId = 'string';
		let update = {};
		expect(() => {
			updatePark(userId, parkId, update);
		}).to.throw(TypeError, `userId ${userId} is not a string`);

		userId = undefined;
		expect(() => {
			updatePark(userId, parkId, update);
		}).to.throw(TypeError, `userId ${userId} is not a string`);

		userId = true;
		expect(() => {
			updatePark(userId, parkId, update);
		}).to.throw(TypeError, `userId ${userId} is not a string`);
	});

	it('should fail on non string parkId id', () => {
		let userId = 'string';
		let parkId = 1;
		let update = {};
		expect(() => {
			updatePark(userId, parkId, update);
		}).to.throw(TypeError, `parkId ${parkId} is not a string`);

		parkId = undefined;
		expect(() => {
			updatePark(userId, parkId, update);
		}).to.throw(TypeError, `parkId ${parkId} is not a string`);

		parkId = true;
		expect(() => {
			updatePark(userId, parkId, update);
		}).to.throw(TypeError, `parkId ${parkId} is not a string`);
	});

	after(() =>
		Promise.all([User.deleteMany(), Park.deleteMany()]).then(() =>
			mongoose.disconnect()
		)
	);
});
