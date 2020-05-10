const jwt = require('jsonwebtoken')
const { env: { JWT_SECRET } } = process

module.exports = (req, res, next) => {
    const { headers: { authorization } } = req

    if (!authorization) res.status(401).json({ error: 'no authorization header proveded' })

    const [bearer, token] = authorization.split(' ')

    if (bearer.toLowerCase() !== 'bearer') res.status(401).json({ error: 'invalid authorization header' })

    if (!token) res.status(401).json({ error: 'not token provided' })

    try {
        const payload = jwt.verify(token, JWT_SECRET)

        req.payload = payload

        next()
    } catch ({ message }) {
        res
            .status(401)
            .json({ error: message })
    }
}