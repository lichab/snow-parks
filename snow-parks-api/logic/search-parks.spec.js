require('dotenv').config();

const {
	env: { TEST_MONGODB_URL },
} = process;
const {
	mongoose,
	models: { Park, Location },
} = require('snow-parks-data');
const { NotFoundError } = require('snow-parks-errors');
const { expect } = require('chai');
const { random, sqrt, pow } = Math;
const searchParks = require('./search-parks');

function distance(x1, x2, y1, y2) {
	const exponent = pow(x2 - x1, 2) + pow(y2 - y1, 2);
	const result = sqrt(exponent);

	return result;
}

describe('searchParks', () => {
	before(async () => {
		await mongoose.connect(TEST_MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await Park.deleteMany();
	});

	let name, size, level, location1, resort, verified;
	let name2, size2, level2, location2, resort2;
	let first;
	let location;

	beforeEach(() => {
		name = `ParkName-${random()}`;
		size = `l`;
		level = `begginer`;
		resort = `grindelwald`;
		location1 = new Location({
			coordinates: [random() * 15 + 1, random() * 15 + 1],
		});
		verified = true;

		location = [random() * 15 + 1, random() * 15 + 1];

		name2 = `ParkName-${random()}`;
		size2 = `l`;
		level2 = `begginer`;
		resort2 = `laax`;
		location2 = new Location({
			coordinates: [random() * 15 + 1, random() * 15 + 1],
		});

		const parkOneToPointDistance = distance(
			location1.coordinates[0],
			location[0],
			location1.coordinates[1],
			location[1]
		);
		const parkTwoToPointDistance = distance(
			location2.coordinates[0],
			location[0],
			location2.coordinates[1],
			location[1]
		);

		if (parkOneToPointDistance > parkTwoToPointDistance) {
			first = resort2;
		} else {
			first = resort;
		}
	});

	describe('when parks exists', () => {
		let park1, park2;

		beforeEach(async () => {
			park1 = await Park.create({
				name,
				size,
				level,
				resort,
				location: location1,
				verified,
			});
			park2 = await Park.create({
				name: name2,
				size: size2,
				level: level2,
				resort: resort2,
				location: location2,
			});
		});

		it('should order the results by distance', async () => {
			let q = 'begg';

			let results = await searchParks(q, location);

			expect(results.length).to.be.greaterThan(0);
			expect(results[0].resort.toLowerCase()).to.equal(first);
		});

		it('should suceed on finding parks', async () => {
			let q = 'begg';
			let results = await searchParks(q, location);

			results.forEach(result => {
				expect(result.name).to.be.oneOf([park1.name, park2.name]);
				expect(result.resort.toLowerCase()).to.be.oneOf([
					park1.resort,
					park2.resort,
				]);
				expect(result.size).to.be.oneOf([park1.size, park2.size]);
				expect(result.verified).to.be.oneOf([park1.verified, park2.verified]);
				expect(result.id).to.be.oneOf([
					park1.id.toString(),
					park2.id.toString(),
				]);
			});

			q = 'Grin';

			results = await searchParks(q, location);

			results.forEach(result => {
				expect(result.name).to.equal(park1.name);
				expect(result.resort.toLowerCase()).to.equal(park1.resort);
				expect(result.size).to.equal(park1.size);
				expect(result.verified).to.equal(park1.verified);
				expect(result.id).to.equal(park1.id.toString());
			});
		});

		it('should succeed on retrieving all parks on empty query', async () => {
			let q = '';
			let results = await searchParks(q, location);

			results.forEach(result => {
				expect(result.name).to.be.oneOf([park1.name, park2.name]);
				expect(result.resort.toLowerCase()).to.be.oneOf([
					park1.resort,
					park2.resort,
				]);
				expect(result.size).to.be.oneOf([park1.size, park2.size]);
				expect(result.verified).to.be.oneOf([park1.verified, park2.verified]);
				expect(result.id).to.be.oneOf([
					park1.id.toString(),
					park2.id.toString(),
				]);
			});
		});

		it('on "latest" query, should order the results by creation date', async () => {
			let q = 'latest';
			let results = await searchParks(q, location);

			expect(results[0].name).to.equal(park2.name);
			expect(results[1].name).to.equal(park1.name);
		});

		it('on "verified" query, should return only verified parks', async () => {
			let q = 'verified';
			let results = await searchParks(q, location);

			expect(results[0].name).to.equal(park1.name);
			expect(results[1]).to.be.undefined;
		});

		afterEach(async () => {
			return await Park.deleteMany();
		});
	});

	it('should throw on no results for query', async () => {
		let q = 'random';

		try {
			await searchParks(q, location);
			throw new Error('should not reach this point');
		} catch (error) {
			expect(error).to.be.instanceOf(NotFoundError);
			expect(error.message).to.equal(`No results for ${q}`);
		}
	});

	it('should fail on non string id', () => {
		let q = 1;
		expect(() => {
			searchParks(q, location);
		}).to.throw(TypeError, `query ${q} is not a string`);

		q = undefined;
		expect(() => {
			searchParks(q, location);
		}).to.throw(TypeError, `query ${q} is not a string`);

		q = true;
		expect(() => {
			searchParks(q, location);
		}).to.throw(TypeError, `query ${q} is not a string`);
	});

	it('should fail on non array location', () => {
		let q = 'string';
		location = 1;
		expect(() => {
			searchParks(q, location);
		}).to.throw(TypeError, `location ${location} is not a Array`);

		location = undefined;

		expect(() => {
			searchParks(q, location);
		}).to.throw(TypeError, `location ${location} is not a Array`);

		location = true;

		expect(() => {
			searchParks(q, location);
		}).to.throw(TypeError, `location ${location} is not a Array`);
	});

	after(async () => {
		await Park.deleteMany();
		return await mongoose.disconnect();
	});
});
