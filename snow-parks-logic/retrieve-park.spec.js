require('dotenv').config();

const logic = require('.');
const { retrievePark } = logic;
const AsyncStorage = require('not-async-storage');
const { TEST_MONGODB_URL: MONGODB_URL, TEST_API_URL: API_URL } = process.env;
const {
	mongoose,
	models: { Park, User, Feature, Location },
} = require('snow-parks-data');
const { expect } = require('chai');
const { NotFoundError, ContentError } = require('snow-parks-errors');

const { random } = Math;

logic.__context__.storage = AsyncStorage;
logic.__context__.API_URL = API_URL;

describe('retrievePark', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await [Park.deleteMany(), User.deleteMany()];
	});

	let parkName, size, level, location;
	let name, surname, email, password;
	let feature = {};

	beforeEach(() => {
		feature.name = 'other';
		feature.size = 'xl';
		feature.level = 'advanced';
		feature.location = new Location({
			coordinates: [random() * 15 + 1, random() * 15 + 1],
		});

		name = `name-${random()}`;
		surname = `surname-${random()}`;
		email = `email-${random()}`;
		password = `password-${random()}`;

		parkName = `parkName-${random()}`;
		size = `l`;
		description = `${random()}`;
		resort = `${random()}`;
		level = `begginer`;
		location = new Location({
			coordinates: [random() * 15 + 1, random() * 15 + 1],
		});
	});

	describe('when park exists', () => {
		let userId, parkId;

		beforeEach(async () => {
			const feat = new Feature(feature);

			const { id } = await User.create({ name, surname, email, password });
			userId = id;

			const park = await Park.create({
				name: parkName,
				size,
				level,
				resort,
				description,
				location,
				creator: id,
				features: [feat],
			});
			parkId = park.id;
		});

		it('should succeed on retrieving the park', async () => {
			const result = await retrievePark(parkId);

			expect(result.name).to.equal(parkName);
			expect(result.id).to.equal(parkId);
			expect(result.resort).to.equal(resort);
			expect(result.description).to.equal(description);

			expect(result.features[0].name).to.equal(feature.name);
			expect(result.features[0].size).to.equal(feature.size);

			expect(result.creator.name).to.equal(name);
			expect(result.creator.id).to.equal(userId);
		});
	});
	describe('when park does not exist', () => {
		let parkId;
		beforeEach(async () => {
			const { id } = await Park.create({
				name: parkName,
				size,
				level,
				resort,
				description,
				location,
			});
			parkId = id;

			await Park.deleteOne({ _id: parkId });
			return;
		});

		it('should fail and throw', async () => {
			try {
				await retrievePark(parkId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.equal(
					`the park you are looking for does not exist or has been deleted`
				);
			}
		});
	});

	it('should fail on non string id', () => {
		let parkId = 1;
		expect(() => {
			retrievePark(parkId);
		}).to.Throw(TypeError, `parkId ${parkId} is not a string`);

		parkId = undefined;
		expect(() => {
			retrievePark(parkId);
		}).to.Throw(ContentError, `parkId is empty`);

		parkId = true;
		expect(() => {
			retrievePark(parkId);
		}).to.Throw(TypeError, `parkId ${parkId} is not a string`);
	});

	after(() =>
		Promise.all([Park.deleteMany(), User.deleteMany()]).then(() =>
			mongoose.disconnect()
		)
	);
});
