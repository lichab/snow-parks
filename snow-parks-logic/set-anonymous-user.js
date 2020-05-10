const context = require('./context');
const { validate } = require('snow-parks-utils');

module.exports = function (isAnonymous = true) {
	validate.type(isAnonymous, 'isAnonymous', Boolean);

	return (async () => {
		if (isAnonymous) await this.storage.setItem('role', 'anonymous');
		else await this.storage.removeItem('role');
	})();
}.bind(context);
