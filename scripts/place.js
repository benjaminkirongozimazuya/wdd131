document.addEventListener("DOMContentLoaded", () => {
    // 1. Mise à jour du Footer
    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById("lastmodified").textContent = document.lastModified;

    // 2. Récupération des valeurs du widget météo
    const temp = parseFloat(document.getElementById("temp").textContent);
    const wind = parseFloat(document.getElementById("wind").textContent);
    const windChillElement = document.getElementById("windchill");

    // Formule métrique sur une seule ligne
    const calculateWindChill = (t, v) => 13.12 + (0.6215 * t) - (11.37 * Math.pow(v, 0.16)) + (0.3965 * t * Math.pow(v, 0.16));

    // Validation des critères de calcul avant exécution
    if (temp <= 10 && wind > 4.8) {
        const chillFactor = calculateWindChill(temp, wind);
        windChillElement.textContent = `${chillFactor.toFixed(1)} °C`;
    } else {
        windChillElement.textContent = "N/A";
    }
});