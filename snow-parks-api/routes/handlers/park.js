const {
    retrieveParkLocation,
    createPark,
    updatePark,
    approvePark,
    reportPark,
    deletePark,
    searchParks,
    retrievePark
} = require('../../logic')
const { asyncHandler } = require('../../mid-wares')

module.exports = {
    create: asyncHandler(async (req, res, next) => {
        const { sub: id } = req.payload
        const { body: parkData } = req

        await createPark(id, parkData)

        res
            .status(201)
            .json({ message: 'park created' })
    }),
    approve: asyncHandler(async (req, res, next) => {
        const { sub } = req.payload
        const { id } = req.params

        await approvePark(sub, id)

        res
            .status(200)
            .end()
    }),
    report: asyncHandler(async (req, res, next) => {
        const { pid: parkId } = req.params
        const { problem } = req.body
        const { sub: userId } = req.payload

        const review = await reportPark(parkId, problem, userId)

        if (review) deletePark(req.params.pid)

        res
            .status(201)
            .end()
    }),
    retrieve: asyncHandler(async (req, res, next) => {
        const { id } = req.params

        const park = await retrievePark(id)

        res.status(200).json({ park })
    }),
    search: asyncHandler(async (req, res, next) => {
        const { query, location } = req.query

        const results = await searchParks(query, location)

        res
            .status(200)
            .json({ results })
    }),
    update: asyncHandler(async (req, res, next) => {
        const { id, pid: parkId } = req.params

        await updatePark(id, parkId, req.body)

        res
            .status(200)
            .json({ message: 'park updated' })
    }),
    delete: asyncHandler(async (req, res, nex) => {
        const { sub: userId } = req.payload
        const { pid: parkId } = req.params

        await deletePark(parkId, userId)

        res
            .status(200)
            .end()
    }),
    retrieveLocation: asyncHandler(async (req, res, next) => {
        const { id } = req.params

        const result = await retrieveParkLocation(id)

        res
            .status(200)
            .json({ result })
    })
}