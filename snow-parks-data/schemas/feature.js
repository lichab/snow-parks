const { Schema } = require('mongoose')
const Point = require('./point')


module.exports = new Schema({
    name: { type: String, required: true, enum: ['rail', 'box', 'other', 'kicker', 'pipe'] },
    size: { type: String, required: true, enum: ['s', 'm', 'l', 'xl'] },
    description: String,
    image: String,
    location: Point
}) 