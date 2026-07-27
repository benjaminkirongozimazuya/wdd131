import { db } from './firebase-config.js';
import { doc, updateDoc, increment, collection, addDoc, onSnapshot, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

let currentVideoId = null;

// =====================================
// 1. GESTION DES LIKES
// =====================================
async function toggleLike(videoId) {
    const likeCountElem = document.getElementById(`like-count-${videoId}`);
    
    // Mise à jour instantanée dans l'interface (Optimistic UI)
    let currentLikes = parseInt(likeCountElem.innerText);
    likeCountElem.innerText = currentLikes + 1;

    // Mise à jour sécurisée sur Firebase Firestore
    try {
        const videoRef = doc(db, "videos", videoId);
        await updateDoc(videoRef, {
            likes: increment(1)
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout du like :", error);
        likeCountElem.innerText = currentLikes; // Annuler en cas d'erreur
    }
}

// =====================================
// 2. GESTION DES COMMENTAIRES
// =====================================

// Ouvrir la modale et charger les commentaires en temps réel
function openComments(videoId) {
    currentVideoId = videoId;
    document.getElementById("comment-modal").classList.add("active");

    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = "<p>Chargement...</p>";

    // Écouter les commentaires de la vidéo spécifique dans Firestore
    const q = query(
        collection(db, "videos", videoId, "comments"), 
        orderBy("timestamp", "desc")
    );

    onSnapshot(q, (snapshot) => {
        commentsList.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            const commentElem = document.createElement("div");
            commentElem.className = "comment-item";
            commentElem.innerHTML = `<strong>${data.username || "Utilisateur"}</strong>: ${data.text}`;
            commentsList.appendChild(commentElem);
        });
    });
}

// Fermer la modale
function closeComments() {
    document.getElementById("comment-modal").classList.remove("active");
}

// Ajouter un commentaire
async function addComment(e) {
    e.preventDefault();
    const input = document.getElementById("comment-input");
    const text = input.value.trim();

    if (!text || !currentVideoId) return;

    try {
        // 1. Ajouter le commentaire dans la sous-collection
        await addDoc(collection(db, "videos", currentVideoId, "comments"), {
            text: text,
            username: "MazuyaUser", // Remplacez par le nom de l'utilisateur connecté
            timestamp: new Date()
        });

        // 2. Incrémenter le compteur global de commentaires sur la vidéo
        const videoRef = doc(db, "videos", currentVideoId);
        await updateDoc(videoRef, {
            commentsCount: increment(1)
        });

        input.value = ""; // Vider le champ d'envoi
    } catch (error) {
        console.error("Erreur d'envoi du commentaire :", error);
    }
}

// Exposer les fonctions au fichier HTML
window.toggleLike = toggleLike;
window.openComments = openComments;
window.closeComments = closeComments;
window.addComment = addComment;