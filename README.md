# Frinventory

A minimalist PWA for tracking fridge inventory with roommates.

## Setup

1. **Initialize the database:**
   ```bash
   wrangler d1 execute fridge-db --local --file=./schema.sql
   ```

2. **Run locally:**
   ```bash
   npm run dev
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

## Features

- Simple name-based authentication (Callum, Raja, Jack)
- Three storage locations: Fridge, Freezer, Pantry
- Quick-add buttons for common items
- Custom item entry with auto-expiry calculation
- PWA support for mobile installation
- Minimalist Times New Roman design

## Usage

- Select your name on first visit
- Switch between Fridge/Freezer/Pantry tabs
- Click "Add Item" to add inventory
- Quick add common items or enter custom format: "Item name, quantity, X days"
