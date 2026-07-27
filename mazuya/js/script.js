import { db, collection, getDocs, orderBy, query, doc, updateDoc, increment, addDoc, onSnapshot } from "./firebase.js";

let currentVideoId = null;

// =====================================
// 1. CHARGEMENT DU FEED & EVENEMENTS
// =====================================
document.addEventListener("DOMContentLoaded", async () => {
    const feedContainer = document.getElementById("feed");
    if (!feedContainer) return;

    // Charger les vidéos depuis Firebase (si vous en avez dans Firestore)
    await loadVideos(feedContainer);
});

// Fonction pour charger les vidéos depuis Firestore
async function loadVideos(feedContainer) {
    try {
        const q = query(collection(db, "videos"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        // Si des vidéos existent dans Firestore, remplacer le contenu du feed
        if (!querySnapshot.empty) {
            feedContainer.innerHTML = ""; // Vider le contenu HTML de test

            querySnapshot.forEach((doc) => {
                const videoData = doc.data();
                const videoId = doc.id;

                const videoElement = createVideoElement(videoId, videoData);
                feedContainer.appendChild(videoElement);
            });
        }
    } catch (error) {
        console.error("Erreur lors du chargement des vidéos :", error);
    }
}

// Générer le HTML d'une vidéo
function createVideoElement(id, data) {
    const div = document.createElement("div");
    div.className = "video-container";
    div.setAttribute("data-video-id", id);

    div.innerHTML = `
        <video src="${data.url}" loop playsinline onclick="this.paused ? this.play() : this.pause()"></video>
        <div class="video-info">
            <h3>@${data.username || 'Mazuya'}</h3>
            <p>${data.description || ''}</p>
        </div>
        <div class="actions">
            <button class="like-btn" onclick="toggleLike('${id}')">
                <span class="like-icon">❤️</span>
                <span class="like-count" id="like-count-${id}">${data.likes || 0}</span>
            </button>
            <button class="comment-btn" onclick="openComments('${id}')">
                <span class="comment-icon">💬</span>
                <span class="comment-count" id="comment-count-${id}">${data.commentsCount || 0}</span>
            </button>
        </div>
    `;
    return div;
}

// =====================================
// 2. GESTION DES LIKES
// =====================================
async function toggleLike(videoId) {
    const likeCountElem = document.getElementById(`like-count-${videoId}`);
    if (!likeCountElem) return;

    let currentLikes = parseInt(likeCountElem.innerText) || 0;
    likeCountElem.innerText = currentLikes + 1;

    try {
        const videoRef = doc(db, "videos", videoId);
        await updateDoc(videoRef, {
            likes: increment(1)
        });
    } catch (error) {
        console.error("Erreur Like Firestore :", error);
        likeCountElem.innerText = currentLikes; // Revenir en arrière en cas d'erreur
    }
}

// =====================================
// 3. GESTION DES COMMENTAIRES
// =====================================
function openComments(videoId) {
    currentVideoId = videoId;
    const modal = document.getElementById("comment-modal");
    if (!modal) return;

    modal.classList.add("active");
    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = "<p>Chargement des commentaires...</p>";

    // Écoute en temps réel des commentaires dans la sous-collection
    const q = query(collection(db, "videos", videoId, "comments"), orderBy("timestamp", "desc"));
    
    onSnapshot(q, (snapshot) => {
        commentsList.innerHTML = "";
        if (snapshot.empty) {
            commentsList.innerHTML = "<p>Aucun commentaire pour l'instant.</p>";
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            const commentItem = document.createElement("div");
            commentItem.className = "comment-item";
            commentItem.innerHTML = `<strong>${data.username || "Utilisateur"}</strong>: ${data.text}`;
            commentsList.appendChild(commentItem);
        });
    });
}

function closeComments() {
    const modal = document.getElementById("comment-modal");
    if (modal) modal.classList.remove("active");
}

async function addComment(e) {
    e.preventDefault();
    const input = document.getElementById("comment-input");
    const text = input.value.trim();

    if (!text || !currentVideoId) return;

    try {
        // Ajouter le commentaire
        await addDoc(collection(db, "videos", currentVideoId, "comments"), {
            text: text,
            username: "MazuyaUser",
            timestamp: new Date()
        });

        // Mettre à jour le compteur global de commentaires
        const videoRef = doc(db, "videos", currentVideoId);
        await updateDoc(videoRef, {
            commentsCount: increment(1)
        });

        input.value = "";
    } catch (error) {
        console.error("Erreur lors de l'envoi du commentaire :", error);
    }
}

// =====================================
// 4. EXPORTATION VERS WINDOW (Obligatoire pour type="module")
// =====================================
window.toggleLike = toggleLike;
window.openComments = openComments;
window.closeComments = closeComments;
window.addComment = addComment;