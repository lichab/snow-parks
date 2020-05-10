const {
	NotAllowedError,
	NotFoundError,
	ContentError,
} = require('snow-parks-errors');

function errorHandler(err, req, res, next) {
	switch (true) {
		case err instanceof NotAllowedError:
			res.status(403).json({ error: err.message });
			break;
		case err instanceof NotFoundError:
			res.status(404).json({ error: err.message });
			break;
		case err instanceof ContentError || err instanceof TypeError:
			res.status(406).json({ error: err.message });
			break;
		default:
			res.status(400).json({ error: err.message });
	}
}

module.exports = errorHandler;
