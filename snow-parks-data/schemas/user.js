const { Schema, Types: { ObjectId } } = require('mongoose')
const Point = require('./point')

module.exports = new Schema({
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    age: Number,
    image: String,
    allowLocation: { type: Boolean, default: false },
    location: Point,
    followers: { type: ObjectId, ref: 'User' },
    notifications: { type: Boolean, default: true },
    parks: [{
        type: ObjectId,
        ref: 'Park'
    }],
    contributions: [{
        type: ObjectId,
        ref: 'Park'
    }],
    rejections: [{
        type: ObjectId,
        ref: 'Park'
    }],
    created: { type: Date, trim: true, default: Date.now },
    authenticated: Date,
    deactivated: Boolean,
}, { reatainKeyOrder: true })