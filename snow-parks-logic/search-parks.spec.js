require('dotenv').config();

const logic = require('.');
const { searchParks } = logic;
const { TEST_MONGODB_URL: MONGODB_URL, TEST_API_URL: API_URL } = process.env;
const {
	mongoose,
	models: { Park, Location },
} = require('snow-parks-data');
const { NotFoundError } = require('snow-parks-errors');
const { expect } = require('chai');
const { random, sqrt, pow } = Math;

logic.__context__.API_URL = API_URL;

function distance(x1, x2, y1, y2) {
	const exponent = pow(x2 - x1, 2) + pow(y2 - y1, 2);
	const result = sqrt(exponent);

	return result;
}

describe('searchParks', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return await Park.deleteMany();
	});
	let name, size, level, location1, resort;
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
			let query = 'begg';

			let results = await searchParks(query, location);

			expect(results.length).to.be.greaterThan(0);
			expect(results[0].resort.toLowerCase()).to.equal(first);
		});

		it('should suceed on finding parks', async () => {
			let query = 'begg';
			let results = await searchParks(query, location);

			results.forEach(result => {
				expect([park1.name, park2.name]).to.include(result.name);
				expect([park1.resort, park2.resort]).to.include(
					result.resort.toLowerCase()
				);
				expect([park1.size, park2.size]).to.include(result.size);
				expect([park1.verified, park2.verified]).to.include(result.verified);
				expect([park1.id, park2.id]).to.include(result.id);
			});

			query = 'Grin';

			results = await searchParks(query, location);

			results.forEach(result => {
				expect(result.name).to.equal(park1.name);
				expect(result.resort.toLowerCase()).to.equal(park1.resort);
				expect(result.size).to.equal(park1.size);
				expect(result.verified).to.equal(park1.verified);
				expect(result.id).to.equal(park1.id.toString());
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
			await Park.deleteMany();
		});
	});

	it('should throw on no results for query', async () => {
		const query = 'random';
		try {
			await searchParks(query, location);
			throw new Error('should not reach this point');
		} catch (error) {
			expect(error).to.be.instanceOf(NotFoundError);
			expect(error.message).to.equal(`No results for ${query}`);
		}
	});

	after(async () => {
		await Park.deleteMany();
		return await mongoose.disconnect();
	});
});
