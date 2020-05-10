require('dotenv').config();

const logic = require('.');
const { createPark } = logic;
const AsyncStorage = require('not-async-storage');
const { expect } = require('chai');
const {
	TEST_JWT_SECRET: JWT_SECRET,
	TEST_API_URL: API_URL,
	TEST_MONGODB_URL: MONGODB_URL,
} = process.env;
const {
	mongoose,
	models: { Park, User },
} = require('snow-parks-data');
const {
	NotAllowedError,
	NotFoundError,
	ContentError,
} = require('snow-parks-errors');
const { random } = Math;
const jwt = require('jsonwebtoken');

logic.__context__.storage = AsyncStorage;
logic.__context__.API_URL = API_URL;

describe('createPark', () => {
	before(async () => {
		await mongoose.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		return Promise.all([User.deleteMany(), Park.deleteMany()]);
	});

	let userName, surname, email, password;
	let features = [];
	let park = {};
	let featureName, featureSize;

	beforeEach(() => {
		featureName = `rail`;
		featureSize = `l`;
		featureLocation = {
			coordinates: [random() * 15 + 1, random() * 15 + 1],
		};

		userName = `name${random()}`;
		surname = `surname${random()}`;
		email = `${random()}@mail.com`;
		password = `password${random()}`;

		park.name = `name${random()}`;
		park.size = `l`;
		park.flow = `flow${random()}`;
		park.level = `intermediate`;
		park.resort = `resort${random()}`;
		park.description = `description${random()}`;
		park.location = { coordinates: [random() * 15 + 1, random() * 15 + 1] };
	});

	describe('when user exists', () => {
		let userId;
		beforeEach(async () => {
			const { id } = await User.create({
				name: userName,
				surname,
				email,
				password,
			});
			userId = id;

			features.push({
				name: featureName,
				size: featureSize,
				location: featureLocation,
			});

			const _token = jwt.sign({ sub: id }, JWT_SECRET);

			await logic.__context__.storage.setItem('token', _token);
		});

		it('should create a new park', async () => {
			await createPark({ park, features });

			const _park = await Park.findOne({ name: park.name }).lean();

			expect(_park.name).to.equal(park.name);
			expect(_park.size).to.equal(park.size);
			expect(_park.level).to.equal(park.level);
			expect(_park.flow).to.equal(park.flow);
			expect(_park.resort).to.equal(park.resort);

			expect(_park.location.coordinates).to.deep.equal(
				park.location.coordinates
			);
			expect(_park.description).to.equal(park.description);
			expect(_park.creator.toString()).to.equal(userId);
		});

		it('should add the park to the user', async () => {
			await createPark({ park, features });

			const user = await User.findById(userId);
			const _park = await Park.findOne({ name: park.name }).lean();

			expect(user.parks).to.include(_park._id);
		});

		it('should succeed on undefined flow', async () => {
			park.flow = undefined;

			await createPark({ park, features });

			const _park = await Park.findOne({ name: park.name }).lean();
			expect(_park).to.exist;
			expect(_park.flow).to.equal('N/A');
		});

		it('should succeed when no features are provided', async () => {
			features = [];

			await createPark({ park, features });

			const _park = await Park.findOne({ name: park.name }).lean();

			expect(_park).to.exist;
			expect(_park.features).to.be.an.instanceOf(Array);
			expect(_park.features).to.have.lengthOf(0);
		});

		describe('when park already exists', () => {
			beforeEach(async () => {
				await Park.create(park);
			});

			it('should fail and throw', async () => {
				try {
					await createPark({ park, features });
					throw new Error('should not reach this point');
				} catch (error) {
					expect(error).to.be.an.instanceOf(NotAllowedError);
					expect(error.message).to.equal(`park '${park.name}' already exists`);
				}
			});
		});

		afterEach(async () => {
			await User.deleteMany();
		});
	});

	describe('when user does not exist', () => {
		it('should fail and throw', async () => {
			try {
				await createPark({ park, features });
				throw new Error('should not reach this point');
			} catch (error) {
				expect(error).to.be.an.instanceOf(NotFoundError);
				expect(error.message).to.equal(
					'It seems you are not logged in or you deleted your account'
				);
			}
		});
	});

	describe('synchronous unhappy paths', () => {
		it('should fail on non non-object park data', () => {
			let parkData = true;
			expect(() => createPark(parkData)).to.Throw(
				TypeError,
				`park data ${parkData} is not a Object`
			);

			parkData = 1;
			expect(() => createPark(parkData)).to.Throw(
				TypeError,
				`park data ${parkData} is not a Object`
			);

			parkData = undefined;
			expect(() => createPark(parkData)).to.Throw(
				TypeError,
				`park data ${parkData} is not a Object`
			);
		});

		it('should fail on non string flow', () => {
			park.flow = true;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`flow ${park.flow} is not a string`
			);

			park.flow = 1;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`flow ${park.flow} is not a string`
			);

			park.flow = [];
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`flow ${park.flow} is not a string`
			);
		});

		it('should fail on non string park name', () => {
			park.name = true;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`name ${park.name} is not a string`
			);

			park.name = 1;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`name ${park.name} is not a string`
			);

			park.name = undefined;
			expect(() => createPark({ park, features })).to.Throw(
				ContentError,
				`name is empty`
			);
		});

		it('should fail on non string park resort', () => {
			park.resort = true;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`resort ${park.resort} is not a string`
			);

			park.resort = 1;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`resort ${park.resort} is not a string`
			);

			park.resort = undefined;
			expect(() => createPark({ park, features })).to.Throw(
				ContentError,
				`resort is empty`
			);
		});

		it('should fail on non string park level', () => {
			park.level = true;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`level ${park.level} is not a string`
			);

			park.level = 1;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`level ${park.level} is not a string`
			);

			park.level = undefined;
			expect(() => createPark({ park, features })).to.Throw(
				ContentError,
				`level is empty`
			);
		});

		it('should fail on non string park size', () => {
			park.size = true;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`size ${park.size} is not a string`
			);

			park.size = 1;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`size ${park.size} is not a string`
			);

			park.size = undefined;
			expect(() => createPark({ park, features })).to.Throw(
				ContentError,
				`size is empty`
			);
		});

		it('should fail on non string park description', () => {
			park.description = true;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`description ${park.description} is not a string`
			);

			park.description = 1;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`description ${park.description} is not a string`
			);

			park.description = [];
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`description ${park.description} is not a string`
			);
		});

		it('should fail on non object park location', () => {
			park.location = true;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`location ${park.location} is not a Object`
			);

			park.location = 1;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`location ${park.location} is not a Object`
			);

			park.location = undefined;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`location ${park.location} is not a Object`
			);
		});

		it('should fail on non object feature location', () => {
			features[0].location = true;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`location ${features[0].location} is not a Object`
			);

			features[0].location = 1;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`location ${features[0].location} is not a Object`
			);

			features[0].location = undefined;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`location ${features[0].location} is not a Object`
			);
		});

		it('should fail on non string feature name', () => {
			features[0].name = true;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`name ${features[0].name} is not a string`
			);

			features[0].name = 1;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`name ${features[0].name} is not a string`
			);

			features[0].name = undefined;
			expect(() => createPark({ park, features })).to.Throw(
				ContentError,
				`name is empty`
			);
		});

		it('should fail on non object feature location', () => {
			features[0].name = 'string';
			features[0].size = true;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`size ${features[0].size} is not a string`
			);

			features[0].size = 1;
			expect(() => createPark({ park, features })).to.Throw(
				TypeError,
				`size ${features[0].size} is not a string`
			);

			features[0].size = undefined;
			expect(() => createPark({ park, features })).to.Throw(
				ContentError,
				`size is empty`
			);
		});
	});

	after(async () => {
		await [User.deleteMany(), Park.deleteMany()];
		return await mongoose.disconnect();
	});
});
