const mongoose = require('mongoose')
const { park } = require('../schemas')

module.exports = mongoose.model('Park', park)