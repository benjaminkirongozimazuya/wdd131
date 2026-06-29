// Wait until the DOM content is fully loaded to safely manipulate elements
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Dynamically populate the current copyright year
    const currentYearSpan = document.getElementById("currentyear");
    if (currentYearSpan) {
        const currentYear = new Date().getFullYear();
        currentYearSpan.textContent = currentYear;
    }

    // 2. Dynamically populate the last modified date of the document
    const lastModifiedParagraph = document.getElementById("lastModified");
    if (lastModifiedParagraph) {
        // document.lastModified returns a string containing the date and time the file was updated
        lastModifiedParagraph.textContent = `Last Modification: ${document.lastModified}`;
    }
    
});