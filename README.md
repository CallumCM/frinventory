## Setup DB
- Local DB: `npx wrangler d1 execute fridge-db --local --file=schema.sql`
- Remote DB: `npx wrangler d1 execute fridge-db --remote --file=schema.sql`

## Test App Locally
- `npm run dev`

## Deploy App
- `npx wrangler deploy`