// Initialize cart if it doesn't exist
if (!localStorage.getItem('cart')) {
  localStorage.setItem('cart', JSON.stringify([]));
}

// Display products
function displayProducts() {
  const productsGrid = document.querySelector('.products-grid');
  if (!productsGrid) return;
  
  productsGrid.innerHTML = '';
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = "product-card";
    
    // Product image and availability
    const productImage = document.createElement('div');
    productImage.className = "product-image";
    productImage.style.backgroundImage = `url(${product.image || '../images/default-product.jpg'})`;
    
    const availability = document.createElement('span');
    availability.className = `availability ${product.availability === "In Stock" ? "in-stock" : "out-of-stock"}`;
    availability.textContent = product.availability;
    
    // Product info
    const productInfo = document.createElement('div');
    productInfo.className = "product-info";
    
    const productName = document.createElement('h3');
    productName.className = "product-name";
    productName.textContent = product.Name;
    
    const priceStock = document.createElement('div');
    priceStock.className = "price-stock";
    
    const price = document.createElement('span');
    price.className = "price";
    price.textContent = `${product.country} ${product.price}`;
    
    const stock = document.createElement('span');
    stock.className = `stock ${product.availability === "In Stock" ? "in-stock" : "out-of-stock"}`;
    stock.textContent = product.availability;
    
    // Add to cart button
    const buyBtn = document.createElement('button');
    buyBtn.className = "buy-btn";
    buyBtn.textContent = product.availability === "In Stock" ? "Add to Cart" : "Out of Stock";
    if (product.availability !== "In Stock") buyBtn.disabled = true;
    
    buyBtn.addEventListener('click', () => {
      addToCart(product.id);
      updateCartCount();
    });
    
    // Check if product is in cart
    const cartItem = cart.find(item => item.id === product.id);
    const quantityDisplay = document.createElement('div');
    quantityDisplay.className = "quantity-display";
    quantityDisplay.textContent = cartItem ? `In Cart: ${cartItem.quantity}` : '';
    
    // Build structure
    priceStock.appendChild(price);
    priceStock.appendChild(stock);
    
    productInfo.appendChild(productName);
    productInfo.appendChild(priceStock);
    productInfo.appendChild(buyBtn);
    productInfo.appendChild(quantityDisplay);
    
    productImage.appendChild(availability);
    
    productCard.appendChild(productImage);
    productCard.appendChild(productInfo);
    
    productsGrid.appendChild(productCard);
  });
}

// Add item to cart
function addToCart(productId) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.Name,
      price: product.price,
      currency: product.country,
      quantity: 1,
      image: product.image
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  displayProducts();
}

// Update cart count in header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = totalItems;
  });
}

// Initialize dark mode
function initDarkMode() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark-mode', darkMode);
  
  const darkModeBtn = document.getElementById('darkMode');
  if (darkModeBtn) {
    darkModeBtn.textContent = darkMode ? '☀️' : '🌑';
    darkModeBtn.addEventListener('click', toggleDarkMode);
  }
}

// Toggle dark mode
function toggleDarkMode() {
  const darkMode = !document.body.classList.contains('dark-mode');
  document.body.classList.toggle('dark-mode', darkMode);
  localStorage.setItem('darkMode', darkMode);
  
  const darkModeBtn = document.getElementById('darkMode');
  if (darkModeBtn) {
    darkModeBtn.textContent = darkMode ? '☀️' : '🌑';
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  displayProducts();
  updateCartCount();
  initDarkMode();
  
  // Search functionality
  const searchInput = document.querySelector('.search-container input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterProducts(searchTerm);
    });
  }
});

// Filter products by search term
function filterProducts(searchTerm) {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const productName = card.querySelector('.product-name').textContent.toLowerCase();
    if (productName.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Mobile menu toggle
/* function initMobileMenu() {
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.innerHTML = '☰';
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  
  const headerLeft = document.querySelector('.header-left');
  if (headerLeft) {
    headerLeft.appendChild(mobileMenuBtn);
  }
}

function toggleMobileMenu() {
  // Implement mobile menu overlay if needed
  alert('Mobile menu would open here');
} */

// Update DOMContentLoaded event listener:
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelector('video').classList.add('close')
},4000);
  displayProducts();
  updateCartCount();
  initDarkMode();
  initMobileMenu(); // Add this line
  
  // ... rest of your initialization code
});
