import { Hono } from 'hono'
import type { AppContext } from '../types'
import { Layout } from '../components/layout'
import { HomePage } from '../components/pages'

// Create a new Hono instance for page routes
// The <AppContext> generic provides type safety for c.env bindings
const pages = new Hono<AppContext>()

// Route handlers receive a context object (c) with:
// - c.req: request object (query params, body, headers, etc.)
// - c.env: your Cloudflare bindings (D1, KV, etc.)
// - c.html(): returns HTML response
// - c.json(): returns JSON response
// - c.redirect(): redirects to another URL
pages.get('/', (c) => {
	return c.html(Layout({ title: 'Frinventory', children: HomePage() }))
})

pages.get('/inventory', async (c) => {
	// D1 queries use a prepare/bind/execute pattern:
	// 1. prepare() - create SQL statement
	// 2. bind() - safely bind parameters (prevents SQL injection)
	// 3. all() - execute and get all results
	// 4. first() - execute and get first result only
	// 5. run() - execute without returning results
	const { results } = await c.env.fridge_db
		.prepare('SELECT * FROM inventory ORDER BY added_at DESC')
		.all()

	return c.html(Layout({ title: 'Inventory', children: '' }))
})

pages.get('/users', async (c) => {
	const { results } = await c.env.fridge_db.prepare('SELECT * FROM users').all()

	return c.html(Layout({ title: 'Users', children: '' }))
})

pages.get('/add', async (c) => {
	const { results: users } = await c.env.fridge_db.prepare('SELECT name FROM users').all()

	return c.html(Layout({ title: 'Add Item', children: '' }))
})

pages.post('/add', async (c) => {
	// c.req.formData() parses form submissions (Content-Type: application/x-www-form-urlencoded)
	// For JSON, use c.req.json() instead
	const formData = await c.req.formData()
	const name = formData.get('name')
	const quantity = formData.get('quantity')
	const location = formData.get('location')
	const expiry = formData.get('expiry')
	const added_by = formData.get('added_by')

	// Use bind() to safely insert variables into SQL
	// The ? placeholders are replaced with bound values in order
	// run() executes the query without returning data
	await c.env.fridge_db
		.prepare(
			'INSERT INTO inventory (name, quantity, location, expiry, added_by) VALUES (?, ?, ?, ?, ?)'
		)
		.bind(name, quantity, location, expiry, added_by)
		.run()

	// c.redirect() returns a 302 redirect response
	return c.redirect('/inventory')
})

export default pages
