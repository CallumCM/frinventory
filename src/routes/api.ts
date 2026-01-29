import { Hono } from 'hono'
import type { AppContext } from '../types'

// Separate Hono instance for API routes
const api = new Hono<AppContext>()

api.get('/health', (c) => {
	return c.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		database: 'connected',
	})
})

api.get('/inventory', async (c) => {
	const location = c.req.query('location')

	let query = 'SELECT * FROM inventory ORDER BY added_at DESC'
	if (location) {
		query = 'SELECT * FROM inventory WHERE location = ? ORDER BY added_at DESC'
	}

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
	const body = await c.req.json()
	const { name, quantity, location, expiry, emoji, theme_color } = body

	if (!name || !quantity || !location || !expiry) {
		return c.json({ error: 'Missing required fields' }, 400)
	}

	const { success } = await c.env.fridge_db
		.prepare(
			'INSERT INTO inventory (name, quantity, location, expiry, emoji, theme_color) VALUES (?, ?, ?, ?, ?, ?)'
		)
		.bind(name, quantity, location, expiry, emoji || null, theme_color || null)
		.run()

	return c.json({ success }, success ? 201 : 500)
})

api.delete('/inventory/:id', async (c) => {
	const id = c.req.param('id')
	const { success } = await c.env.fridge_db.prepare('DELETE FROM inventory WHERE id = ?').bind(id).run()

	return c.json({ success }, success ? 200 : 404)
})

api.patch('/inventory/:id', async (c) => {
	const id = c.req.param('id')
	const body = await c.req.json()
	const { quantity } = body

	if (!quantity) {
		return c.json({ error: 'Missing quantity' }, 400)
	}

	const { success } = await c.env.fridge_db
		.prepare('UPDATE inventory SET quantity = ? WHERE id = ?')
		.bind(quantity, id)
		.run()

	return c.json({ success }, success ? 200 : 404)
})

api.post('/eat/:id', async (c) => {
	const id = c.req.param('id')
	
	const item = await c.env.fridge_db
		.prepare('SELECT location FROM inventory WHERE id = ?')
		.bind(id)
		.first() as { location: string } | null
	
	const location = item?.location || 'fridge'
	
	await c.env.fridge_db
		.prepare('DELETE FROM inventory WHERE id = ?')
		.bind(id)
		.run()

	return c.redirect(`/inventory?location=${location}`)
})

export default api
