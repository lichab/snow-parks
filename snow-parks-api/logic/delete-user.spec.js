require('dotenv').config();

const deleteUser = require('./delete-user');
const { expect } = require('chai');
const {
	env: { TEST_MONGODB_URL },
} = process;
const {
	mongoose,
	models: { User },
} = require('snow-parks-data');
const { NotAllowedError, NotFoundError } = require('snow-parks-errors');
const bcrypt = require('bcryptjs');

describe('deleteUser', () => {
	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await User.deleteMany();
	});

	let name, surname, email, password;
	let _id;

	beforeEach(() => {
		name = `name-${Math.random()}`;
		surname = `surname-${Math.random()}`;
		email = `${Math.random()}@email.com`;
		password = `password-${Math.random()}`;
	});

	describe('when user exists', () => {
		beforeEach(async () => {
			const _password = await bcrypt.hash(password, 10);

			const { id } = await User.create({
				name,
				surname,
				email,
				password: _password,
			});
			_id = id;
		});

		it('should succeed removing the user', async () => {
			const returnVal = await deleteUser(_id, password);
			const user = await User.findById(_id).lean();

			expect(returnVal).to.be.undefined;
			expect(user).to.be.null;
		});

		it('should fail on incorrect password', async () => {
			password = password + 'wrong';

			try {
				await deleteUser(_id, password);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotAllowedError);
				expect(error.message).to.equal('incorrect password');
			}
		});
	});

	describe('when user does not exist', () => {
		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });
			_id = id;

			await User.deleteMany();
		});

		it('should fail on incorrect id or non existing user', async () => {
			try {
				await deleteUser(_id, password);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.be.equal(`user with id ${_id} does not exist`);
			}
		});
	});

	it('should fail on non-string or empty user id', () => {
		_id = 1;
		expect(() => deleteUser(_id, password)).to.throw(
			TypeError,
			`user id ${_id} is not a string`
		);

		_id = true;
		expect(() => deleteUser(_id, password)).to.throw(
			TypeError,
			`user id ${_id} is not a string`
		);

		_id = {};
		expect(() => deleteUser(_id, password)).to.throw(
			TypeError,
			`user id ${_id} is not a string`
		);

		_id = '';
		expect(() => deleteUser(_id, password)).to.throw(Error, `user id is empty`);
	});

	it('should fail on non-string or empty password', () => {
		_id = 'string';
		password = 1;
		expect(() => deleteUser(_id, password)).to.throw(
			TypeError,
			`password ${password} is not a string`
		);

		password = true;
		expect(() => deleteUser(_id, password)).to.throw(
			TypeError,
			`password ${password} is not a string`
		);

		password = {};
		expect(() => deleteUser(_id, password)).to.throw(
			TypeError,
			`password ${password} is not a string`
		);

		password = '';
		expect(() => deleteUser(_id, password)).to.throw(
			Error,
			`password is empty`
		);
	});

	after(async () => {
		await User.deleteMany();
		await mongoose.disconnect();
	});
});
