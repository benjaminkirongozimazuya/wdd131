import { db, collection, getDocs, orderBy, query, doc, updateDoc, increment, addDoc, onSnapshot } from "./firebase.js";

let currentVideoId = null;

// =====================================
// 1. INITIALISATION AU CHARGEMENT DE LA PAGE
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("Application Mazuya initialisée.");
    
    // Essayer de charger Firebase en arrière-plan sans bloquer la vidéo HTML d'origine
    loadVideosFromFirebase();
});

// Charger les vidéos depuis Firestore (si la base de données en contient)
async function loadVideosFromFirebase() {
    const feedContainer = document.getElementById("feed");
    if (!feedContainer) return;

    try {
        const q = query(collection(db, "videos"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        // On ne remplace le HTML QUE si Firebase contient des vidéos
        if (querySnapshot && !querySnapshot.empty) {
            feedContainer.innerHTML = ""; // Vider le conteneur pour injecter les vidéos Firebase

            querySnapshot.forEach((documentSnap) => {
                const videoData = documentSnap.data();
                const videoId = documentSnap.id;

                const videoElement = createVideoElement(videoId, videoData);
                feedContainer.appendChild(videoElement);
            });
        } else {
            console.log("Aucune vidéo dans Firestore. Affichage de la vidéo de démonstration HTML.");
        }
    } catch (error) {
        console.warn("Firebase en cours de configuration / non disponible. Affichage local :", error);
    }
}

// Générer le code HTML d'une vidéo dynamique
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

    // Mise à jour visuelle immédiate
    let currentLikes = parseInt(likeCountElem.innerText) || 0;
    likeCountElem.innerText = currentLikes + 1;

    // Enregistrement sur Firebase (si le document existe)
    try {
        const videoRef = doc(db, "videos", videoId);
        await updateDoc(videoRef, {
            likes: increment(1)
        });
    } catch (error) {
        console.warn("Mise à jour Firestore Like échouée (vidéo locale) :", error);
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
            console.warn("Impossible d'écouter la sous-collection commentaires :", error);
            commentsList.innerHTML = "<p style='color:#888; text-align:center;'>Section commentaires disponible.</p>";
        });
    } catch (error) {
        console.error("Erreur d'ouverture des commentaires :", error);
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

    // Ajouter le commentaire visuellement dans la liste même si Firebase n'est pas encore configuré
    const commentsList = document.getElementById("comments-list");
    const tempItem = document.createElement("div");
    tempItem.className = "comment-item";
    tempItem.innerHTML = `<strong>MazuyaUser</strong>: ${text}`;
    
    // Si c'est le premier commentaire affiché
    if (commentsList.innerText.includes("Soyez le premier") || commentsList.innerText.includes("Chargement")) {
        commentsList.innerHTML = "";
    }
    commentsList.prepend(tempItem);

    // Essayer de sauvegarder sur Firebase
    try {
        await addDoc(collection(db, "videos", currentVideoId, "comments"), {
            text: text,
            username: "MazuyaUser",
            timestamp: new Date()
        });

        const videoRef = doc(db, "videos", currentVideoId);
        await updateDoc(videoRef, {
            commentsCount: increment(1)
        });
    } catch (error) {
        console.warn("Sauvegarde du commentaire dans Firestore échouée (mode démo local).");
    }

    if (input) input.value = "";
}

// =====================================
// 4. ATTACHEMENT DES FONCTIONS À WINDOW (Requis pour HTML onclick)
// =====================================
window.toggleLike = toggleLike;
window.openComments = openComments;
window.closeComments = closeComments;
window.addComment = addComment;