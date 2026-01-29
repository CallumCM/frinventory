// I'm such a silly little guy
const DEBUG = false;
const oldConsoleLog = console.log;
console.log = function(...args) {
  if (DEBUG) {
    oldConsoleLog.apply(console, args);
  }
};

const addFoodModal = document.getElementById('add-food-modal');
const openAddFoodModalButton = document.getElementById('open-add-food-modal');
const addFoodModalButton = document.getElementById('submit-add-food');
const closeAddFoodModalButton = document.getElementById('close-add-food-modal');

console.log('Script loaded. foodDatabase available:', typeof foodDatabase !== 'undefined', 'Items:', typeof foodDatabase !== 'undefined' ? foodDatabase.length : 0);

const updateQuantityModal = document.getElementById('update-quantity-modal');
const submitUpdateQuantityButton = document.getElementById('submit-update-quantity');
const closeUpdateQuantityModalButton = document.getElementById('close-update-quantity-modal');
const updateItemNameDisplay = document.getElementById('update-item-name');
const newQuantityInput = document.getElementById('new-quantity');

// Food search elements
const foodSearchInput = document.getElementById('food-search');
const foodDropdown = document.getElementById('food-dropdown');
const selectedFoodDisplay = document.getElementById('selected-food-display');
const selectedFoodEmoji = document.getElementById('selected-food-emoji');
const selectedFoodName = document.getElementById('selected-food-name');
const selectedFoodSubtitle = document.getElementById('selected-food-subtitle');
const clearFoodSelectionButton = document.getElementById('clear-food-selection');
const storageWarning = document.getElementById('storage-warning');
const storageWarningText = document.getElementById('storage-warning-text');
const foodNameInput = document.getElementById('food-name');
const foodExpiryInput = document.getElementById('food-expiry');
const expiryInfo = document.getElementById('expiry-info');

let currentUpdateItemId = null;
let selectedFood = null;

console.log('Food search input element:', foodSearchInput);
console.log('Food dropdown element:', foodDropdown);

// Food search functionality
if (foodSearchInput && typeof foodDatabase !== 'undefined') {
  console.log('Attaching food search event listener');
  foodSearchInput.addEventListener('input', (e) => {
    console.log('Search input event fired, value:', e.target.value);
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm.length === 0) {
      foodDropdown.innerHTML = `
        <div class="px-4 py-3 text-center text-infinity-4 text-sm">
          Start typing to search for foods in the database...
        </div>
      `;
      foodDropdown.style.display = 'block';
      return;
    }
    
    if (searchTerm.length < 2) {
      foodDropdown.innerHTML = `
        <div class="px-4 py-3 text-center text-infinity-4 text-sm">
          Type at least 2 characters to search...
        </div>
      `;
      foodDropdown.style.display = 'block';
      return;
    }

    console.log('Searching for:', searchTerm);
    const matches = foodDatabase.filter(food => {
      const nameMatch = food.name.toLowerCase().includes(searchTerm);
      const keywordsMatch = food.keywords.toLowerCase().includes(searchTerm);
      const subtitleMatch = food.subtitle?.toLowerCase().includes(searchTerm);
      return nameMatch || keywordsMatch || subtitleMatch;
    }).slice(0, 10);

    console.log('Found matches:', matches.length, matches.map(f => f.name));

    if (matches.length === 0) {
      foodDropdown.innerHTML = `
        <div class="food-option px-4 py-2 hover:bg-infinity-3 cursor-pointer border-b border-infinity-4" data-food-id="custom">
          <span class="text-xl mr-2">✏️</span>
          <span class="font-medium">Custom Food</span>
          <span class="text-xs text-infinity-4 ml-1">- Create your own</span>
        </div>
        <div class="px-4 py-3 text-center text-infinity-4 text-sm">
          No foods found matching "${searchTerm}"
        </div>
      `;
      foodDropdown.style.display = 'block';
      
      // Add click handler for custom food
      document.querySelector('.food-option[data-food-id="custom"]')?.addEventListener('click', () => {
        selectCustomFood();
      });
      return;
    }

    foodDropdown.innerHTML = `
      <div class="food-option px-4 py-2 hover:bg-infinity-3 cursor-pointer border-b border-infinity-4" data-food-id="custom">
        <span class="text-xl mr-2">✏️</span>
        <span class="font-medium">Custom Food</span>
        <span class="text-xs text-infinity-4 ml-1">- Create your own</span>
      </div>
    ` + matches.map(food => `
    <div class="food-option px-4 py-2 hover:bg-infinity-3 cursor-pointer border-b border-infinity-4" data-food-id="${food.id}">
      <span class="text-xl mr-2">${food.emoji}</span>
      <span class="font-medium">${food.name}</span>
      ${food.subtitle ? `<span class="text-xs text-infinity-4 ml-1">- ${food.subtitle}</span>` : ''}
    </div>
  `).join('');

  console.log('Showing dropdown, setting display block');
  foodDropdown.style.display = 'block';

  // Add click handlers to options
  document.querySelectorAll('.food-option').forEach(option => {
    option.addEventListener('click', () => {
      const foodId = option.getAttribute('data-food-id');
      if (foodId === 'custom') {
        selectCustomFood();
      } else {
        selectFood(parseInt(foodId));
      }
    });
  });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!foodSearchInput.contains(e.target) && !foodDropdown.contains(e.target)) {
      foodDropdown.style.display = 'none';
    }
  });
}

