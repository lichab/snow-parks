require('dotenv').config();

const {
	env: { TEST_MONGODB_URL },
} = process;
const { NotFoundError } = require('snow-parks-errors');
const {
	mongoose,
	models: { User, Park, Location },
} = require('snow-parks-data');
const { expect } = require('chai');
const { random } = Math;
const publishComment = require('./publish-comment');

describe('publishComment', () => {
	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await [User.deleteMany(), Park.deleteMany()];
	});

	let name, surname, email, password;
	let parkName, size, level, location;
	let body;
	let parkId, userId;

	beforeEach(() => {
		body = `text-${random()}`;

		name = `name-${random()}`;
		surname = `surname-${random()}`;
		email = `email-${random()}`;
		password = `password-${random()}`;

		parkName = `parkName-${random()}`;
		size = `l`;
		level = `begginer`;
		location = new Location({
			coordinates: [random() * 15 + 1, random() * 15 + 1],
		});
	});

	describe('when park and user already exist', () => {
		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });
			userId = id;

			const { id: _id } = await Park.create({
				name: parkName,
				size,
				level,
				location,
			});
			parkId = _id;
		});

		it('should succeed on creating a new comment in the park', async () => {
			await publishComment(userId, parkId, body);
			const park = await Park.findOne({ _id: parkId }).lean();

			expect(park).to.have.property('comments');
			expect(park.comments[0].body).to.equal(body);
		});
	});

	describe('when park does not exist', () => {
		it('should fail on incorrect parkId', async () => {
			await Park.deleteMany();

			try {
				await publishComment(userId, parkId, body);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.be.equal(
					`park with id ${parkId} does not exist`
				);
			}
		});
	});

	describe('when user does not exist', () => {
		it('should fail on incorrect user id', async () => {
			await User.deleteMany();

			try {
				await publishComment(userId, parkId, body);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.be.equal(
					`user with id ${userId} does not exist`
				);
			}
		});
	});

	it('should fail on non-string or empty user id', () => {
		userId = 1;
		expect(() => publishComment(userId, parkId, body)).to.throw(
			TypeError,
			`user id ${userId} is not a string`
		);

		userId = true;
		expect(() => publishComment(userId, parkId, body)).to.throw(
			TypeError,
			`user id ${userId} is not a string`
		);

		userId = {};
		expect(() => publishComment(userId, parkId, body)).to.throw(
			TypeError,
			`user id ${userId} is not a string`
		);

		userId = '';
		expect(() => publishComment(userId, parkId, body)).to.throw(
			Error,
			`user id is empty`
		);
	});

	it('should fail on non-string or empty park id', () => {
		userId = 'string';
		parkId = 1;
		expect(() => publishComment(userId, parkId, body)).to.throw(
			TypeError,
			`park id ${parkId} is not a string`
		);

		parkId = true;
		expect(() => publishComment(userId, parkId, body)).to.throw(
			TypeError,
			`park id ${parkId} is not a string`
		);

		parkId = {};
		expect(() => publishComment(userId, parkId, body)).to.throw(
			TypeError,
			`park id ${parkId} is not a string`
		);

		parkId = '';
		expect(() => publishComment(userId, parkId, body)).to.throw(
			Error,
			`park id is empty`
		);
	});

	it('should fail on non-string or empty body', () => {
		parkId = 'string';
		body = 1;
		expect(() => publishComment(userId, parkId, body)).to.throw(
			TypeError,
			`body ${body} is not a string`
		);

		body = true;
		expect(() => publishComment(userId, parkId, body)).to.throw(
			TypeError,
			`body ${body} is not a string`
		);

		body = {};
		expect(() => publishComment(userId, parkId, body)).to.throw(
			TypeError,
			`body ${body} is not a string`
		);

		body = '';
		expect(() => publishComment(userId, parkId, body)).to.throw(
			Error,
			`body is empty`
		);
	});

	after(async () => {
		await [User.deleteMany(), Park.deleteMany()];
		await mongoose.disconnect();
	});
});
