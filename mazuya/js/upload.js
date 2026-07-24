import { db, storage, collection, addDoc, serverTimestamp, ref, uploadBytesResumable, getDownloadURL } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const videoFileInput = document.getElementById("videoFile");
    const previewVideo = document.getElementById("previewVideo");
    const usernameInput = document.getElementById("username");
    const descriptionInput = document.getElementById("description");
    const statusText = document.getElementById("status");

    // 1. Prévisualisation de la vidéo sélectionnée
    videoFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            previewVideo.src = fileURL;
            previewVideo.load();
            previewVideo.play().catch(() => {}); // Évite l'erreur d'autoplay
        }
    });

    // 2. Soumission du formulaire & Envoi vers Firebase
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const file = videoFileInput.files[0];
        const username = usernameInput.value.trim();
        const description = descriptionInput.value.trim();

        if (!file) {
            statusText.textContent = "Veuillez sélectionner une vidéo.";
            statusText.className = "error-message";
            return;
        }

        try {
            statusText.textContent = "Téléversement en cours... 0%";
            statusText.className = "success-message";

            // Nom unique pour le stockage du fichier vidéo
            const storageRef = ref(storage, `videos/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Suivi de la progression du téléversement
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    statusText.textContent = `Téléversement en cours... ${progress}%`;
                },
                (error) => {
                    console.error("Erreur Upload :", error);
                    statusText.textContent = "Échec du téléversement vidéo.";
                    statusText.className = "error-message";
                },
                async () => {
                    // Obtention de l'URL publique de la vidéo
                    const videoUrl = await getDownloadURL(uploadTask.snapshot.ref);

                    // Enregistrement dans la base de données Firestore
                    await addDoc(collection(db, "videos"), {
                        username: username,
                        description: description,
                        videoUrl: videoUrl,
                        likes: 0,
                        createdAt: serverTimestamp()
                    });

                    statusText.textContent = "Vidéo publiée avec succès ! 🎉";
                    statusText.className = "success-message";
                    
                    // Réinitialisation du formulaire
                    uploadForm.reset();
                    previewVideo.src = "";

                    // Redirection vers l'accueil après 2 secondes
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 2000);
                }
            );

        } catch (error) {
            console.error("Erreur Firestore :", error);
            statusText.textContent = "Une erreur est survenue lors de la publication.";
            statusText.className = "error-message";
        }
    });
});