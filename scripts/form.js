const products = [
  { id: "fc-1888", name: "flux capacitor", averagerating: 4.5 },
  { id: "fc-2050", name: "power laces", averagerating: 4.7 },
  { id: "fs-1987", name: "time circuits", averagerating: 3.5 },
  { id: "ac-2000", name: "low voltage reactor", averagerating: 3.9 },
  { id: "jj-1969", name: "warp equalizer", averagerating: 5.0 }
];

document.addEventListener("DOMContentLoaded", () => {
    const productSelect = document.getElementById("product-name");
    const yearSpan = document.getElementById("year");
    const lastModSpan = document.getElementById("lastModified");

    // 1. Injection dynamique des options de produits
    if (productSelect) {
        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.id; 
            option.textContent = capitalizeWords(product.name); 
            productSelect.appendChild(option);
        });
    }

    // 2. Remplissage de l'année en cours pour le copyright
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Date de dernière modification (Format : MM/DD/YYYY HH:MM:SS)
    if (lastModSpan) {
        const modificationDate = new Date(document.lastModified);
        const pad = (num) => String(num).padStart(2, '0');
        
        const month = pad(modificationDate.getMonth() + 1);
        const day = pad(modificationDate.getDate());
        const year = modificationDate.getFullYear();
        
        const hours = pad(modificationDate.getHours());
        const minutes = pad(modificationDate.getMinutes());
        const seconds = pad(modificationDate.getSeconds());
        
        lastModSpan.textContent = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    }
});

function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}