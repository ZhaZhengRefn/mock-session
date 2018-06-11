const ContextSession = require('./lib/context-session')
const CONTEXT_SESSION = Symbol('context#session')
const _CONTEXT_SESSION = Symbol('_context#session')

function formatOpts(opts = {}) {
    opts.key = opts.key || '[koa:sess]'

    return opts
}

//拓展context
function extendContext(ctx, opts) {
    Object.defineProperties(ctx, {
        //实现单例
        [CONTEXT_SESSION]: {
            get() {
                if (this[_CONTEXT_SESSION]) return this[_CONTEXT_SESSION]
                return this[_CONTEXT_SESSION] = new ContextSession(this, opts)
            }
        },
        //代理ContextSession，结合symbol实现实例私有化
        'session': {
            get() {
                return this[CONTEXT_SESSION].get()
            },
            set(val) {
                this[CONTEXT_SESSION].set(val)
            },
            configurable: true,
        }
    })
}

module.exports = function (app, opts = {}) {
    formatOpts(opts)
    extendContext(app.context, opts)
    return async function session(ctx, next) {
        const sess = ctx[CONTEXT_SESSION]
        try {
            await next()
        } catch (error) {
            throw error
        } finally {
            //执行保存操作
            await sess.commit()
        }
    }
}