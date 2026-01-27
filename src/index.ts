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

app.route('/', pages)
app.route('/api', api)

export default app
