require('dotenv').config();

const {
	env: { TEST_MONGODB_URL },
} = process;
const {
	mongoose,
	models: { Park, User, Location },
} = require('snow-parks-data');
const { NotFoundError } = require('snow-parks-errors');
const { expect } = require('chai');
const { random } = Math;
const retrievePublishedParks = require('./retrieve-published-parks');

describe('retrievePublishedParks', () => {
	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
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
		description = `${random()}`;
		resort = `${random()}`;
		level = `begginer`;
		location = new Location({
			coordinates: [random() * 15 + 1, random() * 15 + 1],
		});
	});

	describe('when user exists', () => {
		let userId, parkId;

		beforeEach(async () => {
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
			});
			parkId = park.id;
		});

		it('should succeed on correct credentials', async () => {
			const result = await retrievePublishedParks(userId);

			expect(result[0].name).to.equal(parkName);
			expect(result[0].id).to.equal(parkId);
			expect(result[0].resort).to.equal(resort);
			expect(result[0].size).to.equal(size);
			expect(result[0].verified).to.exist;
		});

		describe('when user has no parks', () => {
			let userId;

			beforeEach(async () => {
				const { id } = await User.create({ name, surname, email, password });

				userId = id;
			});

			it('should fail returning empty array', async () => {
				const result = await retrievePublishedParks(userId);

				expect(result).to.be.instanceOf(Array);
				expect(result.length).to.equal(0);
			});
		});
	});

	describe('when user does not exist', () => {
		let userId;

		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });
			userId = id;

			await User.deleteOne({ _id: id });
		});

		it('should fail and throw', async () => {
			try {
				await retrievePublishedParks(userId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.an.instanceOf(NotFoundError);
				expect(error.message).to.equal(`user with id ${userId} does not exist`);
			}
		});
	});

	it('should fail on non string id', () => {
		let userId = 1;

		expect(() => {
			retrievePublishedParks(userId);
		}).to.throw(TypeError, `user id ${userId} is not a string`);

		userId = undefined;

		expect(() => {
			retrievePublishedParks(userId);
		}).to.throw(TypeError, `user id ${userId} is not a string`);

		userId = true;

		expect(() => {
			retrievePublishedParks(userId);
		}).to.throw(TypeError, `user id ${userId} is not a string`);
	});

	after(async () => {
		await [User.deleteMany(), Park.deleteMany()];
		await mongoose.disconnect();
	});
});
