document.addEventListener('DOMContentLoaded', () => {
  // Initialize dark mode
  initDarkMode();
  
  // Add event listener to dark mode button
  const darkModeBtn = document.getElementById('darkMode');
  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', toggleDarkMode);
  }
  
  // Rest of your existing initialization code
  displayCartItems();
  updateOrderSummary();
  
  // Use event delegation for dynamic elements
  document.querySelector('.cart-items').addEventListener('click', (e) => {
    if (e.target.classList.contains('quantity-btn')) {
      handleQuantityChange(e);
    } else if (e.target.classList.contains('remove-btn')) {
      removeCartItem(e);
    }
  });
  
  // Place order button
  const placeOrderBtn = document.querySelector('.place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
  }
});

// Display cart items
function displayCartItems() {
  const cartItemsContainer = document.querySelector('.cart-items');
  if (!cartItemsContainer) return;
  
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];
  
  // Clear existing items except headers
  const headers = cartItemsContainer.querySelectorAll('h1, h2');
  cartItemsContainer.innerHTML = '';
  headers.forEach(header => cartItemsContainer.appendChild(header));
  
  if (cart.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Your cart is empty';
    cartItemsContainer.appendChild(emptyMsg);
    return;
  }
  
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id) || item;
    
    const cartItem = document.createElement('div');
    cartItem.className = "cart-item";
    cartItem.dataset.id = item.id;
    
    // Item info
    const itemInfo = document.createElement('div');
    itemInfo.className = "item-info";
    
    const itemName = document.createElement('h3');
    itemName.textContent = product.Name || product.name;
    
    const itemPrice = document.createElement('div');
    itemPrice.className = "item-price";
    itemPrice.textContent = `${product.country || product.currency} ${product.price}`;
    
    itemInfo.appendChild(itemName);
    itemInfo.appendChild(itemPrice);
    
    // Quantity controls
    const itemQuantity = document.createElement('div');
    itemQuantity.className = "item-quantity";
    
    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = "quantity-btn";
    decreaseBtn.textContent = "-";
    decreaseBtn.dataset.action = "decrease";
    
    const quantity = document.createElement('span');
    quantity.className = "quantity";
    quantity.textContent = item.quantity;
    
    const increaseBtn = document.createElement('button');
    increaseBtn.className = "quantity-btn";
    increaseBtn.textContent = "+";
    increaseBtn.dataset.action = "increase";
    
    itemQuantity.appendChild(decreaseBtn);
    itemQuantity.appendChild(quantity);
    itemQuantity.appendChild(increaseBtn);
    
    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    
    cartItem.appendChild(itemInfo);
    cartItem.appendChild(itemQuantity);
    cartItem.appendChild(removeBtn);
    
    cartItemsContainer.appendChild(cartItem);
  });
}

// Handle quantity changes
function handleQuantityChange(e) {
  const cartItem = e.target.closest('.cart-item');
  const itemId = parseInt(cartItem.dataset.id);
  const action = e.target.dataset.action;
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) return;
  
  if (action === 'increase') {
    cart[itemIndex].quantity += 1;
  } else if (action === 'decrease') {
    cart[itemIndex].quantity -= 1;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  displayCartItems();
  updateOrderSummary();
}

// Remove item from cart
function removeCartItem(e) {
  const cartItem = e.target.closest('.cart-item');
  const itemId = parseInt(cartItem.dataset.id);
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== itemId);
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  displayCartItems();
  updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const subtotalEl = document.getElementById('Subtotal');
  console.log(subtotalEl)
  if (!subtotalEl) return;
  let subtotal = 0;
  
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id) || item;
    const price = parseFloat(product.price) || 0;
if (isNaN(price)) {
  console.error('Invalid price for product:', product);
  return 0;
}
    subtotal += price * item.quantity;
  });
  
  const tax = subtotal * 0.05; // 5% tax
  const deliveryFee = 5.00;
  const total = subtotal + tax + deliveryFee;
  
  document.getElementById('Subtotal').textContent = `${subtotal.toFixed(2)} GHS`;
  document.getElementById('Tax').textContent = `${tax.toFixed(2)} GHS`;
  document.getElementById('Delivery_Fee').textContent = `${deliveryFee.toFixed(2)} GHS`;
  document.getElementById('total_price').textContent = `${total.toFixed(2)} GHS`;
}

// Place order
function placeOrder() {
  const fullName = document.getElementById('fullName').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const region = document.getElementById('region').value;
  
  if (!fullName || !phone || !address || !city || !region) {
    alert('Please fill in all delivery information');
    return;
  }
  
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }
  
  // Create order object
  const order = {
    id: Date.now(),
    date: new Date().toISOString(),
    items: cart,
    customer: { fullName, phone, address, city, region },
    status: 'pending'
  };
  
  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Clear cart
  localStorage.setItem('cart', JSON.stringify([]));
  updateCartCount();
  
  alert('Order placed successfully!');
  //Check to see if user exists in database
  
  window.location.href = '../index.html';
}

// Update cart count (shared with product.controller.js)
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = totalItems;
  });
}

function initDarkMode() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark-mode', darkMode);
  updateDarkModeButton(darkMode);
}

function toggleDarkMode() {
  const darkMode = !document.body.classList.contains('dark-mode');
  document.body.classList.toggle('dark-mode', darkMode);
  localStorage.setItem('darkMode', darkMode);
  updateDarkModeButton(darkMode);
}

function updateDarkModeButton(darkMode) {
  const darkModeBtn = document.getElementById('darkMode');
  if (darkModeBtn) {
    darkModeBtn.textContent = darkMode ? '☀️' : '🌑';
  }}

