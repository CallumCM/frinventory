import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import type { AppContext } from './types'
import pages from './routes/pages'
import api from './routes/api'
import './twind'

// Main Hono app instance
const app = new Hono<AppContext>()

// Middleware runs before route handlers
// app.use('*', ...) applies to all routes
// logger() logs each request to console
app.use('*', logger())
// cors() enables Cross-Origin Resource Sharing for API routes only
app.use('/api/*', cors())

// Mount route groups at specific paths
// app.route(prefix, honoInstance) merges routes from another Hono instance
// pages has routes like /inventory, /users → mounted at root
app.route('/', pages)
// api has routes like /health, /inventory → mounted at /api
// Result: /api/health, /api/inventory, etc.
app.route('/api', api)

export default app
