const { Schema, Types: { ObjectId } } = require('mongoose')
const Feature = require('./feature')
const Comment = require('./comment')
const Point = require('./point')



module.exports = new Schema({
    name: { type: String, required: true },
    size: {
        type: String,
        required: true,
        enum: ['s', 'm', 'l', 'xl']
    },
    flow: { type: String, default: 'N/A' },
    level: {
        type: String,
        required: true,
        enum: ['begginer', 'intermediate', 'advanced', 'ripper']
    },
    resort: String,
    location: {
        type: Point,
        required: true
    },
    image: String,
    upVotes: [{ type: ObjectId, ref: 'User', default: [] }],
    downVotes: [{ type: ObjectId, ref: 'User', default: [] }],
    rating: Number,
    features: [Feature],
    description: String,
    creator: { type: ObjectId, ref: 'User' },
    comments: [Comment],
    created: { type: Date, default: Date.now },
    modified: Date,
    reports: [{
        user: {
            type: ObjectId,
            ref: 'User'
        },
        problem: {
            type: String,
            enum: ['duplicate', 'unreal']
        }
    }],
    underReview: { type: Boolean, default: false },
    approvals: [{ type: ObjectId, ref: 'User', default: [] }],
    verified: { type: Boolean, default: false }
}, { reatainKeyOrder: true }) 