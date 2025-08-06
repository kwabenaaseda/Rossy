document.addEventListener('DOMContentLoaded', () => {
    // Initialize dark mode
    initDarkMode();
    
    // Load products and stats
    loadProducts();
    updateStats();
    
    // Set up event listeners
    setupEventListeners();
});

function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
    
    const darkModeBtn = document.getElementById('darkMode');
    if (darkModeBtn) {
        darkModeBtn.textContent = darkMode ? '☀️' : '🌑';
        darkModeBtn.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    const darkMode = !document.body.classList.contains('dark-mode');
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
    
    const darkModeBtn = document.getElementById('darkMode');
    if (darkModeBtn) {
        darkModeBtn.textContent = darkMode ? '☀️' : '🌑';
    }
}

function setupEventListeners() {
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => openModal());
    }
    
    // Modal close button
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal());
    }
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('productModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Form submission
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit();
        });
    }
    
    // Image upload handler
    const productImageFile = document.getElementById('productImageFile');
    if (productImageFile) {
        productImageFile.addEventListener('change', handleImageUpload);
    }
    
    // Availability toggle
    const rollerBody = document.getElementById('rollerBodys');
    const roller = document.getElementById('rollers');
    const availabilityStatus = document.getElementById('availabilityStatus');
    
    if (rollerBody && roller && availabilityStatus) {
        rollerBody.addEventListener('click', () => {
            roller.classList.toggle('active');
            rollerBody.classList.toggle('active');
            availabilityStatus.textContent = roller.classList.contains('active') ? "In Stock" : "Out of Stock";
        });
    }
}

let uploadedImageData = null;
let currentProductId = null;

function handleImageUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        uploadedImageData = event.target.result;
        document.getElementById('productImage').value = '';
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

function openModal(product = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    
    if (product) {
        // Edit mode
        modalTitle.textContent = "Edit Product";
        submitBtn.textContent = "Update Product";
        currentProductId = product.id;
        
        // Fill form with product data
        document.getElementById('productName').value = product.Name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('currency').value = product.country;
        
        const rollerBody = document.getElementById('rollerBodys');
        const roller = document.getElementById('rollers');
        const availabilityStatus = document.getElementById('availabilityStatus');
        
        if (product.availability === "In Stock") {
            roller.classList.add('active');
            rollerBody.classList.add('active');
            availabilityStatus.textContent = "In Stock";
        } else {
            roller.classList.remove('active');
            rollerBody.classList.remove('active');
            availabilityStatus.textContent = "Out of Stock";
        }
        
        if (product.image) {
            document.getElementById('productImage').value = product.image;
            uploadedImageData = product.image;
        }
    } else {
        // Add mode
        modalTitle.textContent = "Add New Product";
        submitBtn.textContent = "Add Product";
        currentProductId = null;
        document.getElementById('productForm').reset();
        
        const rollerBody = document.getElementById('rollerBodys');
        const roller = document.getElementById('rollers');
        const availabilityStatus = document.getElementById('availabilityStatus');
        
        roller.classList.remove('active');
        rollerBody.classList.remove('active');
        availabilityStatus.textContent = "Out of Stock";
        
        uploadedImageData = null;
    }
    
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = "none";
    currentProductId = null;
}

function handleFormSubmit() {
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productCountry = document.getElementById('currency').value;
    const productCategory = document.getElementById('productCategory').value;
    const productImage = uploadedImageData || document.getElementById('productImage').value;
    const roller = document.getElementById('rollers');
    
    if (!productName || !productPrice || !productCountry || !productCategory) {
        alert('Please fill in all required fields');
        return;
    }

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const availability = roller.classList.contains('active') ? "In Stock" : "Out of Stock";
    
    if (currentProductId) {
        // Update existing product
        const index = products.findIndex(p => p.id === currentProductId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                Name: productName,
                price: productPrice,
                country: productCountry,
                availability,
                category: productCategory,
                image: productImage || products[index].image
            };
        }
    } else {
        // Add new product
        const newProduct = {
            id: Date.now(),
            Name: productName,
            price: productPrice,
            country: productCountry,
            availability,
            category: productCategory,
            image: productImage || '../images/default-product.jpg',
            quantity: 0
        };
        products.push(newProduct);
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
    updateStats();
    closeModal();
}

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p>No products found. Add your first product!</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <h3 class="product-name">${product.Name}</h3>
            <p class="product-category">${product.category}</p>
            <p class="product-price">${product.country} ${product.price}</p>
            <span class="product-availability ${product.availability === "In Stock" ? "in-stock" : "out-of-stock"}">
                ${product.availability}
            </span>
            <div class="product-actions">
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const product = products.find(p => p.id === productId);
            if (product) {
                openModal(product);
            }
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('Are you sure you want to delete this product?')) {
                const productId = parseInt(e.target.dataset.id);
                deleteProduct(productId);
            }
        });
    });
}

function deleteProduct(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const filteredProducts = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(filteredProducts));
    loadProducts();
    updateStats();
}

function updateStats() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.availability === "In Stock").length;
    const outOfStockProducts = totalProducts - inStockProducts;
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('inStockProducts').textContent = inStockProducts;
    document.getElementById('outOfStockProducts').textContent = outOfStockProducts;
}