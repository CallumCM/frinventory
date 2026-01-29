import { html, raw } from 'hono/html'

interface InventoryItem {
  id: number
  name: string
  quantity: string
  location: 'fridge' | 'freezer' | 'pantry'
  expiry: number
  added_at: string
  emoji?: string
  theme_color?: string
  food_id?: number
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

export const InventoryPage = (props: {
  items: InventoryItem[],
  location: 'fridge' | 'freezer' | 'pantry',
  foodData: any[]
}) => {
  const { items, location, foodData } = props

  const locationEmoji = {
    fridge: '🧊',
    freezer: '❄️',
    pantry: '🗄️'
  }

  const tabs = ['fridge', 'freezer', 'pantry'] as const

  return html`
<script>var foodLocation = "${location}";</script>
<script>var foodDatabase = ${raw(JSON.stringify(foodData))};</script>
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
        <div id="add-food-modal" class="hidden fixed top-0 left-0 w-full h-full inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div class="bg-infinity-2 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 class="text-xl font-bold mb-4">Add New Food Item</h2>

            <div class="space-y-4">

              <!-- Food Search Dropdown -->
              <div class="relative">
                <input id="food-search" type="text" placeholder="Search for food..." autocomplete="off"
                  class="font-serif w-full px-3 py-3 bg-infinity-1 border border-infinity-3 rounded-lg text-white focus:outline-none focus:border-infinity-5">
                <div id="food-dropdown" class="font-serif hidden absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-infinity-1 border border-infinity-3 rounded-lg shadow-lg">
                </div>
              </div>
              <div id="selected-food-display" class="hidden p-3 bg-infinity-3 rounded-lg">
                <div class="flex items-center gap-3">
                  <span id="selected-food-emoji" class="text-3xl"></span>
                  <div class="flex-1">
                    <div id="selected-food-name" class="font-medium"></div>
                    <div id="selected-food-subtitle" class="text-sm text-infinity-4"></div>
                  </div>
                  <button id="clear-food-selection" type="button" class="text-lychee-4 hover:text-lychee-5">
                    ✕
                  </button>
                </div>
              </div>
              <div id="storage-warning" style="display: none;" class="p-3 bg-lychee-3 rounded-lg text-sm">
                ⚠️ <span id="storage-warning-text"></span>
              </div>

              <!-- Custom Name (Optional) -->
              <input id="food-name" type="text" name="name" placeholder="Custom Name (optional)"
              class="font-serif w-full px-3 py-3 bg-infinity-1 border border-infinity-3 rounded-lg text-white focus:outline-none focus:border-infinity-5">
              
              <!-- Customization Fields (always visible) -->
              <div id="custom-food-fields" class="space-y-3">
                <div>
                  <label class="block text-sm text-infinity-4 mb-1">Emoji</label>
                  <input id="custom-emoji" type="text" placeholder="🍽️" maxlength="10"
                  class="font-serif w-full px-3 py-3 bg-infinity-1 border border-infinity-3 rounded-lg text-white focus:outline-none focus:border-infinity-5">
                </div>
                <div>
                  <label class="block text-sm text-infinity-4 mb-1">Theme Color</label>
                  <input id="custom-color" type="color" value="#c0c0c0"
                  class="w-full h-12 px-2 py-1 bg-infinity-1 border border-infinity-3 rounded-lg cursor-pointer">
                </div>
              </div>
              
              <input id="food-quantity" type="text" name="quantity" placeholder="Quantity" required
              class="font-serif w-full px-3 py-3 bg-infinity-1 border border-infinity-3 rounded-lg text-white focus:outline-none focus:border-infinity-5">
              
              <!-- Expiry Date (auto-filled if food selected) -->
              <div id="food-expiry-container" style="display: none;">
                <label class="block text-sm text-infinity-4 mb-1">Expiration Date</label>
                <input id="food-expiry" type="date" name="expiry"
                  class="font-serif w-full px-3 py-3 bg-infinity-1 border border-infinity-3 rounded-lg text-white focus:outline-none focus:border-infinity-5">
                <div id="expiry-info" class="hidden mt-1 text-xs text-infinity-4"></div>
              </div>
              
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

        <!-- UPDATE QUANTITY MODAL -->
        <div id="update-quantity-modal" class="hidden fixed top-0 left-0 w-full h-full inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div class="bg-infinity-2 rounded-2xl p-6 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">Update Quantity</h2>
            <p class="text-infinity-3 mb-4" id="update-item-name"></p>

            <div class="space-y-4">
              <input id="new-quantity" type="text" name="quantity" placeholder="New Quantity" required
              class="w-full px-3 py-3 bg-infinity-1 border border-infinity-3 rounded-lg text-white focus:outline-none focus:border-infinity-5">
              
              <button id="submit-update-quantity"
                class="w-full py-3 bg-infinity-5 hover:bg-infinity-6 text-white font-bold rounded-lg transition-colors">
                Update Quantity
              </button>
              <button type="button" id="close-update-quantity-modal"
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
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 px-3">
        ${items.map(item => {
const days = getDaysUntilExpiry(item.expiry)
let daysText = '';
let expiryColor = '';

/*
const getExpiryColor = (days: number): string => {
  if (days <= 0) return 'text-lychee-'
  if (days <= 3) return 'text-lychee-6'
  if (days <= 7) return 'text-pistachio-4'
  return 'text-pistachio-6'
}
*/

if (days > 365) {
  const years = Math.floor(days / 365);
  daysText = years === 1 ? '1 year' : `${years} years`;
  expiryColor = 'text-pistachio-6';

} else if (days > 30) {
  const months = Math.floor(days / 30);
  daysText = months === 1 ? '1 month' : `${months} months`;
  expiryColor = 'text-pistachio-6';
} else if (days >= 7) {
  const weeks = Math.floor(days / 7);
  daysText = weeks === 1 ? '1 week' : `${weeks} weeks and ${days % 7} days`;
  expiryColor = 'text-pistachio-5';
} else if (days > 1) {
  daysText = `${days} days`;
  expiryColor = 'text-pistachio-4';
} else if (days > 0) {
  daysText = 'Tomorrow';
  expiryColor = 'text-lychee-6';
} else if (days === 0) {
  daysText = 'Expires today';
  expiryColor = 'text-lychee-4';
} else {
  daysText = `${Math.abs(days)} days ago`;
  expiryColor = 'text-lychee-3';
}

const emoji = item.emoji || '🍽️'
const themeColor = item.theme_color || '#c0c0c0'

return html`
            <div class="rounded-2xl p-3 border border-white border-opacity-20 relative overflow-hidden" style="background-color: ${themeColor}">
              
              <div class="relative z-10">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-1 px-2 py-1 rounded ${expiryColor} bg-black bg-opacity-60">
                    <span class="text-sm font-medium">${daysText}</span>
                  </div>
                  <span class="text-2xl">${emoji}</span>
                </div>
                
                <div class="bg-black bg-opacity-60 rounded-lg p-2 mb-2">
                  <p class="font-medium text-white truncate">${item.name}</p>
                  <p class="text-sm text-gray-200">Quantity: ${item.quantity}</p>
                </div>
                
                <div class="flex gap-2">
                  <button class="eat-button flex-1 py-1.5 bg-infinity-5 hover:bg-infinity-6 text-white text-sm font-medium rounded-lg transition-colors"
                          data-id="${item.id}" data-name="${item.name}" data-quantity="${item.quantity}">
                    Eat
                  </button>
                  <button class="eat-all-button flex-1 py-1.5 bg-lychee-4 hover:bg-lychee-5 text-white text-sm font-medium rounded-lg transition-colors"
                          data-id="${item.id}" data-location="${item.location}">
                    Eat All
                  </button>
                </div>
              </div>
            </div>
          `
})}
      </div>
    `}
  </div>
</div>
  `;
}