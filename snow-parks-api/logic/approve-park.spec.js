require('dotenv').config();

const {
	env: { TEST_MONGODB_URL },
} = process;
const {
	mongoose,
	models: { Park, User, Location },
} = require('snow-parks-data');
const { NotFoundError, NotAllowedError } = require('snow-parks-errors');
const { expect } = require('chai');
const { random } = Math;
const approvePark = require('./approve-park');

describe('approvePark', () => {
	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await [Park.deleteMany(), User.deleteMany()];
	});

	let parkName, size, level, location;
	let name, surname, email, password;

	beforeEach(() => {
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

	describe('when user and park exist', () => {
		let userId, parkId;

		beforeEach(async () => {
			const { id } = await User.create({ name, surname, email, password });

			userId = id;
		});

		describe('when park has less than 4 approvals', () => {
			beforeEach(async () => {
				const { id: _id } = await Park.create({
					name: parkName,
					size,
					level,
					location,
				});

				parkId = _id;
			});

			it('should succeed on incrementing approvals by 1', async () => {
				await approvePark(userId, parkId);

				const { approvals } = await Park.findById(parkId);

				expect(approvals.length).to.be.greaterThan(0);
				expect(approvals[0].toString()).to.equal(userId);
			});

			it('should fail when user already gave approval', async () => {
				const park = await Park.findById(parkId);

				park.approvals.push(userId);
				await park.save();

				try {
					await approvePark(userId, parkId);
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.instanceOf(NotAllowedError);
					expect(error.message).to.equal(
						`user with id ${userId} already approved`
					);
				}
			});
		});

		describe('when park already has 4 approvals', () => {
			beforeEach(async () => {
				const park = await Park.create({
					name: parkName,
					size,
					level,
					location,
				});
				parkId = park.id;

				for (let i = 1; i < 5; i++) {
					const { id } = await User.create({ name, surname, email, password });

					park.approvals.push(id);
					await park.save();
				}
			});

			it('should succeed on verifying the park', async () => {
				await approvePark(userId, parkId);

				const _park = await Park.findById(parkId);

				expect(_park.approvals).to.have.lengthOf(5);
				expect(_park.verified).to.be.true;
			});
		});
	});

	describe('when user does not exist', () => {
		let parkId;
		let userId;

		beforeEach(async () => {
			const { id: _id } = await Park.create({
				name: parkName,
				size,
				level,
				location,
			});
			parkId = _id;

			const { id } = await User.create({ name, surname, email, password });
			userId = id;

			await User.deleteOne({ email });
		});

		it('should fail and throw', async () => {
			try {
				await approvePark(userId, parkId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.be.equal(
					`user with id ${userId} does not exist`
				);
			}
		});
	});

	describe('when park does not exist', () => {
		let userId;
		let parkId;
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

			await Park.deleteOne({ name: parkName });
		});

		it('should fail and throw', async () => {
			try {
				await approvePark(userId, parkId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.be.equal(
					`park with id ${parkId} does not exist`
				);
			}
		});
	});

	it('should fail on non-string or empty user id', () => {
		let userId = 1;
		let parkId = 'string';
		expect(() => approvePark(userId, parkId)).to.throw(
			TypeError,
			`user id ${userId} is not a string`
		);

		userId = true;
		expect(() => approvePark(userId, parkId)).to.throw(
			TypeError,
			`user id ${userId} is not a string`
		);

		userId = {};
		expect(() => approvePark(userId, parkId)).to.throw(
			TypeError,
			`user id ${userId} is not a string`
		);

		userId = '';
		expect(() => approvePark(userId, parkId)).to.throw(
			Error,
			`user id is empty`
		);
	});

	it('should fail on non-string or empty park id', () => {
		let parkId = 1;
		let userId = 'string';
		expect(() => approvePark(userId, parkId)).to.throw(
			TypeError,
			`park id ${parkId} is not a string`
		);

		parkId = true;
		expect(() => approvePark(userId, parkId)).to.throw(
			TypeError,
			`park id ${parkId} is not a string`
		);

		parkId = {};
		expect(() => approvePark(userId, parkId)).to.throw(
			TypeError,
			`park id ${parkId} is not a string`
		);

		parkId = '';
		expect(() => approvePark(userId, parkId)).to.throw(
			Error,
			`park id is empty`
		);
	});

	after(async () => {
		await [User.deleteMany(), Park.deleteMany()];
		await mongoose.disconnect();
	});
});
