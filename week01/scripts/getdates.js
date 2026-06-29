// Wait for the DOM to fully load before executing the script
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Dynamic Year for Footer
    const currentYearSpan = document.getElementById("currentyear");
    if (currentYearSpan) {
        const currentYear = new Date().getFullYear();
        currentYearSpan.textContent = currentYear;
    }

    // 2. Last Modified Date for Footer
    const lastModifiedParagraph = document.getElementById("lastModified");
    if (lastModifiedParagraph) {
        lastModifiedParagraph.textContent = `Last Modification: ${document.lastModified}`;
    }
    
});