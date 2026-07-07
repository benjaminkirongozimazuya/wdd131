document.addEventListener("DOMContentLoaded", () => {
    // 1. Mises à jour obligatoires du pied de page
    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById("lastmodified").textContent = document.lastModified;

    // 2. Variables et Éléments pour le calcul météo
    const tempElement = document.getElementById("temp");
    const windElement = document.getElementById("wind");
    const windChillElement = document.getElementById("windchill");

    if (tempElement && windElement && windChillElement) {
        const temp = parseFloat(tempElement.textContent);
        const wind = parseFloat(windElement.textContent);

        // Formule de Wind Chill métrique condensée sur une seule ligne (Retour implicite)
        const calculateWindChill = (t, v) => 13.12 + (0.6215 * t) - (11.37 * Math.pow(v, 0.16)) + (0.3965 * t * Math.pow(v, 0.16));

        // Vérification stricte des conditions requises pour le calcul métrique (T <= 10 °C et V > 4.8 km/h)
        if (!isNaN(temp) && !isNaN(wind) && temp <= 10 && wind > 4.8) {
            const chillFactor = calculateWindChill(temp, wind);
            windChillElement.textContent = `${chillFactor.toFixed(1)} °C`;
        } else {
            // Affichage par défaut si les conditions ne sont pas respectées
            windChillElement.textContent = "N/A";
        }
    }
});