/**
 * form-handler.js - Form validation, preventing baseline exploits,
 * interactive error styling, and saving import requests inside localStorage.
 * Author: Benjamin Kirongozi Mazuya
 * Course: BYU-Idaho WDD 131
 */
document.addEventListener('DOMContentLoaded', () => {
    const importForm = document.getElementById('import-request-form');

    // Check if the form exists on the current page (guards script)
    if (!importForm) return;

    // Load existing request stats / details from storage if any (helps review local history)
    let submittedRequests = JSON.parse(localStorage.getItem('soko_requests')) || [];

    importForm.addEventListener('submit', (event) => {
        // Prevent default submission to analyze fields and store them locally
        event.preventDefault();

        // 1. SELECT DATA ELEMENTS FROM DOM
        const fullNameInput = document.getElementById('user-fullname');
        const emailInput = document.getElementById('user-email');
        const categorySelect = document.getElementById('product-category');
        const budgetInput = document.getElementById('target-budget');
        const descInput = document.getElementById('product-desc');

        // Simple input cleaning to prevent raw string injection anomalies
        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const category = categorySelect.value;
        const budget = parseFloat(budgetInput.value);
        const description = descInput.value.trim();

        // 2. FORM INTEGRITY VALDATION (Using conditional branching)
        if (!fullName || !email || !category || isNaN(budget) || !description) {
            alert("Please complete all requested form fields with valid information.");
            return;
        }

        if (budget <= 0) {
            alert("Please enter a realistic target price above $0.");
            return;
        }

        // 3. STORAGE REPRESENTATION (Assembling structured object data)
        const newRequest = {
            id: `req_${Date.now()}`,
            clientName: fullName,
            clientEmail: email,
            productCategory: category,
            budgetLimit: budget,
            details: description,
            timestamp: new Date().toISOString()
        };

        // Push new submission into requests array and save to localStorage
        submittedRequests.push(newRequest);
        localStorage.setItem('soko_requests', JSON.stringify(submittedRequests));

        // 4. INTERACTIVE SUCCESS REDIRECT (Feedback & Progressive UX)
        sessionStorage.setItem('last_submission_name', fullName);

        // Clear input form fields before moving on
        importForm.reset();

        // Dynamically replace the form with a success layout message
        const formParent = importForm.parentElement;
        formParent.innerHTML = `
            <div class="success-message-box" style="text-align: center; padding: 2rem;">
                <h2>🎉 Sourcing Request Logged!</h2>
                <br>
                <p>Thank you, <strong>${fullName}</strong>. Your custom import ticket has been successfully registered.</p>
                <br>
                <p>Our sourcing managers in Kolwezi will check overseas manufacturing options for your requested category (<strong>${category}</strong>) and contact you at <strong>${email}</strong>.</p>
                <br>
                <a href="index.html" class="cta-btn" style="text-decoration:none; display:inline-block; margin-top:1.5rem;">Return to Catalog</a>
            </div>
        `;
    });
});