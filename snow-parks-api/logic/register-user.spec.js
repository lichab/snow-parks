require('dotenv').config();

const registerUser = require('./register-user');
const { expect } = require('chai');
const {
	env: { TEST_MONGODB_URL },
} = process;
const {
	mongoose,
	models: { User },
} = require('snow-parks-data');
const { NotAllowedError, ContentError } = require('snow-parks-errors');
const bcrypt = require('bcryptjs');

describe('registerUser', () => {
	let name, surname, email, password;

	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await User.deleteMany();
	});

	beforeEach(() => {
		name = `name-${Math.random()}`;
		surname = `surname-${Math.random()}`;
		email = `${Math.random()}@email.com`;
		password = `password-${Math.random()}`;
	});

	it('should succed no creating a new user, no return value expected', async () => {
		const returnValue = await registerUser({ name, surname, email, password });
		const user = await User.findOne({ email });
		const validPassword = await bcrypt.compare(password, user.password);

		expect(returnValue).to.be.undefined;
		expect(user.name).to.equal(name);
		expect(user.email).to.equal(email);
		expect(user.email).to.equal(email);
		expect(user.created).to.exist;
		expect(user._id).to.exist;
		expect(validPassword).to.be.true;
	});

	describe('when user already exists', () => {
		beforeEach(async () => {
			return await User.create({ name, surname, email, password });
		});

		it('should fail when user already exists', async () => {
			try {
				await registerUser({ name, surname, email, password });
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotAllowedError);
				expect(error.message).to.be.equal(`user ${email} already exists`);
			}
		});
	});

	it('should fail on non-string or empty name', () => {
		name = 1;
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`name ${name} is not a string`
		);

		name = true;
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`name ${name} is not a string`
		);

		name = {};
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`name ${name} is not a string`
		);

		name = '';
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			Error,
			`name is empty`
		);
	});

	it('should fail on non-string or empty surname', () => {
		surname = 1;
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`surname ${surname} is not a string`
		);

		surname = true;
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`surname ${surname} is not a string`
		);

		surname = {};
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`surname ${surname} is not a string`
		);

		surname = '';
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			Error,
			`surname is empty`
		);
	});

	it('should fail on non-string or empty email', () => {
		email = 1;
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`email ${email} is not a string`
		);

		email = true;
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`email ${email} is not a string`
		);

		email = {};
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`email ${email} is not a string`
		);

		email = '';
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			Error,
			`email is empty`
		);
	});

	it('should fail on wrong email format', () => {
		email = 'email';
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			ContentError,
			`${email} is not an e-mail`
		);

		email = 'email@email--';
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			ContentError,
			`${email} is not an e-mail`
		);
	});

	it('should fail on non-string or empty password', () => {
		password = 1;
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`password ${password} is not a string`
		);

		password = true;
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`password ${password} is not a string`
		);

		password = {};
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			TypeError,
			`password ${password} is not a string`
		);

		password = '';
		expect(() => registerUser({ name, surname, email, password })).to.throw(
			Error,
			`password is empty`
		);
	});

	after(() => User.deleteMany().then(() => mongoose.disconnect()));
});
