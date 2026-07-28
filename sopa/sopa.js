// Configuration des clés TikTok Sandbox
const TIKTOK_CLIENT_KEY = 'sbawuh60d10xqti4n2';
const REDIRECT_URI = 'https://benjaminkirongozimazuya.github.io/wdd131/sopa/sopa.html';
const SCOPES = 'user.info.profile,user.info.stats,video.list';

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('tiktok-login-btn');
  const userStatus = document.getElementById('user-status');

  // 1. Génération du lien de connexion TikTok OAuth2
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&scope=${SCOPES}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  
  if (loginBtn) {
    loginBtn.href = authUrl;
  }

  // 2. Vérification si l'utilisateur revient de l'authentification TikTok
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');
  const error = urlParams.get('error');

  if (authCode) {
    userStatus.innerHTML = `<p style="color: green;"><strong>Connexion réussie !</strong><br>Code d'autorisation reçu : <code>${authCode}</code></p>`;
    // Ici, vous pouvez stocker le code ou l'envoyer à votre serveur backend pour récupérer le Token d'accès.
  } else if (error) {
    userStatus.innerHTML = `<p style="color: red;"><strong>Erreur d'authentification :</strong> ${error}</p>`;
  }
});