const { Schema } = require('mongoose')

module.exports = new Schema({
    geometry: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true
        },
        coordinates: {
            type: [[[Number]]],
            required: true
        }
    }
}, { _id: false })