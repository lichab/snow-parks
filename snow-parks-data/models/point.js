const mongoose = require('mongoose')
const { point } = require('../schemas')

module.exports = mongoose.model('Location', point)