function selectCustomFood() {
  selectedFood = { custom: true };
  
  // Update display
  selectedFoodDisplay.style.display = 'block';
  selectedFoodEmoji.textContent = '✏️';
  selectedFoodName.textContent = 'Custom Food';
  selectedFoodSubtitle.textContent = 'Enter details below';
  
  foodSearchInput.value = '';
  foodDropdown.style.display = 'none';

  // Show custom food fields
  document.getElementById('custom-food-fields').style.display = 'block';
  document.getElementById('food-expiry-container').style.display = 'block';
  
  storageWarning.style.display = 'none';
  expiryInfo.style.display = 'none';
  setDefaultExpiry();
}

function selectFood(foodId) {
  selectedFood = foodDatabase.find(f => f.id === foodId);
  if (!selectedFood) return;

  // Update display
  selectedFoodEmoji.textContent = selectedFood.emoji;
  selectedFoodName.textContent = selectedFood.name;
  selectedFoodSubtitle.textContent = selectedFood.subtitle || '';
  
  selectedFoodDisplay.style.display = 'block';
  foodSearchInput.value = '';
  foodDropdown.style.display = 'none';

  // Hide custom food fields for database foods
  document.getElementById('custom-food-fields').style.display = 'none';
  
  // Show expiry container so user can see auto-calculated date and warnings
  document.getElementById('food-expiry-container').style.display = 'block';

  // Clear custom name field - user can override if they want
  foodNameInput.value = '';

  // Check storage location and set expiry
  checkStorageAndSetExpiry();
}

function checkStorageAndSetExpiry() {
  if (!selectedFood) return;

  console.log('Checking storage for:', selectedFood.name, 'in', foodLocation);
  console.log('Storage data:', selectedFood.storage);
  const storage = selectedFood.storage[foodLocation];
  console.log('Storage for location:', storage);
  
  if (!storage) {
    // No data for this location
    console.log('No storage data for this location');
    storageWarning.style.display = 'none';
    setDefaultExpiry();
    return;
  }

  if (!storage.recommended) {
    // Not recommended for this location
    console.log('Food not recommended for this location!');
    const recommendedLocations = Object.keys(selectedFood.storage)
      .filter(loc => selectedFood.storage[loc].recommended)
      .join(', ');
    
    console.log('Recommended locations:', recommendedLocations);
    storageWarningText.textContent = `This food is not recommended for ${foodLocation}. Try: ${recommendedLocations}`;
    console.log('Setting warning display to block');
    console.log('Warning element:', storageWarning);
    storageWarning.style.display = 'block';
    
    if (storage.expires_after) {
      setExpiryDate(storage.expires_after);
    } else {
      setDefaultExpiry();
    }
  } else {
    // Recommended location
    storageWarning.style.display = 'none';
    
    if (storage.expires_after) {
      setExpiryDate(storage.expires_after);
    } else {
      setDefaultExpiry();
    }
  }
}

function setExpiryDate(daysUntilExpiry) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry);
  foodExpiryInput.value = expiryDate.toISOString().split('T')[0];
  
  expiryInfo.textContent = `Based on food database: ${daysUntilExpiry} days in ${foodLocation}`;
  expiryInfo.style.display = 'block';
}

function setDefaultExpiry() {
  if (!foodExpiryInput || !expiryInfo) return;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  foodExpiryInput.value = expiryDate.toISOString().split('T')[0];
  
  expiryInfo.textContent = 'Default: 7 days';
  expiryInfo.style.display = 'block';
}

