import { db, collection, getDocs, orderBy, query } from "./firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
    const feedContainer = document.getElementById("feed");
    if (!feedContainer) return;

    try {
        // Tentative de récupération des vidéos depuis Cloud Firestore
        const videosQuery = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(videosQuery);

        // Si la base de données est vide, charger la vidéo locale de démonstration
        if (querySnapshot.empty) {
            renderFallbackVideo(feedContainer);
            initVideoControls();
            return;
        }

        // Vider le conteneur avant injection
        feedContainer.innerHTML = "";

        // Génération dynamique de chaque vidéo récupérée depuis Firebase
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const videoElement = createVideoContainer(
                data.videoUrl, 
                data.username || "Anonyme", 
                data.description || ""
            );
            feedContainer.appendChild(videoElement);
        });

        initVideoControls();

    } catch (error) {
        console.error("Erreur de connexion Firebase, affichage du mode local :", error);
        renderFallbackVideo(feedContainer);
        initVideoControls();
    }
});

/**
 * Crée le bloc HTML pour une vidéo
 */
function createVideoContainer(videoSrc, username, description) {
    const section = document.createElement("section");
    section.className = "video-container";

    section.innerHTML = `
        <video src="${videoSrc}" loop playsinline autoplay muted></video>
        <div class="video-info">
            <h3>@${username}</h3>
            <p>${description}</p>
        </div>
        <div class="actions">
            <button type="button" class="like-btn" aria-label="J'aime">❤️</button>
            <button type="button" aria-label="Commenter">💬</button>
            <button type="button" aria-label="Partager">🔗</button>
        </div>
    `;

    return section;
}

/**
 * Affiche la vidéo locale par défaut si aucune vidéo n'est trouvée dans Firebase
 */
function renderFallbackVideo(container) {
    container.innerHTML = "";
    const fallbackVideo = createVideoContainer(
        "assets/videos/sample.mp4",
        "Mazuya",
        "Bienvenue sur Mazuya ! Ma première vidéo de démonstration 🚀 (Cliquez sur la vidéo pour activer le son)"
    );
    container.appendChild(fallbackVideo);
}

/**
 * Gestion du clic, de la lecture, de la pause et de l'activation du son
 */
function initVideoControls() {
    const videos = document.querySelectorAll("video");

    videos.forEach((video) => {
        video.addEventListener("click", () => {
            // Si la vidéo est muette, on débloque le son au premier clic
            if (video.muted) {
                video.muted = false;
                video.volume = 1.0;
                video.play().catch(e => console.log("Erreur de lecture audio :", e));
            } else {
                // Si le son est déjà actif, alterner entre play et pause
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    });

    // Gestion du bouton J'aime
    const likeButtons = document.querySelectorAll(".like-btn");
    likeButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Évite de faire pause sur la vidéo au clic du bouton
            btn.classList.toggle("liked");
            btn.style.transform = "scale(1.3)";
            setTimeout(() => {
                btn.style.transform = "scale(1)";
            }, 200);
        });
    });
}