const { Schema, Types: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    postedBy: { type: ObjectId, required: true, ref: 'User' },
    body: { type: String, required: true },
    date: { type: Date, default: Date.now }
}) 