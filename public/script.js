const addFoodModal = document.getElementById('add-food-modal');
const openAddFoodModalButton = document.getElementById('open-add-food-modal');
const addFoodModalButton = document.getElementById('submit-add-food');
const closeAddFoodModalButton = document.getElementById('close-add-food-modal');

openAddFoodModalButton.addEventListener('click', () => {
  addFoodModal.style.display = 'flex';
});

closeAddFoodModalButton.addEventListener('click', () => {
  addFoodModal.style.display = 'none';
});

addFoodModalButton.addEventListener('click', () => {
  const name = document.getElementById('food-name').value;
  const quantity = document.getElementById('food-quantity').value;

  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;

  if (!name || !quantity || !foodLocation || !expiry) {
    alert('Please fill in all fields');
    return;
  }

  fetch('/api/inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, quantity, location: foodLocation, expiry }),
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