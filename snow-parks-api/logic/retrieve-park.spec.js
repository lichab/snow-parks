require('dotenv').config();

const {
	env: { TEST_MONGODB_URL },
} = process;
const {
	mongoose,
	models: { Park, User, Feature, Location },
} = require('snow-parks-data');
const { NotFoundError } = require('snow-parks-errors');
const { expect } = require('chai');
const { random } = Math;
const retrievePark = require('./retrieve-park');

describe('retrievePark', () => {
	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
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
			const park = await Park.create({
				name: parkName,
				size,
				level,
				resort,
				description,
				location,
			});
			parkId = park.id;

			return await Park.deleteOne({ _id: parkId });
		});

		it('should fail on wrong id', async () => {
			try {
				await retrievePark(parkId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.an.instanceOf(NotFoundError);
				expect(error.message).to.equal(`park ${parkId} does not exist`);
			}
		});

		it('should fail on non string id', () => {
			let parkId = 1;
			expect(() => {
				retrievePark(parkId);
			}).to.throw(TypeError, `park id ${parkId} is not a string`);

			parkId = undefined;
			expect(() => {
				retrievePark(parkId);
			}).to.throw(TypeError, `park id ${parkId} is not a string`);

			parkId = true;
			expect(() => {
				retrievePark(parkId);
			}).to.throw(TypeError, `park id ${parkId} is not a string`);
		});
	});

	after(async () => {
		await [User.deleteMany(), Park.deleteMany()];
		await mongoose.disconnect();
	});
});
