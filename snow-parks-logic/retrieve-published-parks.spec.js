require('dotenv').config();

const {
	mongoose,
	models: { Park, User, Location },
} = require('snow-parks-data');
const { ContentError } = require('snow-parks-errors');
const logic = require('.');
const { retrievePublishedParks } = logic;
const AsyncStorage = require('not-async-storage');
const { TEST_MONGODB_URL: MONGODB_URL, TEST_API_URL: API_URL } = process.env;
const JWT_SECRET = process.env.TEST_JWT_SECRET;
const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const { random } = Math;

logic.__context__.storage = AsyncStorage;
logic.__context__.API_URL = API_URL;

describe('retrievePublishedParks', () => {
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
		description = `${random()}`;
		resort = `${random()}`;
		level = `begginer`;
		location = new Location({
			coordinates: [random() * 15 + 1, random() * 15 + 1],
		});
	});

	describe('when user and park exist', () => {
		let parkId, userId;

		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });
			userId = id;

			const { id: pid } = await Park.create({
				name: parkName,
				size,
				level,
				resort,
				description,
				location,
				creator: id,
			});
			parkId = pid;

			const _token = jwt.sign({ sub: id }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);
		});

		it('should fail on invalid id in token', async () => {
			await logic.__context__.storage.clear();

			const _token = jwt.sign({ sub: ' ' }, JWT_SECRET);

			await logic.__context__.storage.setItem('token', _token);

			try {
				await retrievePublishedParks(userId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.an.instanceOf(ContentError);
				expect(error.message).to.equal('invalid user id in token');
			}
		});

		it('should succeed on correct credentials', async () => {
			const result = await retrievePublishedParks(userId);

			expect(result[0].name).to.equal(parkName);
			expect(result[0].id).to.equal(parkId);
			expect(result[0].resort).to.equal(resort);
			expect(result[0].size).to.equal(size);
			expect(result[0].verified).to.exist;
		});
	});

	describe('when user has no parks', () => {
		let userId;

		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });
			userId = id;

			const _token = jwt.sign({ sub: id }, JWT_SECRET);

			await logic.__context__.storage.setItem('token', _token);
		});

		it('should fail returning empty array', async () => {
			const result = await retrievePublishedParks(userId);

			expect(result).to.be.instanceOf(Array);
			expect(result.length).to.equal(0);
		});
	});

	after(() =>
		Promise.all([Park.deleteMany(), User.deleteMany()]).then(() =>
			mongoose.disconnect()
		)
	);
});
