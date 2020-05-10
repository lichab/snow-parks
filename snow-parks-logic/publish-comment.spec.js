require('dotenv').config();

const logic = require('.');
const { publishComment } = logic;
const { NotFoundError, ContentError } = require('snow-parks-errors');
const {
	mongoose,
	models: { User, Park, Location },
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

describe('publishComment', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await [User.deleteMany(), Park.deleteMany()];
	});

	let name, surname, email, password;
	let parkName, size, level, location;
	let body;

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

	describe('when user already exist', () => {
		let parkId, userId;

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

			const _token = jwt.sign({ sub: id }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);
		});

		it('should succeed on creating a new comment in the park', async () => {
			await publishComment(userId, parkId, body);
			const park = await Park.findOne({ _id: parkId }).lean();

			expect(park).to.have.property('comments');
			expect(park.comments[0].body).to.equal(body);
		});

		describe('when park does not exist', () => {
			beforeEach(async () => {
				await Park.deleteOne({ _id: parkId });
			});

			it('should fail and throw', async () => {
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
	});

	describe('when user does not exist', () => {
		let parkId;
		let userId;
		beforeEach(async () => {
			const { id: _id } = await User.create({ name, surname, email, password });
			userId = _id;

			const { id } = await Park.create({
				name: parkName,
				size,
				level,
				location,
			});
			parkId = id;

			const _token = jwt.sign({ sub: userId }, JWT_SECRET);
			await logic.__context__.storage.setItem('token', _token);

			await User.deleteOne({ _id });
		});

		it('should fail and throw', async () => {
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

	describe('synchronous unhappy paths', () => {
		let body, userId, parkId;

		beforeEach(() => {
			body = `text-${random()}`;
			userId = `user-${random()}`;
			parkId = `park-${random()}`;
		});

		it('should fail on non-string userId', () => {
			userId = 1;
			expect(() => publishComment(userId, parkId, body)).to.Throw(
				TypeError,
				`userId ${userId} is not a string`
			);

			userId = undefined;
			expect(() => publishComment(userId, parkId, body)).to.Throw(
				ContentError,
				`userId is empty`
			);

			userId = true;
			expect(() => publishComment(userId, parkId, body)).to.Throw(
				TypeError,
				`userId ${userId} is not a string`
			);
		});

		it('should fail on non-string parkId', () => {
			parkId = 1;
			expect(() => publishComment(userId, parkId, body)).to.Throw(
				TypeError,
				`parkId ${parkId} is not a string`
			);

			parkId = undefined;
			expect(() => publishComment(userId, parkId, body)).to.Throw(
				ContentError,
				`parkId is empty`
			);

			parkId = true;
			expect(() => publishComment(userId, parkId, body)).to.Throw(
				TypeError,
				`parkId ${parkId} is not a string`
			);
		});

		it('should fail on non-string problem', () => {
			body = 1;
			expect(() => publishComment(userId, parkId, body)).to.Throw(
				TypeError,
				`body ${body} is not a string`
			);

			body = undefined;
			expect(() => publishComment(userId, parkId, body)).to.Throw(
				ContentError,
				`body is empty`
			);

			body = true;
			expect(() => publishComment(userId, parkId, body)).to.Throw(
				TypeError,
				`body ${body} is not a string`
			);
		});
	});

	after(async () => {
		await [User.deleteMany(), Park.deleteMany()];
		await mongoose.disconnect();
	});
});
