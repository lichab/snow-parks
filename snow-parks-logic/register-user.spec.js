const logic = require('.');
const { registerUser } = logic;
const {
	mongoose,
	models: { User },
} = require('snow-parks-data');
const { ContentError } = require('snow-parks-errors');
const { random } = Math;
const { expect } = require('chai');
const bcrypt = require('bcryptjs');
const { TEST_MONGODB_URL: MONGODB_URL, TEST_API_URL: API_URL } = process.env;

logic.__context__.API_URL = API_URL;

describe('registerUser', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
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

	it('should succeed on new user', async () => {
		const response = await registerUser(name, surname, email, password);

		const user = await User.findOne({ email });

		const validPassowrd = bcrypt.compare(password, user.password);

		expect(response).to.be.undefined;
		expect(validPassowrd).to.be.ok;

		expect(user).to.exist;
		expect(typeof user.id).to.equal('string');
		expect(user.name).to.equal(name);
		expect(user.surname).to.equal(surname);
		expect(user.email).to.equal(email);
		expect(user.created).to.be.an.instanceOf(Date);
	});

	describe('when user already exists', () => {
		beforeEach(async () => {
			await User.create({ name, surname, email, password });
		});

		it('should fail on already existing user', async () => {
			try {
				await registerUser(name, surname, email, password);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.exist;
				expect(error.message).to.equal(`user ${email} already exists`);
			}
		});
	});

	it('should fail on non-string password', () => {
		password = 1;
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			TypeError,
			`password ${password} is not a string`
		);

		password = undefined;
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			ContentError,
			`password is empty`
		);

		password = true;
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			TypeError,
			`password ${password} is not a string`
		);
	});

	it('should fail on non-string name', () => {
		name = 1;
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			TypeError,
			`name ${name} is not a string`
		);

		name = undefined;
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			ContentError,
			`name is empty`
		);

		name = true;
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			TypeError,
			`name ${name} is not a string`
		);
	});

	it('should fail on non-string surname', () => {
		surname = 1;
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			TypeError,
			`surname ${surname} is not a string`
		);

		surname = undefined;
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			ContentError,
			`surname is empty`
		);

		surname = true;
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			TypeError,
			`surname ${surname} is not a string`
		);
	});

	it('should fail on non-email email', () => {
		email = 1;
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			TypeError,
			`email ${email} is not a string`
		);

		email = undefined;
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			ContentError,
			`email is empty`
		);

		email = 'email';
		expect(() => registerUser(name, surname, email, password)).to.Throw(
			ContentError,
			`${email} is not an e-mail`
		);
	});

	after(async () => {
		await await User.deleteMany();
		return await mongoose.disconnect();
	});
});
