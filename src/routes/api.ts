import { Hono } from 'hono'
import type { AppContext } from '../types'

// Separate Hono instance for API routes
// This will be mounted at /api in the main app
const api = new Hono<AppContext>()

api.get('/health', (c) => {
	// c.json() automatically sets Content-Type: application/json
	// Second parameter is optional status code (defaults to 200)
	return c.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		database: 'connected',
	})
})

api.get('/inventory', async (c) => {
	// c.req.query() gets URL query parameters
	// Example: /api/inventory?location=fridge
	const location = c.req.query('location')

	// Conditional query based on whether location parameter exists
	let query = 'SELECT * FROM inventory ORDER BY added_at DESC'
	if (location) {
		query = 'SELECT * FROM inventory WHERE location = ? ORDER BY added_at DESC'
	}

	// Only call bind() if we have a parameter to bind
	const stmt = location
		? c.env.fridge_db.prepare(query).bind(location)
		: c.env.fridge_db.prepare(query)

	const { results } = await stmt.all()

	return c.json({
		count: results.length,
		items: results,
	})
})

api.get('/users', async (c) => {
	const { results } = await c.env.fridge_db.prepare('SELECT * FROM users').all()
	return c.json(results)
})

api.post('/inventory', async (c) => {
	// c.req.json() parses JSON body from Content-Type: application/json
	const body = await c.req.json()
	const { name, quantity, location, expiry, added_by } = body

	// Basic validation - return 400 Bad Request if fields missing
	if (!name || !quantity || !location || !expiry || !added_by) {
		return c.json({ error: 'Missing required fields' }, 400)
	}

	const { success } = await c.env.fridge_db
		.prepare(
			'INSERT INTO inventory (name, quantity, location, expiry, added_by) VALUES (?, ?, ?, ?, ?)'
		)
		.bind(name, quantity, location, expiry, added_by)
		.run()

	return c.json({ success }, success ? 201 : 500)
})

api.delete('/inventory/:id', async (c) => {
	// c.req.param() gets route parameters from the URL path
	// Example: DELETE /api/inventory/123 → id = '123'
	const id = c.req.param('id')
	// run() returns { success: boolean, meta: { ... } }
	const { success } = await c.env.fridge_db.prepare('DELETE FROM inventory WHERE id = ?').bind(id).run()

	return c.json({ success }, success ? 200 : 404)
})

export default api
