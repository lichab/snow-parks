const { Router } = require('express')
const router = Router()
const { jwtValidationMidWare, errorHandler } = require('../mid-wares')

const {
    user,
    park
} = require('./handlers')

const bodyParser = require('body-parser')

const jsonBodyParser = bodyParser.json()

router.post('/users', jsonBodyParser, user.register)

router.post('/users/auth', jsonBodyParser, user.authenticate)

router.patch('/users/:id?', [jwtValidationMidWare, jsonBodyParser], user.update)

router.get('/users/:id?', [jwtValidationMidWare], user.retrieve)

router.post('/users/:id/parks/:id/comment', [jwtValidationMidWare, jsonBodyParser], user.comment)

router.get('/users/:id?/parks', [jwtValidationMidWare], user.retrieveParks)

router.post('/users/:id?/parks', [jwtValidationMidWare, jsonBodyParser], park.create)

router.patch('/users/:id/parks/:id/approve', jwtValidationMidWare, park.approve)

router.patch('/users/:id/parks/:pid/report', [jwtValidationMidWare, jsonBodyParser], park.report)

router.patch('/users/:id/parks/:pid/update', [jwtValidationMidWare, jsonBodyParser], park.update)

router.patch('/users/:id/parks/:pid/vote', [jwtValidationMidWare, jsonBodyParser], user.vote)

router.delete('/users/:id/parks/:pid/', jwtValidationMidWare, park.delete)

router.delete('/users/:id?', [jwtValidationMidWare, jsonBodyParser], user.delete)

router.get('/parks/:id', park.retrieve)

router.get('/parks/:id/location', park.retrieveLocation)

router.get('/parks', park.search)

router.use(errorHandler)

module.exports = router
