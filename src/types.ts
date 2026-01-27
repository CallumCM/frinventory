// Resources available to the app
export type Bindings = {
	fridge_db: D1Database
	ASSETS: Fetcher
}

export type AppContext = { Bindings: Bindings }
