// ==========================================
// 1. TABLEAU DE DONNÉES DES TEMPLES
// ==========================================
const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
  },
  // FIX IMAGE : URL alternative libre de droits pour éviter le blocage réseau
  {
  templeName: "Kinshasa Democratic Republic of the Congo",
  location: "Kinshasa, Democratic Republic of the Congo",
  dedicated: "2019, April, 14",
  area: 12000,
  imageUrl: "images/kinshasa-temple.jpg"
  },
  {
    templeName: "Paris France",
    location: "Le Chesnay, France",
    dedicated: "2017, May, 21",
    area: 44175,
    imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/paris-france/400x250/paris-france-temple-exterior-1905503.jpg"
  },
  {
    templeName: "Rome Italy",
    location: "Rome, Italy",
    dedicated: "2019, March, 10",
    area: 41010,
    imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/rome-italy/2019/400x250/5-Rome-Temple-2160345.jpg"
  }
];

// ==========================================
// 2. GESTION DU MENU MOBILE (HAMBURGER)
// ==========================================
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    hamburger.textContent = navMenu.classList.contains("open") ? "✕" : "☰";
  });
}

// ==========================================
// 3. FONCTION DE GÉNÉRATION DES CARTES HTML
// ==========================================
const gallery = document.querySelector(".temple-grid");
const mainHeading = document.querySelector("main h2");

function displayTemples(filteredTemples) {
  if (!gallery) return;
  
  gallery.innerHTML = ""; 
  
  filteredTemples.forEach(temple => {
    const card = document.createElement("section");
    card.classList.add("temple-card");
    
    // Respecte strictement le lazy loading et les dimensions requises par le sujet
    card.innerHTML = `
      <h3>${temple.templeName}</h3>
      <p><strong>Location:</strong> ${temple.location}</p>
      <p><strong>Dedicated:</strong> ${temple.dedicated}</p>
      <p><strong>Size:</strong> ${temple.area.toLocaleString()} sq ft</p>
      <figure>
        <img src="${temple.imageUrl}" 
             alt="${temple.templeName} Temple" 
             loading="lazy" 
             width="400" 
             height="250">
      </figure>
    `;
    
    gallery.appendChild(card);
  });
}

// ==========================================
// 4. LOGIQUE FILTRAGE ET ÉVÉNEMENTS DU MENU
// ==========================================
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); 
    
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    
    if (navMenu && navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      if (hamburger) hamburger.textContent = "☰";
    }
    
    const filter = link.id;
    let filteredList = [];
    
    if (mainHeading) mainHeading.textContent = link.textContent;

    switch (filter) {
      case "nav-old": // Avant 1900
        filteredList = temples.filter(t => {
          const year = parseInt(t.dedicated.split(",")[0].trim());
          return year < 1900;
        });
        break;
        
      case "nav-new": // Après 2000
        filteredList = temples.filter(t => {
          const year = parseInt(t.dedicated.split(",")[0].trim());
          return year > 2000;
        });
        break;
        
      case "nav-large": // Supérieur à 90 000
        filteredList = temples.filter(t => t.area > 90000);
        break;
        
      case "nav-small": // Inférieur à 10 000
        filteredList = temples.filter(t => t.area < 10000);
        break;
        
      default: // Tout afficher
        filteredList = temples;
        if (mainHeading) mainHeading.textContent = "Home";
        break;
    }
    
    displayTemples(filteredList);
  });
});

// ==========================================
// 5. MISE À JOUR DU FOOTER (DATES)
// ==========================================
const currentYearSpan = document.getElementById("currentyear");
const lastModifiedSpan = document.getElementById("lastmodified");

if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

if (lastModifiedSpan) {
  lastModifiedSpan.textContent = document.lastModified;
}

// ==========================================
// 6. INITIALISATION AU CHARGEMENT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  displayTemples(temples);
});