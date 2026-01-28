import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import type { AppContext } from './types'
import pages from './routes/pages'
import api from './routes/api'
import { installTwind } from './twind.config'

const app = new Hono<AppContext>()

installTwind();

app.use('*', logger())
app.use('/api/*', cors())

app.get('/public/*', async (c) => {
  const url = new URL(c.req.url)
  url.pathname = url.pathname.replace(/^\/public/, '')
  return c.env.ASSETS.fetch(new Request(url, c.req.raw))
})

app.route('/', pages)
app.route('/api', api)

export default app
