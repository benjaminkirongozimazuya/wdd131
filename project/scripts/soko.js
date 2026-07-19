// 1. Structural dataset holding product items for target render nodes
const products = [
    { id: "s1", name: "Soko X1 Smartphone", price: 299, category: "electronics", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" },
    { id: "s2", name: "Modern Linen Blazer", price: 85, category: "fashion", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400" },
    { id: "s3", name: "LED Desktop Task Lamp", price: 45, category: "home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400" },
    { id: "s4", name: "Pro Wireless Earbuds", price: 120, category: "electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400" },
    { id: "s5", name: "Urban Commuter Backpack", price: 65, category: "fashion", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
    { id: "s6", name: "Pour-Over Coffee Maker", price: 35, category: "home", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400" }
];

// Principal Document Object Model ready listener hook
document.addEventListener("DOMContentLoaded", () => {
    // Run persistent counter state updating script
    handleVisitCounter();

    // Select grid targets to manage template insertions safely
    const featuredGrid = document.querySelector("#featured-grid");
    const catalogGrid = document.querySelector("#catalog-grid");

    // Conditional Branching based on current active view context
    if (featuredGrid) {
        // Use array methods to pull the first 3 items for the home page highlight row
        const featuredProducts = products.slice(0, 3);
        displayProducts(featuredProducts, featuredGrid);
    }

    if (catalogGrid) {
        // Initial target print of full array map content 
        displayProducts(products, catalogGrid);
        // Bind programmatic intercept click monitors to filter controls
        setupFilterButtons();
    }
});

/**
 * Function 1: Target Node Inner HTML Grid Injection Engine
 * Note: Exclusively implements clean template literals for string creation as required.
 */
function displayProducts(filteredList, targetContainer) {
    targetContainer.innerHTML = ""; 

    filteredList.forEach(product => {
        // Builds custom string literals while maintaining responsive lazy-loading protocols
        const productCard = `
            <article class="product-card">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <p class="category">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="price">$${product.price}.00</p>
            </article>
        `;
        targetContainer.innerHTML += productCard;
    });
}

/**
 * Function 2: Category Filter Control Interface Mapping Method
 */
function setupFilterButtons() {
    const categories = ["all", "electronics", "fashion", "home"];
    
    categories.forEach(cat => {
        const btn = document.querySelector(`#filter-${cat}`);
        if (btn) {
            btn.addEventListener("click", (event) => {
                // Clear active styling across buttons, apply to selection node target
                document.querySelectorAll(".filter-controls .btn").forEach(b => b.classList.remove("active"));
                event.target.classList.add("active");

                // Evaluate parameters using clean comparative condition branches
                if (cat === "all") {
                    displayProducts(products, document.querySelector("#catalog-grid"));
                } else {
                    const filtered = products.filter(p => p.category === cat);
                    displayProducts(filtered, document.querySelector("#catalog-grid"));
                }
            });
        }
    });
}

/**
 * Function 3: Local Storage User Telemetry Interface Handler
 */
function handleVisitCounter() {
    const counterElement = document.querySelector("#visit-counter");
    if (!counterElement) return;

    // Check data persistence logs via standard localStorage key-value queries
    let storedCount = localStorage.getItem("sokoSiteVisits");

    if (!storedCount) {
        storedCount = 1;
    } else {
        storedCount = parseInt(storedCount) + 1;
    }

    // Refresh updated tracking variable back onto disk engine storage arrays
    localStorage.setItem("sokoSiteVisits", storedCount);

    // Apply template literal output to target footer text component
    counterElement.textContent = `Total Website Visits: ${storedCount}`;
}