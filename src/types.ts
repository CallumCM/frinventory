// Bindings are Cloudflare Worker resources made available to your Hono app
// These are defined in wrangler.jsonc and automatically injected at runtime
export type Bindings = {
	// D1Database is Cloudflare's SQL database - accessed via c.env.fridge_db
	fridge_db: D1Database
	// ASSETS is the static files binding for your public/ directory
	ASSETS: Fetcher
}

// AppContext tells Hono what types to expect in the context (c) object
// This enables TypeScript autocomplete for c.env.fridge_db, etc.
export type AppContext = { Bindings: Bindings }
