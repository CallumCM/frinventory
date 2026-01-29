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
      <div class="food-option px-4 py-2 hover:bg-infinity-3 cursor-pointer border-b border-infinity-4" data-food-key="custom">
        <span class="cursor-pointer text-xl mr-2">✏️</span>
        <span class="cursor-pointer font-medium">Custom Food</span>
        <span class="cursor-pointer text-xs text-infinity-4 ml-1">- Create your own</span>
      </div>
    ` + matches.map(food => `
    <div class="food-option px-4 py-2 hover:bg-infinity-3 cursor-pointer border-b border-infinity-4" data-food-key="${food.name}|||${food.subtitle || ''}">
      <span class="cursor-pointer text-xl mr-2">${food.emoji}</span>
      <span class="cursor-pointer font-medium">${food.name}</span>
      ${food.subtitle ? `<span class="cursor-pointer text-xs text-infinity-4 ml-1">- ${food.subtitle}</span>` : ''}
    </div>
  `).join('');

  console.log('Showing dropdown, setting display block');
  foodDropdown.style.display = 'block';

  // Add click handlers to options
  document.querySelectorAll('.food-option').forEach(option => {
    option.addEventListener('click', () => {
      const foodKey = option.getAttribute('data-food-key');
      if (foodKey === 'custom') {
        selectCustomFood();
      } else {
        selectFood(foodKey);
      }
    });
  });
  });

  // Close dropdown when clicking outside since we fancy like that
  document.addEventListener('click', (e) => {
    if (!foodSearchInput.contains(e.target) && !foodDropdown.contains(e.target)) {
      foodDropdown.style.display = 'none';
    }
  });
}

function selectCustomFood() {
  selectedFood = { custom: true };
  
  selectedFoodDisplay.style.display = 'block';
  selectedFoodEmoji.textContent = '✏️';
  selectedFoodName.textContent = 'Custom Food';
  selectedFoodSubtitle.textContent = 'Enter details below';
  
  foodSearchInput.value = '';
  foodDropdown.style.display = 'none';

  document.getElementById('food-expiry-container').style.display = 'block';
  
  storageWarning.style.display = 'none';
  expiryInfo.style.display = 'none';
  setDefaultExpiry();
}

function selectFood(foodKey) {
  const [name, subtitle] = foodKey.split('|||');
  selectedFood = foodDatabase.find(f => f.name === name && (f.subtitle || '') === subtitle);
  if (!selectedFood) return;

  selectedFoodEmoji.textContent = selectedFood.emoji;
  selectedFoodName.textContent = selectedFood.name;
  selectedFoodSubtitle.textContent = selectedFood.subtitle || '';
  
  selectedFoodDisplay.style.display = 'block';
  foodSearchInput.value = '';
  foodDropdown.style.display = 'none';

  // Pre-fill customization fields
  const customEmojiInput = document.getElementById('custom-emoji');
  const customColorInput = document.getElementById('custom-color');
  if (customEmojiInput) customEmojiInput.value = selectedFood.emoji || '🍽️';
  if (customColorInput) customColorInput.value = selectedFood['theme-color'] || selectedFood.theme_color || '#c0c0c0';
  
  document.getElementById('food-expiry-container').style.display = 'block';

  foodNameInput.value = '';

  checkStorageAndSetExpiry();
}

function checkStorageAndSetExpiry() {
  if (!selectedFood) return;

  console.log('Checking storage for:', selectedFood.name, 'in', foodLocation);
  console.log('Storage data:', selectedFood.storage);
  const storage = selectedFood.storage?.[foodLocation];
  console.log('Storage for location:', storage);
  
  // Milk don't go in the pantry
  const isRecommended = storage?.recommended === true;

  if (!isRecommended) {
    console.log('Food not recommended for this location!');
    const recommendedLocations = Object.keys(selectedFood.storage)
      .filter(loc => selectedFood.storage[loc].recommended)
      .join(' or the ');
    
    console.log('Recommended locations:', recommendedLocations);
    storageWarningText.textContent = `It is not recommended to store ${selectedFood.name} in the ${foodLocation}. Please store it in the ${recommendedLocations} instead`;
    console.log('Setting warning display to block');
    console.log('Warning element:', storageWarning);
    storageWarning.style.display = 'block';
    
    setUnsafeExpiry();
  } else {
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

function setUnsafeExpiry() {
  if (!foodExpiryInput || !expiryInfo) return;

  // Expires "today" due to unsafe storage
  const expiryDate = new Date();
  foodExpiryInput.value = expiryDate.toISOString().split('T')[0];
  
  expiryInfo.textContent = 'Unsafely stored food defaults to expiring today';
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

// Restore form state if navigated from modal tab change
window.addEventListener('DOMContentLoaded', () => {
  const savedState = sessionStorage.getItem('addFoodFormState');
  if (savedState) {
    try {
      const formState = JSON.parse(savedState);
      
      // NOW we can clear the saved state
      sessionStorage.removeItem('addFoodFormState');
      
      // Open modal
      addFoodModal.style.display = 'flex';
      
      // Restore stuff
      selectedFood = formState.selectedFood;
      foodNameInput.value = formState.customName || '';
      document.getElementById('food-quantity').value = formState.quantity || '';
      foodSearchInput.value = formState.searchValue || '';
      document.getElementById('custom-emoji').value = formState.customEmoji || '';
      document.getElementById('custom-color').value = formState.customColor || '#c0c0c0';
      foodExpiryInput.value = formState.expiry || '';
      
      selectedFoodDisplay.style.display = formState.selectedFoodDisplayVisible ? 'block' : 'none';
      storageWarning.style.display = formState.storageWarningVisible ? 'block' : 'none';
      storageWarningText.textContent = formState.storageWarningText || '';
      expiryInfo.style.display = formState.expiryInfoVisible ? 'block' : 'none';
      expiryInfo.textContent = formState.expiryInfoText || '';
      document.getElementById('food-expiry-container').style.display = formState.expiryContainerVisible ? 'block' : 'none';
      
      if (formState.selectedFoodDisplayVisible && formState.selectedFood) {
        if (formState.selectedFood.custom) {
          selectedFoodEmoji.textContent = '✏️';
          selectedFoodName.textContent = 'Custom Food';
          selectedFoodSubtitle.textContent = 'Enter details below';
        } else {
          selectedFoodEmoji.textContent = formState.selectedFood.emoji || '🍽️';
          selectedFoodName.textContent = formState.selectedFood.name || '';
          selectedFoodSubtitle.textContent = formState.selectedFood.subtitle || '';
        }
      }
      
      foodDropdown.style.display = 'none';

      // We must re-grab the expiration info based on the food's current location.
      checkStorageAndSetExpiry();
    } catch (e) {
      console.error('Error restoring form state:', e);
      sessionStorage.removeItem('addFoodFormState');
    }
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && addFoodModal.style.display === 'flex') {
    addFoodModal.style.display = 'none';
  }
});

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
  
  // Reset override fields
  document.getElementById('custom-emoji').value = '';
  document.getElementById('custom-color').value = '#c0c0c0';
  document.getElementById('food-expiry-container').style.display = 'none';
  
  setDefaultExpiry();
  
  // Starting dropdown message
  foodDropdown.innerHTML = `
    <div class="px-4 py-3 text-center text-infinity-4 text-sm">
      Start typing to search for foods in the database...
    </div>
  `;
  foodDropdown.style.display = 'block';
});

// Handle modal tab switching
document.querySelectorAll('.modal-tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const newLocation = button.getAttribute('data-location');
    
    // Save current form state
    const formState = {
      selectedFood: selectedFood,
      customName: foodNameInput.value,
      quantity: document.getElementById('food-quantity').value,
      searchValue: foodSearchInput.value,
      customEmoji: document.getElementById('custom-emoji').value,
      customColor: document.getElementById('custom-color').value,
      expiry: foodExpiryInput.value,
      selectedFoodDisplayVisible: selectedFoodDisplay.style.display !== 'none',
      storageWarningVisible: storageWarning.style.display !== 'none',
      storageWarningText: storageWarningText.textContent,
      expiryInfoVisible: expiryInfo.style.display !== 'none',
      expiryInfoText: expiryInfo.textContent,
      expiryContainerVisible: document.getElementById('food-expiry-container').style.display !== 'none'
    };
    
    // Store in sessionStorage
    sessionStorage.setItem('addFoodFormState', JSON.stringify(formState));
    
    // Navigate to the new location
    window.location.href = `/inventory?location=${newLocation}`;
  });
});

closeAddFoodModalButton.addEventListener('click', () => {
  addFoodModal.style.display = 'none';
});

addFoodModalButton.addEventListener('click', () => {
  const customName = document.getElementById('food-name').value.trim();
  const quantity = document.getElementById('food-quantity').value;
  const expiryDateStr = foodExpiryInput.value;

  // Name can be custom or from database
  let name = customName;
  if (!name && selectedFood) {
    name = selectedFood.custom ? 'Unnamed Food' : selectedFood.name + (selectedFood.subtitle ? ` (${selectedFood.subtitle})` : '');
  }

  if (!name || !quantity || !foodLocation || !expiryDateStr) {
    alert('Please fill in all fields');
    return;
  }

  const expiry = new Date(expiryDateStr).getTime();

  const payload = { 
    name, 
    quantity, 
    location: foodLocation, 
    expiry 
  };

  const customEmoji = document.getElementById('custom-emoji').value.trim();
  const customColor = document.getElementById('custom-color').value;
  
  if (selectedFood && selectedFood.custom) {

    // Custom food
    payload.emoji = customEmoji || '🍽️';
    payload.theme_color = customColor || '#c0c0c0';
  } else if (selectedFood) {

    // Food from the database
    payload.emoji = customEmoji || selectedFood.emoji;
    payload.theme_color = customColor || selectedFood['theme-color'];
  } else {

    // Default
    payload.emoji = customEmoji || '🍽️';
    payload.theme_color = customColor || '#c0c0c0';
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