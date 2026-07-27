import { db, collection, getDocs, orderBy, query } from "./firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
    const feedContainer = document.getElementById("feed");
    if (!feedContainer) return;

    try {
        const videosQuery = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(videosQuery);

        if (querySnapshot.empty) {
            // S'il n'y a pas encore de vidéos sur Firebase, on affiche votre vidéo locale de test !
            feedContainer.innerHTML = `
                <section class="video-container">
                    <video src="assets/videos/sample.mp4" loop playsinline autoplay muted></video>
                    <div class="video-info">
                        <h3>@Mazuya</h3>
                        <p>Bienvenue sur Mazuya ! Ma première vidéo de démonstration 🚀</p>
                    </div>
                    <div class="actions">
                        <button class="like-btn" aria-label="J'aime">❤️</button>
                        <button aria-label="Commenter">💬</button>
                        <button aria-label="Partager">🔗</button>
                    </div>
                </section>
            `;
            initVideoClick();
            return;
        }

        feedContainer.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const videoElement = document.createElement("section");
            videoElement.className = "video-container";

            videoElement.innerHTML = `
                <video src="${data.videoUrl}" loop playsinline></video>
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

        initVideoClick();

    } catch (error) {
        console.error("Erreur Firebase, affichage du mode local :", error);
    }
});

function initVideoClick() {
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
}

function initVideoClick() {
    const videos = document.querySelectorAll("video");
    
    videos.forEach((video) => {
        video.addEventListener("click", () => {
            // Activer le son lors du premier clic si la vidéo est en sourdine
            if (video.muted) {
                video.muted = false;
            }

            // Gestion Play / Pause
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
}