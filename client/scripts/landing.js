document.addEventListener('DOMContentLoaded', () => {
    // Initialize dark mode
    initDarkMode();
    
    // Update cart count
    updateCartCount();
    
    // Add event listener to dark mode button
    const darkModeBtn = document.getElementById('darkMode');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', toggleDarkMode);
    }
});

// Initialize dark mode
function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
    
    const darkModeBtn = document.getElementById('darkMode');
    if (darkModeBtn) {
        darkModeBtn.textContent = darkMode ? '☀️' : '🌑';
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

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}