if (clearFoodSelectionButton) {
  clearFoodSelectionButton.addEventListener('click', () => {
    selectedFood = null;
    selectedFoodDisplay.style.display = 'none';
    storageWarning.style.display = 'none';
    expiryInfo.style.display = 'none';
    foodNameInput.value = '';
    setDefaultExpiry();
  });
}

// Add Food Modal
openAddFoodModalButton.addEventListener('click', () => {
  addFoodModal.style.display = 'flex';
  // Reset form
  selectedFood = null;
  selectedFoodDisplay.style.display = 'none';
  storageWarning.style.display = 'none';
  expiryInfo.style.display = 'none';
  foodNameInput.value = '';
  document.getElementById('food-quantity').value = '';
  foodSearchInput.value = '';
  
  // Hide custom fields by default
  document.getElementById('custom-food-fields').style.display = 'none';
  document.getElementById('food-expiry-container').style.display = 'none';
  
  setDefaultExpiry();
  
  // Show dropdown with initial message
  foodDropdown.innerHTML = `
    <div class="px-4 py-3 text-center text-infinity-4 text-sm">
      Start typing to search for foods in the database...
    </div>
  `;
  foodDropdown.style.display = 'block';
});

closeAddFoodModalButton.addEventListener('click', () => {
  addFoodModal.style.display = 'none';
});

addFoodModalButton.addEventListener('click', () => {
  const customName = document.getElementById('food-name').value.trim();
  const quantity = document.getElementById('food-quantity').value;
  const expiryDateStr = foodExpiryInput.value;

  // Determine food name: custom name if provided, otherwise from selectedFood
  let name = customName;
  if (!name && selectedFood) {
    name = selectedFood.custom ? 'Unnamed Food' : selectedFood.name + (selectedFood.subtitle ? ` (${selectedFood.subtitle})` : '');
  }

  if (!name || !quantity || !foodLocation || !expiryDateStr) {
    alert('Please fill in all fields');
    return;
  }

  // Convert date string to timestamp
  const expiry = new Date(expiryDateStr).getTime();

  const payload = { 
    name, 
    quantity, 
    location: foodLocation, 
    expiry 
  };

  // Add food metadata if a food was selected
  if (selectedFood && selectedFood.custom) {
    // Custom food - get values from custom fields
    payload.emoji = document.getElementById('custom-emoji').value || '🍽️';
    payload.theme_color = document.getElementById('custom-color').value || '#c0c0c0';
  } else if (selectedFood) {
    // Database food
    payload.emoji = selectedFood.emoji;
    payload.theme_color = selectedFood['theme-color'];
    payload.food_id = selectedFood.id;
  }

  fetch('/api/inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        addFoodModal.style.display = 'none';
        window.location.reload();
      } else {
        alert('Failed to add food item');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred');
    });
});

closeUpdateQuantityModalButton.addEventListener('click', () => {
  updateQuantityModal.style.display = 'none';
  currentUpdateItemId = null;
});

submitUpdateQuantityButton.addEventListener('click', () => {
  const newQuantity = newQuantityInput.value;

  if (!newQuantity) {
    alert('Please enter a quantity');
    return;
  }

  if (!currentUpdateItemId) {
    alert('No item selected');
    return;
  }

  fetch(`/api/inventory/${currentUpdateItemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity: newQuantity }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        updateQuantityModal.style.display = 'none';
        window.location.reload();
      } else {
        alert('Failed to update quantity');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred');
    });
});

document.querySelectorAll('.eat-button').forEach(button => {
  button.addEventListener('click', () => {
    const itemId = button.getAttribute('data-id');
    const itemName = button.getAttribute('data-name');
    const currentQuantity = button.getAttribute('data-quantity');
    
    currentUpdateItemId = itemId;
    updateItemNameDisplay.textContent = `${itemName} (currently: ${currentQuantity})`;
    newQuantityInput.value = '';
    updateQuantityModal.style.display = 'flex';
  });
});

document.querySelectorAll('.eat-all-button').forEach(button => {
  button.addEventListener('click', () => {
    const itemId = button.getAttribute('data-id');
    const location = button.getAttribute('data-location');
    
    if (!confirm('Are you sure you want to eat all of this item?')) {
      return;
    }

    fetch(`/api/inventory/${itemId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          window.location.href = `/inventory?location=${location}`;
        } else {
          alert('Failed to delete item');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred');
      });
  });
});