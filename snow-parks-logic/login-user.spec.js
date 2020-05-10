const logic = require('.');
const { loginUser } = logic;
const { random } = Math;
const { expect } = require('chai');
const {
	mongoose,
	models: { User },
} = require('snow-parks-data');
const bcrypt = require('bcryptjs');
const { ContentError, NotAllowedError } = require('snow-parks-errors');
const AsyncStorage = require('not-async-storage');
const { TEST_MONGODB_URL: MONGODB_URL, TEST_API_URL: API_URL } = process.env;

logic.__context__.storage = AsyncStorage;
logic.__context__.API_URL = API_URL;

describe('loginUser', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await Promise.resolve(User.deleteMany());
	});

	let name, surname, email, password;

	beforeEach(() => {
		name = `name-${random()}`;
		surname = `surname-${random()}`;
		email = `${random()}@mail.com`;
		password = `password-${random()}`;
	});

	describe('when user already exists', () => {
		beforeEach(async () => {
			const _password = await bcrypt.hash(password, 10);

			await User.create(
				new User({ name, surname, email, password: _password })
			);
		});

		it('should succeed on correct credentials', async () => {
			const returnValue = await loginUser(email, password);

			const token = await logic.__context__.storage.getItem('token');

			const [header, payload, signature] = token.split('.');

			expect(returnValue).to.be.undefined;
			expect(header.length).to.be.greaterThan(0);
			expect(payload.length).to.be.greaterThan(0);
			expect(signature.length).to.be.greaterThan(0);
		});

		it('should fail on incorrect password', async () => {
			password = `${password}-wrong`;
			try {
				await loginUser(email, password);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotAllowedError);
				expect(error.message).to.equal('wrong credentials');
			}
		});

		it('should fail on incorrect email', async () => {
			email = `wrong-${email}`;
			try {
				await loginUser(email, password);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotAllowedError);
				expect(error.message).to.equal('wrong credentials');
			}
		});
	});

	it('should fail on non-string password', () => {
		password = 1;
		expect(() => loginUser(email, password)).to.Throw(
			TypeError,
			`password ${password} is not a string`
		);

		password = undefined;
		expect(() => loginUser(email, password)).to.Throw(
			ContentError,
			`password is empty`
		);

		password = true;
		expect(() => loginUser(email, password)).to.Throw(
			TypeError,
			`password ${password} is not a string`
		);
	});

	it('should fail on non-email email', () => {
		email = 1;
		expect(() => loginUser(email, password)).to.Throw(
			TypeError,
			`email ${email} is not a string`
		);

		email = undefined;
		expect(() => loginUser(email, password)).to.Throw(
			ContentError,
			`email is empty`
		);

		email = 'email';
		expect(() => loginUser(email, password)).to.Throw(
			ContentError,
			`${email} is not an e-mail`
		);
	});

	after(async () => {
		await User.deleteMany();
		return await mongoose.disconnect();
	});
});
