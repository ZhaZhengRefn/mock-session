const util = require('./util')
const Session = require('./session')

class ContextSession {
    constructor(ctx, opts = {}) {
        this.ctx = ctx
        this.app = ctx.app
        this.opts = opts
    }

    //代理，返回session实例
    get() {
        const session = this.session

        if (session) return session

        if (session === false) return null

        this.initFromCookie()

        return this.session
    }

    set(val) {
        if (val == null) {
            this.session = false
            return
        }
        if (typeof val === 'object') {
            this.create(val)
            return
        }
        throw new Error('this.session can only be set as null or an object.')
    }

    /**
     * 从cookie中初始化session：
     * 1.从cookie中读取session，若无或报错则重新创建
     * 2.
     **/
    initFromCookie() {
        const cookie = this.ctx.cookies.get(this.opts.key)

        if (!cookie) {
            this.create()
            return
        }

        let json
        try {
            json = util.decode(cookie)
        } catch (error) {
            throw error

            this.create()
            return
        }

        this.create(json)
        this.prevHash = util.hash(json)
        return
    }

    //实例化session
    create(val = {}) {
        this.session = new Session(this.ctx, val)
    }

    //代理保存操作：执行完中间件后，根据不同的reason来保存session
    async commit() {
        const session = this.session
        const opts = this.opts
        const ctx = this.ctx

        const reason = this._shouldSaveSession()

        await this.save(reason)
    }

    _shouldSaveSession() {
        const prevHash = this.prevHash
        const json = this.session.toJSON()

        if (!prevHash || !Object.keys(json).length) return ''

        const isChanged = prevHash !== util.hash(json)
        if (isChanged) return 'changed'

        return ''
    }

    async save() {
        const ctx = this.ctx
        const opts = this.opts
        const key = opts.key

        let json = this.session.toJSON()

        json = util.encode(json)

        ctx.cookies.set(key, json, opts)
    }
}

module.exports = ContextSession