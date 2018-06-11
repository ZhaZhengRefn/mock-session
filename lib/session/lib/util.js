const crc = require('crc').crc32

module.exports = {
    decode(str) {
        const body = Buffer.from(str, 'base64').toString('binary')
        return JSON.parse(body)
    },
    encode(body) {
        body = JSON.stringify(body)
        return Buffer.from(body).toString('base64')
    },
    hash(sess) {
        return crc(JSON.stringify(sess))
    }
}