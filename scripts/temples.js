document.addEventListener("DOMContentLoaded", () => {
    // ---- 1. Gestion des dates existantes ----
    const yearSpan = document.getElementById("currentyear");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const lastModifiedParagraph = document.getElementById("lastModified");
    if (lastModifiedParagraph) {
        lastModifiedParagraph.textContent = `Last Modification: ${document.lastModified}`;
    }

    // ---- 2. Menu Hamburger Réactif (Nouveau) ----
    const menuButton = document.getElementById("menu");
    const navigationList = document.querySelector(".navigation");

    if (menuButton && navigationList) {
        menuButton.addEventListener("click", () => {
            // Alterne la classe .show pour afficher/masquer le menu
            navigationList.classList.toggle("show");
            menuButton.classList.toggle("show");
        });
    }
});