require('dotenv').config();

const bcrypt = require('bcryptjs');
const logic = require('.');
const { updateUser } = logic;
const {
	NotFoundError,
	ContentError,
	NotAllowedError,
} = require('snow-parks-errors');
const {
	mongoose,
	models: { User, Park },
} = require('snow-parks-data');
const { expect } = require('chai');
const { random } = Math;
const AsyncStorage = require('not-async-storage');
const {
	TEST_JWT_SECRET: JWT_SECRET,
	TEST_MONGODB_URL: MONGODB_URL,
	TEST_API_URL: API_URL,
} = process.env;
const jwt = require('jsonwebtoken');

logic.__context__.storage = AsyncStorage;
logic.__context__.API_URL = API_URL;

describe('updateUser', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
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

			const _token = jwt.sign({ sub: user.id }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);
		});

		it('should succeed on valid id and credentials', async () => {
			name += '-update';
			email = 'update-@email.com';
			oldPassword = password;
			password += '-update';

			await updateUser(userId, { name, email, password, oldPassword });

			const _user = await User.findById(userId).lean();

			expect(_user.name).to.equal(name);
			expect(_user.email).to.equal(email);

			const validPassword = await bcrypt.compare(password, _user.password);

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
			ContentError,
			`userId is empty`
		);
	});

	it('should fail on unsatisfying password and oldPassword pair', () => {
		userId = 'asdfasdf';
		data = { password: '123' };
		expect(() => updateUser(userId, data)).to.Throw(
			Error,
			`Old password is empty`
		);

		data = { oldPassword: '123' };
		expect(() => updateUser(userId, data)).to.Throw(Error, `Password is empty`);
	});

	it('should fail on non-familiar property', () => {
		userId =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTNiZDhmZDE3YjgwOTFiYWFjMTIxMzgiLCJpYXQiOjE1ODA5ODA3NjEsImV4cCI6MTU4MDk4NDM2MX0.t8g49qXznSCYiK040NvOWHPXWqnj9riJ_6MD2vwIv3M';

		const property = 'hello';

		data = { [property]: 'world' };

		expect(() => updateUser(userId, data)).to.Throw(
			Error,
			`property ${property} is not allowed`
		);
	});

	after(() => User.deleteMany().then(() => mongoose.disconnect()));
});
