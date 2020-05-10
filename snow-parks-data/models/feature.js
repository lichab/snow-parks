const mongoose = require('mongoose')
const { feature } = require('../schemas')

module.exports = mongoose.model('Feature', feature)