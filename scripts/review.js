document.addEventListener("DOMContentLoaded", () => {
    // 1. Récupération et incrémentation de localStorage
    let numReviews = Number(window.localStorage.getItem("numReviews-ls")) || 0;
    numReviews++;
    localStorage.setItem("numReviews-ls", numReviews);

    // 2. Affichage du nombre de revues
    const reviewDisplay = document.getElementById("reviewCount");
    if (reviewDisplay) {
        reviewDisplay.textContent = numReviews;
    }

    // 3. Mise à jour des informations de footer
    const yearSpan = document.getElementById("year");
    const lastModSpan = document.getElementById("lastModified");

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

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