document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Compteur de visites local
  const viewElem = document.getElementById("view-count");
  if (viewElem) {
    let views = parseInt(localStorage.getItem("site_views") || "0") + 1;
    localStorage.setItem("site_views", views);
    viewElem.textContent = views;
  }

  // 2. Récupération des membres enregistrés
  let members = JSON.parse(localStorage.getItem("community_members")) || [];
  updateMemberCount();

  // 3. Soumission du formulaire d'adhésion
  const form = document.getElementById("signup-form");
  const confirmMsg = document.getElementById("confirmation-msg");

  // URL de synchronisation Google Sheets (Optionnel)
  const GOOGLE_SCRIPT_URL = ""; 

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const newMember = {
        fullname: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        role: document.getElementById("role").value,
        date: new Date().toLocaleDateString()
      };

      // Sauvegarde locale
      members.push(newMember);
      localStorage.setItem("community_members", JSON.stringify(members));

      // Envoi vers Google Sheets si configuré
      if (GOOGLE_SCRIPT_URL !== "") {
        fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMember)
        }).catch(error => console.error("Erreur Google Sheets:", error));
      }

      updateMemberCount();
      form.reset();

      if (confirmMsg) {
        confirmMsg.style.display = "block";
        setTimeout(() => {
          confirmMsg.style.display = "none";
        }, 5000);
      }
    });
  }

  function updateMemberCount() {
    const memberElem = document.getElementById("member-count");
    if (memberElem) {
      memberElem.textContent = members.length;
    }
  }

  // 4. Exportation des membres au format CSV / Excel
  const exportBtn = document.getElementById("export-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      if (members.length === 0) {
        alert("Aucun membre enregistré pour le moment.");
        return;
      }

      let csvContent = "data:text/csv;charset=utf-8,Nom,Email,Telephone,Domaine,Date\n";
      members.forEach(m => {
        csvContent += `"${m.fullname}","${m.email}","${m.phone}","${m.role}","${m.date}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Membres_Esprit_Maitre.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
});