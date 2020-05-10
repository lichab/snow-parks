require('dotenv').config();

const { mongoose } = require('snow-parks-data');

const area1 = {
	type: 'Feature',
	properties: {},
	geometry: {
		type: 'Polygon',
		coordinates: [
			[
				[1.06292724609375, 42.413318349422475],
				[1.42547607421875, 42.31997030030749],
				[1.28265380859375, 42.45791402988027],
				[1.06292724609375, 42.413318349422475],
			],
		],
	},
};

const area2 = {
	type: 'Feature',
	properties: {},
	geometry: {
		type: 'Polygon',
		coordinates: [
			[
				[1.38153076171875, 42.3793435424587],
				[1.371917724609375, 42.29915102336597],
				[1.4810943603515625, 42.312354290456355],
				[1.38153076171875, 42.3793435424587],
			],
		],
	},
};

const area = {
	type: String,
	enum: ['Feature'],
	geometry: {
		type: {
			type: String,
			enum: ['Polygon'],
			required: true,
		},
		coordinates: {
			type: [[[Number]]],
			required: true,
		},
	},
};

const Area = mongoose.model('Area', area);

mongoose
	.connect('mongodb://localhost:27017/test-snow-parks', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		const _area1 = new Area(area1);
		const _area2 = new Area(area2);

		return _area1.save().then(() => {
			return _area2.save().then(() => {
				return console.log('saved');
			});
		});
	})
	.then(() => {
		return Area.find({
			geometry: {
				$geoIntersects: {
					$geometry: {
						type: 'Polygon',
						coordinates: area2.geometry.coordinates,
					},
				},
			},
		}).then(result => {
			console.log(result);
		});
	})
	.then(() => {
		return mongoose.disconnect();
	})
	.catch(error => {});
