// Attendre que le DOM soit complètement chargé
document.addEventListener("DOMContentLoaded", () => {
    // 1. Mettre à jour l'année en cours
    const currentYearSpan = document.getElementById("currentyear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Mettre à jour la date de dernière modification du document
    const lastModifiedSpan = document.getElementById("lastmodified");
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }
});