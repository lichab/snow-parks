require('dotenv').config();
const logic = require('.');
const { retrieveUser } = logic;
const { expect } = require('chai');
const { NotFoundError } = require('snow-parks-errors');
const AsyncStorage = require('not-async-storage');
const {
	mongoose,
	models: { User },
} = require('snow-parks-data');
const jwt = require('jsonwebtoken');
const { random } = Math;
const {
	TEST_JWT_SECRET: JWT_SECRET,
	TEST_MONGODB_URL: MONGODB_URL,
	TEST_API_URL: API_URL,
} = process.env;

logic.__context__.storage = AsyncStorage;
logic.__context__.API_URL = API_URL;

describe('retrieveUser', () => {
	let name, surname, email, password, userId;

	before(async () => {
		await mongoose.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		await logic.__context__.storage.clear();
		return await Promise.resolve(User.deleteMany());
	});

	beforeEach(() => {
		name = 'name-' + random();
		surname = 'surname-' + random();
		email = random() + '@mail.com';
		password = 'password-' + random();
	});

	describe('when user exists', () => {
		beforeEach(async () => {
			const user = await User.create({ name, surname, email, password });
			userId = user.id;

			const _token = jwt.sign({ sub: user.id }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);
		});

		it('should succeed on valid id, returning the user', async () => {
			const user = await retrieveUser();

			expect(user.constructor).to.equal(Object);
			expect(user.name).to.equal(name);
			expect(user.surname).to.equal(surname);
			expect(user.email).to.equal(email);
			expect(user.password).to.be.undefined;
		});

		afterEach(async () => {
			await User.deleteMany();
		});
	});

	describe('when user does not exist', () => {
		it('should fail and throw', async () => {
			try {
				await retrieveUser(true);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.an.instanceOf(NotFoundError);
				expect(error.message).to.equal(`user with id ${userId} does not exist`);
			}
		});
	});

	after(async () => {
		await User.deleteMany();
		await logic.__context__.storage.clear();
		return await mongoose.disconnect();
	});
});
