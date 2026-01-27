import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import type { AppContext } from './types'
import pages from './routes/pages'
import api from './routes/api'
// Initialize Twind (must be imported before any component that uses Twind classes)
import './twind'

const app = new Hono<AppContext>()
app.use('*', logger())
app.use('/api/*', cors())

app.route('/', pages)
app.route('/api', api)

export default app
