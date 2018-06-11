const Koa = require('koa')
const app = new Koa()
const PORT = 3000

if (process.env.NODE_ENV !== 'mock') {
    app.keys = ['some secret']
    const SESSION_CONFIG = {
        key: 'koa:sess',
        maxAge: 86400000,
        overWrite: true,
        httpOnly: true,
    }
    const session = require('koa-session')
    app.use(session(SESSION_CONFIG, app))
    app.use(ctx => {
        if (ctx.path === '/favicon.ico') return
        let n = ctx.session.views || 0
        ctx.session.views = ++n
        ctx.body = n + ' views'
    })
} else {
    app.keys = ['some secret']
    const session = require('./lib/session/app')
    app.use(session(app))
    app.use(ctx => {
        if (ctx.path === '/favicon.ico') return
        let n = ctx.session.views || 0
        ctx.session.views = ++n
        ctx.body = n + ' views'
    })
}


app.listen(PORT, () => {
    console.log(`app is listening port: ${PORT}`)
})