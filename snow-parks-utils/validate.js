const { ContentError } = require('snow-parks-errors');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
	string(target, name, empty = true) {
		this.type(target, name, String);

		if (empty && !target.trim()) throw new ContentError(`${name} is empty`);
	},

	stringFrontend(target, name, empty = true) {
		if (typeof target === 'undefined')
			throw new ContentError(`${name} is empty`);

		this.type(target, name, String);

		if (empty && !target.trim()) throw new ContentError(`${name} is empty`);
	},
	jwt(token) {
		this.type(token, 'token', String);

		const parts = token.split('.');

		if (parts.length !== 3) throw new ContentError('invalid token');

		const [header, payload, signature] = parts;

		if (
			!header.trim().length ||
			!payload.trim().length ||
			!signature.trim().length
		)
			throw new ContentError('invalid token');
	},

	email(target) {
		if (!EMAIL_REGEX.test(target))
			throw new ContentError(`${target} is not an e-mail`);
	},

	type(target, name, type) {
		if (type === String || type === Number || type === Boolean) {
			type = type.name.toLowerCase();
			if (typeof target === 'number' && target.toString() === 'NaN')
				throw new TypeError(`${name} ${target} is not a ${type}`);
			if (typeof target !== type)
				throw new TypeError(`${name} ${target} is not a ${type}`);
		} else if (!(target instanceof type))
			throw new TypeError(`${name} ${target} is not a ${type.name}`);
	},
};
