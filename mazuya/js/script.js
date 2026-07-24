import { db, collection, getDocs, orderBy, query } from "./firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
    const feedContainer = document.getElementById("feed");

    if (!feedContainer) return;

    try {
        // Requête pour récupérer les vidéos triées par date (les plus récentes en premier)
        const videosQuery = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(videosQuery);

        if (querySnapshot.empty) {
            feedContainer.innerHTML = `
                <div class="loading">
                    <h2>Aucune vidéo disponible pour le moment.</h2>
                </div>
            `;
            return;
        }

        feedContainer.innerHTML = ""; // Vider le conteneur de chargement

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            const videoElement = document.createElement("section");
            videoElement.className = "video-container";

            videoElement.innerHTML = `
                <video src="${data.videoUrl}" loop playsinline muted></video>
                
                <div class="video-info">
                    <h3>@${data.username}</h3>
                    <p>${data.description}</p>
                </div>

                <div class="actions">
                    <button class="like-btn" aria-label="J'aime">❤️</button>
                    <button aria-label="Commenter">💬</button>
                    <button aria-label="Partager">🔗</button>
                </div>
            `;

            feedContainer.appendChild(videoElement);
        });

        // Gestion de la lecture/pause au clic ou au défilement
        const videos = document.querySelectorAll("video");
        videos.forEach((video) => {
            video.addEventListener("click", () => {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        });

    } catch (error) {
        console.error("Erreur lors du chargement des vidéos :", error);
    }
});