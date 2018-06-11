//包装session数据的对象

class Session {
    constructor(ctx, obj) {
        if (!obj) {
            this.isNew = true
        } else {
            for (const key in obj) {
                this[key] = obj[key]
            }
        }
    }

    toJSON() {
        const output = {}

        for (const key in this) {
            if (key === 'isNew' || key[0] === '_') return
            output[key] = this[key]
        }
        return output
    }

    inspect() {
        return this.toJSON()
    }
}

module.exports = Session