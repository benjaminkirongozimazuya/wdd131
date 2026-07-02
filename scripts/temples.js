document.addEventListener("DOMContentLoaded", () => {
    /* ==========================================================================
       1. DYNAMIC FOOTER DATES
       ========================================================================== */
    // Récupère l'élément span pour l'année en cours
    const currentYearSpan = document.getElementById("currentyear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Récupère l'élément p pour la date de dernière modification
    const lastModifiedParagraph = document.getElementById("lastModified");
    if (lastModifiedParagraph) {
        lastModifiedParagraph.textContent = `Last Modification: ${document.lastModified}`;
    }

    /* ==========================================================================
       2. RESPONSIVE HAMBURGER MENU
       ========================================================================== */
    const menuButton = document.getElementById("menu");
    const navigationList = document.querySelector(".navigation");

    // Vérifie que les éléments existent dans le HTML avant d'ajouter l'écouteur
    if (menuButton && navigationList) {
        menuButton.addEventListener("click", () => {
            // Alterne la classe .show pour afficher ou masquer la liste des liens
            navigationList.classList.toggle("show");
            
            // Alterne la classe .show sur le bouton pour basculer entre ☰ et ❌ en CSS
            menuButton.classList.toggle("show");
        });
    }
});