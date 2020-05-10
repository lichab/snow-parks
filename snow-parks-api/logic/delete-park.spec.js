require('dotenv').config();

const {
	env: { TEST_MONGODB_URL },
} = process;
const { NotFoundError, NotAllowedError } = require('snow-parks-errors');
const {
	mongoose,
	models: { User, Park, Location },
} = require('snow-parks-data');
const { expect } = require('chai');
const { random } = Math;
const deletePark = require('./delete-park');

describe('deletePark', () => {
	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await [User.deleteMany(), Park.deleteMany()];
	});

	let name, surname, email, password;
	let parkName, size, level, location;
	let report, report2;
	let userId, parkId;

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

		return (async () => {
			const { _id } = await User.create({ name, surname, email, password });
			userId = _id.toString();

			const { id } = await Park.create({
				name: parkName,
				size,
				level,
				location,
				creator: userId,
			});
			parkId = id;
		})();
	});

	describe('when park exists and user exist', () => {
		it('should succeed deleting the park from parks collection', async () => {
			await deletePark(parkId, userId);

			const park = await Park.findById(parkId);

			expect(park).to.equal(null);
		});

		it('should remove the park from the user parks', async () => {
			await deletePark(parkId, userId);

			const user = await User.findById(userId);

			const foundPark = user.parks.find(id => id === parkId);

			expect(foundPark).to.be.undefined;
		});
	});

	describe('on deletion by accumulated reports', () => {
		beforeEach(async () => {
			const park = await Park.findById(parkId);

			park.underReview = true;

			return await park.save();
		});

		it('should succeed removing the park if no previous approvals', async () => {
			await deletePark(parkId);

			const park = await Park.findById(parkId);

			const user = await User.findById(userId);
			const foundPark = user.parks.find(id => id === parkId);

			expect(park).to.equal(null);
			expect(foundPark).to.be.undefined;
		});

		describe('when park has previous approvals', () => {
			let park;
			beforeEach(async () => {
				park = await Park.findById(parkId);

				park.underReview = true;
				park.approvals.push(userId);

				await park.save();

				report = {
					user: userId,
					problem: 'duplicate',
				};

				report2 = {
					user: userId,
					problem: 'unreal',
				};
			});

			it('should remove the park when approvals minus reports is < 0', async () => {
				park.reports.push(report);

				park.reports.push(report2);

				await park.save();

				await deletePark(parkId);

				const _park = await Park.findById(parkId);
				const user = await User.findById(userId);

				const foundPark = user.parks.find(id => id === parkId);

				expect(_park).to.equal(null);
				expect(foundPark).to.be.undefined;
			});

			it('should leave the park under review if the difference is >= 0', async () => {
				park.reports.push(report);

				park.save();

				await deletePark(parkId);

				const _park = await Park.findById(parkId);

				expect(_park.id).to.not.equal(null);
				expect(_park.underReview).to.be.true;
			});
		});
	});

	describe('when an invalid userId is provided', () => {
		let _userId;

		beforeEach(async () => {
			await User.deleteOne({ _id: userId });

			const { id } = await User.create({ name, surname, email, password });
			_userId = id;
		});

		it('should fail on non existing user and throw ', async () => {
			try {
				await deletePark(parkId, userId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.equal(`user ${userId} does not exist`);
			}
		});

		it('should fail on incorrect user as park creator and throw', async () => {
			try {
				await deletePark(parkId, _userId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotAllowedError);
				expect(error.message).to.equal(
					`user ${_userId} did not create this park`
				);
			}
		});
	});

	describe('when invalid parkId is provided', () => {
		let _parkId;

		beforeEach(async () => {
			await Park.deleteOne({ _id: parkId });

			const { id } = await Park.create({
				name: parkName,
				size,
				level,
				location,
			});
			_parkId = id;
		});

		it('should fail on non existing park and throw ', async () => {
			try {
				await deletePark(parkId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotFoundError);
				expect(error.message).to.equal(`park ${parkId} does not exist`);
			}
		});

		it('should fail on incorrect user as park creator and throw', async () => {
			try {
				await deletePark(_parkId);
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.instanceOf(NotAllowedError);
				expect(error.message).to.equal(
					`park ${_parkId} is not under review. A user id is required`
				);
			}
		});
	});

	it('should fail on non-string park id', () => {
		let parkId = 1;
		expect(() => deletePark(parkId)).to.throw(
			TypeError,
			`parkId ${parkId} is not a string`
		);

		parkId = true;
		expect(() => deletePark(parkId)).to.throw(
			TypeError,
			`parkId ${parkId} is not a string`
		);

		parkId = {};
		expect(() => deletePark(parkId)).to.throw(
			TypeError,
			`parkId ${parkId} is not a string`
		);

		parkId = '';
		expect(() => deletePark(parkId)).to.throw(Error, `parkId is empty`);
	});

	it('should fail on non-string user id when provided', () => {
		let userId = 1;
		expect(() => deletePark(parkId, userId)).to.throw(
			TypeError,
			`userId ${userId} is not a string`
		);

		userId = true;
		expect(() => deletePark(parkId, userId)).to.throw(
			TypeError,
			`userId ${userId} is not a string`
		);

		userId = {};
		expect(() => deletePark(parkId, userId)).to.throw(
			TypeError,
			`userId ${userId} is not a string`
		);

		userId = '';
		expect(() => deletePark(parkId, userId)).to.throw(Error, `userId is empty`);
	});

	after(async () => {
		await [User.deleteMany(), Park.deleteMany()];
		await mongoose.disconnect();
	});
});
