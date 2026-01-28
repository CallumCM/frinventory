import { html } from 'hono/html'

interface InventoryItem {
  id: number
  name: string
  quantity: string
  location: 'fridge' | 'freezer' | 'pantry'
  expiry: string
  added_at: string
}

interface User {
  id: number
  name: string
  created_at: string
}

const getDaysUntilExpiry = (expiryTime: number): number => {
  console.log('Expiry time:', expiryTime);
  const diffTime = expiryTime - Date.now()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getExpiryColor = (days: number): string => {
  if (days <= 0) return 'text-lychee-'
  if (days <= 3) return 'text-lychee-6'
  if (days <= 7) return 'text-pistachio-2'
  return 'text-pistachio-6'
}

export const InventoryPage = (props: {
  items: InventoryItem[],
  location: 'fridge' | 'freezer' | 'pantry'
}) => {
  const { items, location } = props

  const locationEmoji = {
    fridge: '🧊',
    freezer: '❄️',
    pantry: '🗄️'
  }

  const tabs = ['fridge', 'freezer', 'pantry'] as const

  return html`
<script>var foodLocation = "${location}";</script>
<script type="module" src="/public/script.js"></script>
<div class="font-serif min-h-screen bg-infinity-1 text-white pb-24">

  <!-- TITLE -->
  <header class="text-center pt-6 mb-3">
    <h1 class="text-3xl font-bold">Frinventory</h1>
  </header>

  <!-- TABS -->
  <div class="flex justify-center mb-6">
    ${tabs.map((tab, i) => {
const isActive = tab === location
const isFirst = i === 0
const isLast = i === tabs.length - 1
const roundedClass = isFirst ? 'rounded-l-full' : isLast ? 'rounded-r-full' : ''
const activeClass = isActive
  ? 'bg-infinity-4 text-white border-infinity-5'
  : 'bg-infinity-2 text-infinity-4 border-infinity-3 hover:bg-infinity-3'
const borderClass = isFirst ? 'border-2' : isLast ? 'border-2' : 'border-y-2'

return html`
        <a href="/inventory?location=${tab}" 
            class="px-5 py-3 font-medium capitalize ${roundedClass} ${activeClass} ${borderClass}">
          ${tab}
        </a>
      `
})}
        </div>

        <!-- ADD NEW FOOD -->
        <div class="text-center mb-12">
          <button id="open-add-food-modal"
            class="px-12 py-3 bg-infinity-5 hover:bg-infinity-6 text-white font-bold text-lg rounded-full transition-colors">
            Add Item
          </button>
        </div>

        <!-- ADD NEW FOOD MODAL -->
        <div id="add-food-modal" class="hidden fixed top-0 left-0 w-full h-full inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div class="bg-infinity-2 rounded-2xl p-6 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">Add New Food Item</h2>

            <div class="space-y-4">

              <!-- Name + Quantity -->
              <input id="food-name" type="text" name="name" placeholder="Name" required
              class="w-full px-3 py-3 bg-infinity-1 border border-infinity-3 rounded-lg text-white focus:outline-none focus:border-infinity-5">
              <input id="food-quantity" type="text" name="quantity" placeholder="Quantity" required
              class="w-full px-3 py-3 bg-infinity-1 border border-infinity-3 rounded-lg text-white focus:outline-none focus:border-infinity-5">
              
              <!-- Submit + Cancel Buttons -->
              <button id="submit-add-food"
                class="w-full py-3 bg-infinity-5 hover:bg-infinity-6 text-white font-bold rounded-lg transition-colors">
                Add to Inventory
              </button>
              <button type="button" id="close-add-food-modal"
                class="w-full py-3 bg-lychee-3 hover:bg-lychee-4 text-white font-bold rounded-lg transition-colors">
                Cancel
              </button>
            </div>

          </div>
        </div>

        <!-- INVENTORY -->
        <div class="mx-auto">
    ${items.length === 0 ? html`
      <div class="text-center">
        <p class="text-6xl mb-3">${locationEmoji[location]}</p>
        <p class="text-infinity-3 text-lg">Your ${location} is empty</p>
      </div>
    ` : html`
      <div class="grid grid-cols-3 gap-3 px-3">
        ${items.map(item => {
const days = getDaysUntilExpiry(item.expiry)
const expiryColor = getExpiryColor(days)
const daysText = days <= 0 ? 'Expired 🤮' : days === 1 ? '1 day' : `${days} days`

return html`
            <div class="bg-infinity-6 rounded-2xl p-3 border border-infinity-3">
              <div class="flex items-center gap-1 mb-3 ${expiryColor}">
                <span class="text-sm font-medium">${daysText}</span>
              </div>
              
              <p class="font-medium text-white truncate">${item.name}</p>
              <p class="text-sm text-infinity-3">${item.quantity}</p>
              
              <form action="/api/eat/${item.id}" method="POST" class="mt-3">
                <button type="submit" 
                        class="w-full py-1.5 bg-infinity-5 hover:bg-infinity-6 text-white text-sm font-medium rounded-lg transition-colors">
                  Eat
                </button>
              </form>
            </div>
          `
})}
      </div>
    `}
  </div>
</div>
  `;
}

/*export const _InventoryPage = (props: { 
  items: InventoryItem[], 
  location: 'fridge' | 'freezer' | 'pantry' 
}) => {
  const { items, location } = props
  
  const locationEmoji = {
    fridge: '🧊',
    freezer: '❄️',
    pantry: '🗄️'
  }

  const tabs = ['fridge', 'freezer', 'pantry'] as const
  
  return html`
    <div class="font-serif min-h-screen bg-slate-900 text-slate-100 pb-24">
      <div class="max-w-md mx-auto px-3 py-6">
        <header class="text-center mb-6">
          <h1 class="text-3xl font-bold text-cyan-400">Frinventory</h1>
        </header>

        <div class="flex justify-center mb-6">
          ${tabs.map((tab, i) => {
            const isActive = tab === location
            const isFirst = i === 0
            const isLast = i === tabs.length - 1
            const roundedClass = isFirst ? 'rounded-l-full' : isLast ? 'rounded-r-full' : ''
            const activeClass = isActive 
              ? 'bg-cyan-600 text-white border-cyan-500' 
              : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
            const borderClass = isFirst ? 'border-2' : isLast ? 'border-2' : 'border-y-2'
            
            return html`
              <a href="/inventory?location=${tab}" 
                 class="px-5 py-3 font-medium capitalize ${roundedClass} ${activeClass} ${borderClass}">
                ${tab}
              </a>
            `
          })}
        </div>

        ${items.length === 0 ? html`
          <div class="text-center py-16">
            <p class="text-6xl mb-3">${locationEmoji[location]}</p>
            <p class="text-slate-400 text-lg">Your ${location} is empty</p>
            <p class="text-slate-500 text-sm mt-2">Add items to start tracking</p>
          </div>
        ` : html`
          <div class="grid grid-cols-2 gap-4">
            ${items.map(item => {
              const days = getDaysUntilExpiry(item.expiry)
              const expiryColor = getExpiryColor(days)
              const emoji = getFoodEmoji(item.name)
              const daysText = days <= 0 ? 'Expired!' : days === 1 ? '1 day' : `${days} days`
              
              return html`
                <div class="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                  <div class="flex items-center gap-1 mb-2 ${expiryColor}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke-width="2"/>
                      <path stroke-width="2" d="M12 6v6l4 2"/>
                    </svg>
                    <span class="text-sm font-medium">${daysText}</span>
                  </div>
                  
                  <div class="text-5xl text-center my-3">
                    ${emoji}
                  </div>
                  
                  <p class="text-center font-medium text-slate-100 truncate">${item.name}</p>
                  <p class="text-center text-xs text-slate-400">${item.quantity}</p>
                  
                  <form action="/api/eat/${item.id}" method="POST" class="mt-3">
                    <button type="submit" 
                            class="w-full py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition-colors">
                      Eat
                    </button>
                  </form>
                </div>
              `
            })}
          </div>
        `}

        <a href="/add" 
           class="fixed bottom-6 left-1/2 -translate-x-1/2 px-12 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg rounded-full transition-colors">
          Add Item
        </a>
      </div>
    </div>
  `
}

// Add item form page
export const AddItemPage = (props: { users: User[] }) => {
  const { users } = props
  
  // Default expiry to 7 days from now
  const defaultExpiry = new Date()
  defaultExpiry.setDate(defaultExpiry.getDate() + 7)
  const defaultExpiryStr = defaultExpiry.toISOString().split('T')[0]
  
  return html`
    <div class="font-serif min-h-screen bg-slate-900 text-slate-100">
      <div class="max-w-md mx-auto px-3 py-6">
        <header class="flex items-center gap-4 mb-8">
          <a href="/inventory" class="text-slate-400 hover:text-slate-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </a>
          <h1 class="text-2xl font-bold text-cyan-400">Add Item</h1>
        </header>

        <form action="/add" method="POST" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
              Item Name
            </label>
            <input type="text" id="name" name="name" required
                   placeholder="e.g. Sour Cream"
                   class="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
          </div>

          <div>
            <label for="quantity" class="block text-sm font-medium text-slate-300 mb-2">
              Quantity
            </label>
            <input type="text" id="quantity" name="quantity" required
                   placeholder="e.g. 1 container, 500g, 2 lbs"
                   class="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Location
            </label>
            <div class="flex gap-3">
              <label class="flex-1">
                <input type="radio" name="location" value="fridge" checked class="peer hidden">
                <div class="py-3 text-center rounded-xl border-2 border-slate-600 bg-slate-800 cursor-pointer peer-checked:border-cyan-500 peer-checked:bg-cyan-900/30 transition-colors">
                  🧊 Fridge
                </div>
              </label>
              <label class="flex-1">
                <input type="radio" name="location" value="freezer" class="peer hidden">
                <div class="py-3 text-center rounded-xl border-2 border-slate-600 bg-slate-800 cursor-pointer peer-checked:border-cyan-500 peer-checked:bg-cyan-900/30 transition-colors">
                  ❄️ Freezer
                </div>
              </label>
              <label class="flex-1">
                <input type="radio" name="location" value="pantry" class="peer hidden">
                <div class="py-3 text-center rounded-xl border-2 border-slate-600 bg-slate-800 cursor-pointer peer-checked:border-cyan-500 peer-checked:bg-cyan-900/30 transition-colors">
                  🗄️ Pantry
                </div>
              </label>
            </div>
          </div>

          <div>
            <label for="expiry" class="block text-sm font-medium text-slate-300 mb-2">
              Expiry Date
            </label>
            <input type="date" id="expiry" name="expiry" required
                   value="${defaultExpiryStr}"
                   class="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
          </div>

          <button type="submit" 
                  class="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg rounded-xl transition-colors">
            Add to Inventory
          </button>
        </form>
      </div>
    </div>
  `
}

export const UsersPage = (props: { users: User[] }) => {
  const { users } = props
  
  return html`
    <div class="font-serif min-h-screen bg-slate-900 text-slate-100">
      <div class="max-w-md mx-auto px-3 py-6">
        <header class="flex items-center gap-4 mb-8">
          <a href="/inventory" class="text-slate-400 hover:text-slate-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </a>
          <h1 class="text-2xl font-bold text-cyan-400">Users</h1>
        </header>

        <div class="space-y-3">
          ${users.map(user => html`
            <div class="flex items-center gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
              <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                ${user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p class="font-medium text-slate-100">${user.name}</p>
                <p class="text-sm text-slate-400">Joined ${new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          `)}
        </div>
      </div>
    </div>
  `
}*/