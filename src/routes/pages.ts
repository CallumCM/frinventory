import { Hono } from 'hono'
import type { AppContext } from '../types'
import { Layout } from '../components/layout'
import { HomePage, InventoryPage, AddItemPage, UsersPage } from '../components/pages'

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
	// Redirect to inventory page with default location
	return c.redirect('/inventory?location=fridge')
})

pages.get('/inventory', async (c) => {
	const location = (c.req.query('location') || 'fridge') as 'fridge' | 'freezer' | 'pantry'
	
	if (!['fridge', 'freezer', 'pantry'].includes(location)) {
		return c.redirect('/inventory?location=fridge')
	}
	
	// D1 queries are prepared, then bound to parameters (to prevent SQL injection n stuff), then executed
	// .all() returns all results, .first() returns first result only
	const { results } = await c.env.fridge_db
		.prepare('SELECT * FROM inventory WHERE location = ? ORDER BY expiry ASC')
		.bind(location)
		.all()

	return c.html(Layout({ 
		title: `${location.charAt(0).toUpperCase() + location.slice(1)} - Frinventory`, 
		children: InventoryPage({ items: results as any, location }) 
	}))
})

pages.get('/users', async (c) => {
	const { results } = await c.env.fridge_db.prepare('SELECT * FROM users').all()

	return c.html(Layout({ title: 'Users', children: UsersPage({ users: results as any }) }))
})

pages.get('/add', async (c) => {
	const { results: users } = await c.env.fridge_db.prepare('SELECT * FROM users').all()

	return c.html(Layout({ title: 'Add Item', children: AddItemPage({ users: users as any }) }))
})

pages.post('/add', async (c) => {
	const formData = await c.req.formData()
	const name = formData.get('name')
	const quantity = formData.get('quantity')
	const location = formData.get('location')
	const expiry = formData.get('expiry')
	const added_by = formData.get('added_by')

	await c.env.fridge_db
		.prepare(
			'INSERT INTO inventory (name, quantity, location, expiry, added_by) VALUES (?, ?, ?, ?, ?)'
		)
		.bind(name, quantity, location, expiry, added_by)
		.run()

	return c.redirect(`/inventory?location=${location}`)
})

export default pages
