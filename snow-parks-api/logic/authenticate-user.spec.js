require('dotenv').config();

const {
	env: { TEST_MONGODB_URL },
} = process;
const {
	mongoose,
	models: { User },
} = require('snow-parks-data');
const { NotAllowedError } = require('snow-parks-errors');
const { expect } = require('chai');
const { random } = Math;
const authenticateUser = require('./authenticate-user');
const bcrypt = require('bcryptjs');

describe('authenticateUser', () => {
	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await User.deleteMany();
	});

	let name, surname, email, password;

	beforeEach(() => {
		name = `name-${random()}`;
		surname = `surname-${random()}`;
		email = `email-${random()}@mail.com`;
		password = `password-${random()}`;
	});

	describe('when user already exists', () => {
		let userId;

		beforeEach(async () => {
			const _password = await bcrypt.hash(password, 10);

			const { id } = await User.create(
				new User({ name, surname, email, password: _password })
			);

			userId = id;
		});

		it('should succeed on valid credentials, returning user id', async () => {
			const id = await authenticateUser(email, password);

			expect(id).to.be.a('string');
			expect(id.length).to.be.greaterThan(0);
			expect(id).to.equal(userId);
		});

		it('should fail on incorrect email', async () => {
			email = `wrong${email}`;

			try {
				await authenticateUser(email, password);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotAllowedError);
				expect(error.message).to.equal('wrong credentials');
			}
		});

		it('should fail on incorecnt password', async () => {
			password = `wrong${email}`;

			try {
				await authenticateUser(email, password);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotAllowedError);
				expect(error.message).to.equal('wrong credentials');
			}
		});
	});

	it('should fail on non-string or empty password', () => {
		password = 1;
		expect(() => authenticateUser(email, password)).to.throw(
			TypeError,
			`password ${password} is not a string`
		);

		password = true;
		expect(() => authenticateUser(email, password)).to.throw(
			TypeError,
			`password ${password} is not a string`
		);

		password = {};
		expect(() => authenticateUser(email, password)).to.throw(
			TypeError,
			`password ${password} is not a string`
		);

		password = '';
		expect(() => authenticateUser(email, password)).to.throw(
			Error,
			`password is empty`
		);
	});

	it('should fail on non-string or empty email', () => {
		email = 1;
		expect(() => authenticateUser(email, password)).to.throw(
			TypeError,
			`email ${email} is not a string`
		);

		email = true;
		expect(() => authenticateUser(email, password)).to.throw(
			TypeError,
			`email ${email} is not a string`
		);

		email = {};
		expect(() => authenticateUser(email, password)).to.throw(
			TypeError,
			`email ${email} is not a string`
		);

		email = '';
		expect(() => authenticateUser(email, password)).to.throw(
			Error,
			`email is empty`
		);
	});

	after(async () => {
		await User.deleteMany();
		await mongoose.disconnect();
	});
});
