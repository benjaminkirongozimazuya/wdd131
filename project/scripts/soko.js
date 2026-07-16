/**
 * soko.js - Interactive product catalog, category filters,
 * price range controller, mobile menu, and localStorage cart persistence.
 * Author: Benjamin Kirongozi Mazuya
 * Course: BYU-Idaho WDD 131
 */

// 1. PRODUCT ARRAY DATA (Objects representing trending imports)
const products = [
    {
        id: "p1",
        name: "Wireless Earbuds Classic",
        category: "electronics",
        price: 19.99,
        badge: "Hot",
        description: "HD Stereo deep bass wireless sound buds with portable charging box.",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "p2",
        name: "Smart Watch V2 Pro",
        category: "electronics",
        price: 24.99,
        badge: "Trending",
        description: "Elegant health tracker with heartbeat scanner and call notification options.",
        image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "p3",
        name: "Minimalist Leather Cardholder",
        category: "accessories",
        price: 12.50,
        badge: "",
        description: "Slim genuine leather wallet to protect credit cards and hold active cash bills.",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "p4",
        name: "LED Laptop Desk Light",
        category: "accessories",
        price: 15.00,
        badge: "Sale",
        description: "Screenbar hanging monitor lamp with step-less dimming to reduce eye strain.",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "p5",
        name: "USB-C Multi-Port Hub",
        category: "electronics",
        price: 18.25,
        badge: "",
        description: "5-in-1 Aluminum Adapter containing high speed USB ports, micro SD and 4K HDMI out.",
        image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "p6",
        name: "Portable Travel Organizer",
        category: "accessories",
        price: 9.99,
        badge: "",
        description: "Water-resistant tech pouch designed to secure cables, chargers, and SD cards safely.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400"
    }
];

// 2. STATE MANAGEMENT (Cart memory initialized via localStorage)
let cart = JSON.parse(localStorage.getItem('soko_cart')) || [];

// 3. DOM ELEMENT REFERENCES
const productsContainer = document.getElementById('products-container');
const categorySelect = document.getElementById('category-select');
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');
const resetBtn = document.getElementById('reset-filters');
const cartCountSpan = document.getElementById('cart-count');
const menuToggleBtn = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// 4. MAIN INJECTOR FUNCTION (Uses Template Literals exclusively)
function renderProducts(productsList) {
    if (!productsContainer) return; // Guard clause if not on the catalog page
    productsContainer.innerHTML = ""; // Clear existing grid items

    if (productsList.length === 0) {
        productsContainer.innerHTML = `<p class="no-results">No trending products match your current filters.</p>`;
        return;
    }

    productsList.forEach(product => {
        const badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : "";
        const productCard = `
            <article class="product-card">
                ${badgeHTML}
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-desc-snippet">${product.description}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </article>
        `;
        productsContainer.insertAdjacentHTML('beforeend', productCard);
    });

    // Attach event listeners to newly injected cart buttons
    const addButtons = productsContainer.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-id');
            addToCart(productId);
        });
    });
}

// 5. EVENT HANDLER: ADD TO CART & LOCAL STORAGE PERSISTENCE
function addToCart(productId) {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
        cart.push(selectedProduct);
        localStorage.setItem('soko_cart', JSON.stringify(cart));
        updateCartCount();

        // Dynamic UI micro-interaction (Visual Feedback)
        const btn = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = "Added! ✓";
            btn.style.backgroundColor = "#f4a261";
            btn.style.color = "#0d1b2a";
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = "";
                btn.style.color = "";
            }, 1000);
        }
    }
}

// Update DOM cart numerical counter
function updateCartCount() {
    if (cartCountSpan) {
        cartCountSpan.textContent = cart.length;
    }
}

// 6. FILTER LOGIC & CONTROL INTERACTION
function applyFilters() {
    const activeCategory = categorySelect.value;
    const maxBudget = parseFloat(priceRange.value);

    const filteredProducts = products.filter(product => {
        const matchesCategory = (activeCategory === "all" || product.category === activeCategory);
        const matchesPrice = (product.price <= maxBudget);
        return matchesCategory && matchesPrice;
    });
    renderProducts(filteredProducts);
}

// 7. INITIALIZER & EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    if (productsContainer && categorySelect && priceRange) {
        renderProducts(products);

        // Price range text input dynamic tracker
        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = `$${e.target.value}`;
            applyFilters();
        });

        // Category dropdown listener
        categorySelect.addEventListener('change', applyFilters);

        // Reset Filter Button
        resetBtn.addEventListener('click', () => {
            categorySelect.value = "all";
            priceRange.value = 25;
            priceValue.textContent = "$25";
            renderProducts(products);
        });
    }

    // 8. MOBILE COLLAPSED HEADER HAMBURGER TOGGLE (DOM Manipulation)
    if (menuToggleBtn && navMenu) {
        menuToggleBtn.addEventListener('click', () => {
            const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
            menuToggleBtn.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('open');
            menuToggleBtn.textContent = navMenu.classList.contains('open') ? "✕" : "☰";
        });
    }
});