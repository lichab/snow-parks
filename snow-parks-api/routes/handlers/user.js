const {
    registerUser,
    authenticateUser,
    retrieveUser,
    retrievePublishedParks,
    updateUser,
    publishComment,
    deleteUser,
    votePark
} = require('../../logic')
const { asyncHandler } = require('../../mid-wares')
const jwt = require('jsonwebtoken')
const { env: { JWT_SECRET, JWT_EXP: expiration } } = process

module.exports = {
    register: asyncHandler(async (req, res, next) => {
        await registerUser(req.body)

        res
            .status(201)
            .json({ message: 'user created' })

    }),
    authenticate: asyncHandler(async (req, res, next) => {
        const { email, password } = req.body

        const id = await authenticateUser(email, password)

        const token = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: expiration })

        res
            .status(200)
            .json({ token })
    }),
    retrieve: asyncHandler(async (req, res, next) => {
        const { sub: id } = req.payload

        const user = await retrieveUser(id)

        res
            .status(200)
            .json(user)
    }),
    update: asyncHandler(async (req, res, next) => {
        const { sub } = req.payload

        await updateUser(sub, req.body)

        res
            .status(200)
            .json({ messag: 'user updated' })
    }),
    retrieveParks: asyncHandler(async (req, res, next) => {
        const { sub: id } = req.payload

        const results = await retrievePublishedParks(id)

        res
            .status(200)
            .json({ results })
    }),
    comment: asyncHandler(async (req, res, next) => {
        const { sub: userId } = req.payload
        const { id: parkId } = req.params
        const { body } = req.body

        await publishComment(userId, parkId, body)

        res
            .status(201)
            .end()
    }),
    delete: asyncHandler(async (req, res, next) => {
        const { sub } = req.payload
        const { password } = req.body

        await deleteUser(sub, password)

        res
            .status(200)
            .json({ message: 'user deleted' })
    }),

    vote: asyncHandler(async (req, res, next) => {
        const { sub } = req.payload
        const { vote } = req.body
        const { pid } = req.params

        await votePark(sub, pid, vote)

        res
            .status(200)
            .end()
    })

}