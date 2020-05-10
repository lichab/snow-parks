require('dotenv').config();

const updateUser = require('./update-user');
const {
	env: { TEST_MONGODB_URL },
} = process;
const {
	mongoose,
	models: { Park, User },
} = require('snow-parks-data');
const { NotFoundError, NotAllowedError } = require('snow-parks-errors');
const { expect } = require('chai');
const { random } = Math;
const bcrypt = require('bcryptjs');

describe('updateUser', () => {
	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await User.deleteMany();
	});

	let name, surname, email, password, userId, oldPassword;

	beforeEach(() => {
		name = 'name-' + random();
		surname = 'surname-' + random();
		email = random() + '@mail.com';
		password = 'password-' + random();
	});

	describe('when user already exists', () => {
		beforeEach(async () => {
			const _password = await bcrypt.hash(password, 10);

			const user = await User.create({
				name,
				surname,
				email,
				password: _password,
			});
			userId = user.id;
		});

		it('should succeed on valid id and credentials', async () => {
			name += '-update';
			email = 'update-@email.com';
			oldPassword = password;
			password += '-update';

			await updateUser(userId, { name, email, password, oldPassword });

			const _user = await User.findById(userId).lean();

			const validPassword = await bcrypt.compare(password, _user.password);

			expect(_user.name).to.equal(name);
			expect(_user.email).to.equal(email);
			expect(validPassword).to.be.true;
		});

		it('should fail on invalid oldPassword', async () => {
			name += '-update';
			email = 'update-@email.com';
			oldPassword = password + 'wrong';
			password += '-update';

			try {
				await updateUser(userId, { name, email, password, oldPassword });
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.an.instanceOf(NotAllowedError);
				expect(error.message).to.equal('wrong credentials');
			}
		});
	});

	it('should fail on non-string id', () => {
		userId = 1;
		expect(() => updateUser(userId, {}, () => {})).to.Throw(
			TypeError,
			`userId ${userId} is not a string`
		);

		userId = true;
		expect(() => updateUser(userId, {}, () => {})).to.Throw(
			TypeError,
			`userId ${userId} is not a string`
		);

		userId = undefined;
		expect(() => updateUser(userId, {}, () => {})).to.Throw(
			TypeError,
			`userId ${userId} is not a string`
		);
	});

	it('should fail on unsatisfying password and oldPassword pair', () => {
		userId = 'asdfasdf';
		data = { password: '123' };
		expect(() => updateUser(userId, data)).to.Throw(
			Error,
			`oldPassword is not defined`
		);

		data = { oldPassword: '123' };
		expect(() => updateUser(userId, data)).to.Throw(
			Error,
			`password is not defined`
		);
	});

	it('should fail on non-familiar property', () => {
		const property = 'hello';

		data = { [property]: 'world' };

		expect(() => updateUser(userId, data)).to.Throw(
			Error,
			`property ${property} is not allowed`
		);
	});

	after(async () => {
		await User.deleteMany();
		await mongoose.disconnect();
	});
});
