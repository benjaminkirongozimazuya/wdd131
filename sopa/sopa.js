// Configuration TikTok Sandbox
const TIKTOK_CLIENT_KEY = 'sbawuh60d10xqti4n2';
const REDIRECT_URI = 'https://benjaminkirongozimazuya.github.io/wdd131/sopa/sopa.html';
const SCOPES = 'user.info.profile,user.info.stats,video.list';

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('tiktok-login-btn');
  const userStatus = document.getElementById('user-status');

  // Génération de l'URL d'autorisation
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&scope=${SCOPES}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  
  if (loginBtn) {
    loginBtn.href = authUrl;
  }

  // Lecture du retour TikTok
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');
  const error = urlParams.get('error');

  if (authCode) {
    userStatus.innerHTML = `
      <div style="background: rgba(37, 244, 238, 0.1); border: 1px solid #25F4EE; color: #25F4EE; padding: 12px; border-radius: 8px;">
        ✅ <strong>Connexion réussie !</strong><br>
        <span style="font-size: 0.8rem; color: #a0a0b0;">Code reçu : ${authCode}</span>
      </div>
    `;
  } else if (error) {
    userStatus.innerHTML = `
      <div style="background: rgba(254, 44, 85, 0.1); border: 1px solid #FE2C55; color: #FE2C55; padding: 12px; border-radius: 8px;">
        ❌ <strong>Erreur :</strong> ${error}
      </div>
    `;
  }
});