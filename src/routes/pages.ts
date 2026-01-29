import { Hono } from 'hono'
import type { AppContext } from '../types'
import { Layout } from '../components/layout'
import { InventoryPage } from '../components/pages'
import foodData from '../../public/foods.json'

const pages = new Hono<AppContext>()

pages.get('/', (c) => {
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
		children: InventoryPage({ items: results as any, location, foodData }) 
	}))
});

export default pages
