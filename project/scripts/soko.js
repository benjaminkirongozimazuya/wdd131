// Data arrays representing trending imported product collections
const products = [
    { id: "p1", name: "Soko Elite Earbuds", price: 24, category: "tech", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400" },
    { id: "p2", name: "Minimalist Smart Watch", price: 45, category: "tech", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" },
    { id: "p3", name: "Urban Linen Cargo Shirt", price: 19, category: "apparel", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400" },
    { id: "p4", name: "Weatherproof Travel Pack", price: 35, category: "apparel", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
    { id: "p5", name: "LED Task Ring Lamp", price: 15, category: "home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400" },
    { id: "p6", name: "Compact Cold Brewer", price: 22, category: "home", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400" }
];

// Principal DOM listener initializer entry hook
document.addEventListener("DOMContentLoaded", () => {
    // Render storage elements
    handleTelemetryCounters();
    updateCartIconDisplay();
    
    // Wireframe Mobile Toggle Configuration Handler
    setupMobileNavigationMenu();

    const targetGrid = document.querySelector("#product-grid");
    if (targetGrid) {
        // Initial interface presentation mapping all products
        renderGridElements(products, targetGrid);
        // Map dynamic filtering operations onto sidebar buttons
        bindCatalogControls(targetGrid);
    }

    // Bind clean listener routine onto cart empty button action item if verified present
    const clearBtn = document.querySelector("#clear-cart-btn");
    if (clearBtn) {
        clearBtn.addEventListener("click", purgeCartDataState);
    }
});

/**
 * Functional Task 1: Responsive Menu Toggle Coordinator
 */
function setupMobileNavigationMenu() {
    const toggleButton = document.querySelector("#menu-toggle");
    const primaryNav = document.querySelector("#primary-nav");

    if (toggleButton && primaryNav) {
        toggleButton.addEventListener("click", () => {
            primaryNav.classList.toggle("open");
            // Switch structural icon indicator text layout smoothly
            toggleButton.textContent = primaryNav.classList.contains("open") ? "✕" : "☰";
        });
    }
}

/**
 * Functional Task 2: Component Card Template Literals Generator
 */
function renderGridElements(datasetList, targetBlock) {
    targetBlock.innerHTML = "";

    if (datasetList.length === 0) {
        targetBlock.innerHTML = `<p class="no-items-msg">No budget matches found for this specific category selection.</p>`;
        return;
    }

    datasetList.forEach(item => {
        // Build structures using strict literal syntax matching layout requirement guidelines
        const htmlCardElement = `
            <article class="product-card">
                <div>
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <p class="card-cat">${item.category}</p>
                    <h3>${item.name}</h3>
                </div>
                <div>
                    <p class="card-price">$${item.price}.00</p>
                    <button class="buy-btn" data-id="${item.id}">Add To Cart</button>
                </div>
            </article>
        `;
        targetBlock.innerHTML += htmlCardElement;
    });

    // Intercept operational click routines for newly generated interactive buttons
    bindPurchaseTriggers();
}

/**
 * Functional Task 3: Interactive Array Processing & Category Filters Selector
 */
function bindCatalogControls(gridDOMNode) {
    const categoriesFilterList = ["all", "tech", "apparel", "home"];

    categoriesFilterList.forEach(key => {
        const structuralBtnNode = document.querySelector(`#filter-${key}`);
        if (structuralBtnNode) {
            structuralBtnNode.addEventListener("click", (e) => {
                // Clear state styling loops from prior active buttons
                document.querySelectorAll(".filter-btn").forEach(node => node.classList.remove("active"));
                e.target.classList.add("active");

                // Check filter mapping via conditional branches matching user scenarios
                if (key === "all") {
                    renderGridElements(products, gridDOMNode);
                } else {
                    const sortedFilteredResults = products.filter(entry => entry.category === key);
                    renderGridElements(sortedFilteredResults, gridDOMNode);
                }
            });
        }
    });
}

/**
 * Functional Task 4: Incremental Cart Array Addition & State Sync Handler
 */
function bindPurchaseTriggers() {
    const buyButtons = document.querySelectorAll(".buy-btn");
    buyButtons.forEach(btn => {
        btn.addEventListener("click", (event) => {
            const selectedProductId = event.target.getAttribute("data-id");
            
            // Extract item structure metadata utilizing target key methods
            const matchedObject = products.find(p => p.id === selectedProductId);

            if (matchedObject) {
                // Retrieve or parse local storage tracking keys safely
                let activeCartData = JSON.parse(localStorage.getItem("sokoCartItemsArray")) || [];
                activeCartData.push(matchedObject);
                
                // Set structural tracking indices down onto application disk arrays
                localStorage.setItem("sokoCartItemsArray", JSON.stringify(activeCartData));
                
                // Refresh top visual indicators in real time without refreshing the page
                updateCartIconDisplay();
            }
        });
    });
}

/**
 * Functional Task 5: Dynamic Cart Counter Interface Text Modifier
 */
function updateCartIconDisplay() {
    const counterElement = document.querySelector("#cart-counter");
    if (counterElement) {
        const storedItems = JSON.parse(localStorage.getItem("sokoCartItemsArray")) || [];
        // Apply text content directly using template strings
        counterElement.textContent = `${storedItems.length}`;
    }
}

/**
 * Functional Task 6: Persistent Tracking Stats Ledger Interface Controller
 */
function handleTelemetryCounters() {
    const analyticsFooterTextNode = document.querySelector("#visit-counter");
    if (!analyticsFooterTextNode) return;

    let totalRecordedVisits = localStorage.getItem("sokoUniquePageVisitsCount");

    if (!totalRecordedVisits) {
        totalRecordedVisits = 1;
    } else {
        totalRecordedVisits = parseInt(totalRecordedVisits) + 1;
    }

    localStorage.setItem("sokoUniquePageVisitsCount", totalRecordedVisits);
    analyticsFooterTextNode.textContent = `Total Site Visit Metric: ${totalRecordedVisits}`;
}

/**
 * Functional Task 7: Storage Clearing Subroutine
 */
function purgeCartDataState() {
    localStorage.removeItem("sokoCartItemsArray");
    updateCartIconDisplay();
}