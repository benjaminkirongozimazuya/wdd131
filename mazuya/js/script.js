import { db, collection, getDocs, orderBy, query, doc, updateDoc, increment, addDoc, onSnapshot } from "./firebase.js";

let currentVideoId = null;

// =====================================
// 1. CHARGEMENT DU FEED & ÉVÉNEMENTS
// =====================================
document.addEventListener("DOMContentLoaded", async () => {
    const feedContainer = document.getElementById("feed");
    if (!feedContainer) return;

    // Charger les vidéos depuis Firebase (si disponible)
    await loadVideos(feedContainer);
});

// Fonction pour charger les vidéos depuis Firestore
async function loadVideos(feedContainer) {
    try {
        const q = query(collection(db, "videos"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        // Si Firebase contient des vidéos, on remplace la vidéo de test par défaut
        if (!querySnapshot.empty) {
            feedContainer.innerHTML = ""; // Vider le conteneur uniquement si des données existent

            querySnapshot.forEach((documentSnap) => {
                const videoData = documentSnap.data();
                const videoId = documentSnap.id;

                const videoElement = createVideoElement(videoId, videoData);
                feedContainer.appendChild(videoElement);
            });
        } else {
            console.log("Aucune vidéo trouvée dans Firestore. Affichage de la vidéo de démonstration.");
        }
    } catch (error) {
        console.error("Erreur lors du chargement des vidéos Firestore :", error);
        // En cas d'erreur réseau ou de droits, la vidéo du fichier index.html reste affichée
    }
}

// Générer dynamiquement la structure HTML d'une vidéo
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
        console.error("Erreur mise à jour Like dans Firestore :", error);
        // Si la vidéo n'existe pas encore dans Firestore, on conserve l'affichage local
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
    commentsList.innerHTML = "<p style='color:#888; text-align:center;'>Chargement des commentaires...</p>";

    try {
        // Écoute en temps réel des commentaires dans Firestore
        const q = query(collection(db, "videos", videoId, "comments"), orderBy("timestamp", "desc"));
        
        onSnapshot(q, (snapshot) => {
            commentsList.innerHTML = "";
            if (snapshot.empty) {
                commentsList.innerHTML = "<p style='color:#888; text-align:center;'>Soyez le premier à commenter !</p>";
                return;
            }

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const commentItem = document.createElement("div");
                commentItem.className = "comment-item";
                commentItem.innerHTML = `<strong>${data.username || "Utilisateur"}</strong>: ${data.text}`;
                commentsList.appendChild(commentItem);
            });
        }, (error) => {
            console.error("Erreur de lecture des commentaires :", error);
            commentsList.innerHTML = "<p style='color:#888; text-align:center;'>Impossible de charger les commentaires.</p>";
        });
    } catch (error) {
        console.error("Erreur lors de l'ouverture des commentaires :", error);
    }
}

function closeComments() {
    const modal = document.getElementById("comment-modal");
    if (modal) {
        modal.classList.remove("active");
    }
}

async function addComment(e) {
    e.preventDefault();
    const input = document.getElementById("comment-input");
    const text = input ? input.value.trim() : "";

    if (!text || !currentVideoId) return;

    try {
        // 1. Ajouter le commentaire dans la sous-collection Firestore
        await addDoc(collection(db, "videos", currentVideoId, "comments"), {
            text: text,
            username: "MazuyaUser",
            timestamp: new Date()
        });

        // 2. Mettre à jour le nombre total de commentaires
        const videoRef = doc(db, "videos", currentVideoId);
        await updateDoc(videoRef, {
            commentsCount: increment(1)
        });

        if (input) input.value = "";
    } catch (error) {
        console.error("Erreur lors de l'envoi du commentaire :", error);
    }
}

// =====================================
// 4. ACCÈS GLOBAL POUR LE HTML (type="module")
// =====================================
window.toggleLike = toggleLike;
window.openComments = openComments;
window.closeComments = closeComments;
window.addComment = addComment;