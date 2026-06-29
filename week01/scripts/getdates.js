document.addEventListener("DOMContentLoaded", () => {
    // 1. Met à jour automatiquement l'année dans le premier paragraphe du footer
    const yearSpan = document.querySelector("footer p span");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Met à jour la date de dernière modification dans le deuxième paragraphe
    const lastModifiedParagraph = document.getElementById("lastModified");
    if (lastModifiedParagraph) {
        lastModifiedParagraph.textContent = `Last Modification: ${document.lastModified}`;
    }
});