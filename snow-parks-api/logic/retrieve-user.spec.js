require('dotenv').config();

const {
	env: { TEST_MONGODB_URL },
} = process;
const {
	mongoose,
	models: { User },
} = require('snow-parks-data');
const { expect } = require('chai');
const retrieveUser = require('./retrieve-user');
const { NotFoundError, NotAllowedError } = require('snow-parks-errors');

describe('retrieveUser', () => {
	let name, surname, email, password;

	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		return await User.deleteMany();
	});

	beforeEach(() => {
		name = 'name-' + Math.random();
		surname = 'surname-' + Math.random();
		email = Math.random() + '@mail.com';
		password = 'password-' + Math.random();
	});

	describe('when user exists', () => {
		let _id;
		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });

			_id = id;
		});

		describe('when user is not deactivated', () => {
			it('should succeed on valid id, returning the user', async () => {
				const user = await retrieveUser(_id);

				expect(user.constructor).to.equal(Object);
				expect(user.id).to.equal(_id);
				expect(user.name).to.equal(name);
				expect(user.surname).to.equal(surname);
				expect(user.email).to.equal(email);
				expect(user.password).to.be.undefined;
			});
		});

		describe('when user is deactivated', () => {
			beforeEach(async () => {
				const user = await User.findById(_id);

				user.deactivated = true;

				await user.save();
			});

			it('should fail and throw', async () => {
				try {
					await retrieveUser(_id);
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.an.instanceOf(NotAllowedError);
					expect(error.message).to.equal(`user with id ${_id} is deactivated`);
				}
			});
		});
	});

	describe('when user does not exist', () => {
		let _id;

		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });
			_id = id;

			await User.deleteOne({ _id });
		});

		it('should fail throwing not-found-error', async () => {
			try {
				const user = await retrieveUser(_id);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.equal(`user with id ${_id} does not exist`);
			}
		});
	});

	it('should fail on non-string or empty id', () => {
		let id = 1;
		expect(() => retrieveUser(id)).to.throw(
			TypeError,
			`id ${id} is not a string`
		);

		id = true;
		expect(() => retrieveUser(id)).to.throw(
			TypeError,
			`id ${id} is not a string`
		);

		id = {};
		expect(() => retrieveUser(id)).to.throw(
			TypeError,
			`id ${id} is not a string`
		);

		id = '';
		expect(() => retrieveUser(id)).to.throw(Error, `id is empty`);
	});

	after(async () => {
		await User.deleteMany();
		await mongoose.disconnect();
	});
});
