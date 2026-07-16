// ==========================================================================
// 1. BASE DE DONNÉES DE PRODUITS (Photos d'Unsplash réelles en haute définition)
// ==========================================================================
const products = [
    {
        id: 1,
        name: "Premium Smartwatch",
        category: "electronics",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&auto=format&fit=crop&q=60",
        desc: "Suivi d'activité complet, notifications intelligentes et autonomie de 7 jours.",
        badge: "Trending"
    },
    {
        id: 2,
        name: "Wireless ANC Earbuds",
        category: "electronics",
        price: 18.50,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
        desc: "Réduction active du bruit de fond pour une expérience d'écoute immersive.",
        badge: "Hot Deal"
    },
    {
        id: 3,
        name: "Universal Travel Adapter",
        category: "electronics",
        price: 12.00,
        image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=500&auto=format&fit=crop&q=60",
        desc: "Compatible dans plus de 150 pays avec 4 ports de charge USB rapides.",
        badge: "Essential"
    },
    {
        id: 4,
        name: "Stainless Insulated Bottle",
        category: "accessories",
        price: 15.00,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
        desc: "Garde vos boissons glacées pendant 24 heures ou chaudes pendant 12 heures.",
        badge: "New"
    },
    {
        id: 5,
        name: "Ergonomic Laptop Stand",
        category: "accessories",
        price: 22.00,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60",
        desc: "Aluminium ultra-léger et pliable pour soulager la fatigue du cou.",
        badge: "Top Rated"
    },
    {
        id: 6,
        name: "Minimalist Leather Wallet",
        category: "accessories",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60",
        desc: "Portefeuille fin anti-piratage RFID pouvant accueillir jusqu'à 8 cartes.",
        badge: "Sale"
    }
];

// ==========================================================================
// 2. RENDU DYNAMIQUE DES CARTES DE PRODUITS
// ==========================================================================
const productsContainer = document.getElementById("products-container");

function displayProducts(filteredList) {
    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    if (filteredList.length === 0) {
        productsContainer.innerHTML = `<p class="no-results" style="grid-column: 1/-1; text-align: center; font-weight: 600; padding: 2rem;">Aucun article ne correspond à vos filtres.</p>`;
        return;
    }

    filteredList.forEach(product => {
        const card = document.createElement("article");
        card.classList.add("product-card");

        card.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="product-desc-snippet">${product.desc}</p>
                <div class="price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsContainer.appendChild(card);
    });

    attachCartEvents();
}

// ==========================================================================
// 3. LOGIQUE DES FILTRES
// ==========================================================================
const categorySelect = document.getElementById("category-select");
const priceRange = document.getElementById("price-range");
const priceValueText = document.getElementById("price-value");
const resetBtn = document.getElementById("reset-filters");

function filterProducts() {
    if (!categorySelect || !priceRange) return;

    const selectedCategory = categorySelect.value;
    const maxPrice = parseFloat(priceRange.value);

    priceValueText.textContent = `$${maxPrice}`;

    const filtered = products.filter(product => {
        const matchesCategory = (selectedCategory === "all" || product.category === selectedCategory);
        const matchesPrice = (product.price <= maxPrice);
        return matchesCategory && matchesPrice;
    });

    displayProducts(filtered);
}

if (categorySelect && priceRange) {
    categorySelect.addEventListener("change", filterProducts);
    priceRange.addEventListener("input", filterProducts);
}

if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        categorySelect.value = "all";
        priceRange.value = 25;
        priceValueText.textContent = "$25";
        displayProducts(products);
    });
}

// ==========================================================================
// 4. LOGIQUE DU PANIER D'ACHAT
// ==========================================================================
let cartCount = parseInt(localStorage.getItem("soko-cart-count")) || 0;
const cartCountDisplay = document.getElementById("cart-count");

if (cartCountDisplay) {
    cartCountDisplay.textContent = cartCount;
}

function attachCartEvents() {
    const cartButtons = document.querySelectorAll(".add-to-cart-btn");
    cartButtons.forEach(button => {
        button.addEventListener("click", () => {
            cartCount++;
            if (cartCountDisplay) {
                cartCountDisplay.textContent = cartCount;
            }
            localStorage.setItem("soko-cart-count", cartCount);
            
            button.textContent = "Added! ✓";
            button.style.backgroundColor = "#2ec4b6";
            setTimeout(() => {
                button.textContent = "Add to Cart";
                button.style.backgroundColor = "";
            }, 1000);
        });
    });
}

// ==========================================================================
// 5. MENU ADAPTATIF HAMBURGER (Mobile)
// ==========================================================================
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayProducts(products);
});