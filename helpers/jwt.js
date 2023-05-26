// protect APIs
const { expressjwt: jwt } = require('express-jwt')

const authJwt = () => {
    const secret = process.env.SECRET_TOKEN
    const api = process.env.API_URL
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            // { url: `${api}/products`, methods: ['GET', 'OPTIONS'] }, //đối với kiểu thể hiện này thì có 1 số api lại ko dùng được như /get/featured/:count, ...
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

const isRevoked = (req, payload, done) => {
    if(!payload.isAdmin) {
        done(null, true)
    }

    done()
}

module.exports = authJwt