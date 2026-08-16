const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- AUDIO SYNTHESIS ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'shoot') {
    osc.type = "square";
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } else if (type === 'break') {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.18);
  } else if (type === 'treasure') {
    osc.type = "sine";
    osc.frequency.setValueAtTime(523, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1046, audioCtx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } else if (type === 'hurt') {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  }
}

// --- CONSTANTES ---
const TILE_SIZE = 50; // Grille 16x10

// --- CARTES DES NIVEAUX ---
const levelMaps = [
  // Niveau 1
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],
    [1,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 2
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,0,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,1,0,1,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,0,0,0,1,0,1,1,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 3
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 4
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],
    [1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],
    [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 5
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 6
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,0,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 7
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,0,0,1,0,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 8
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,0,0,0,0,1,1,1,0,0,0,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 9
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,1,0,0,1,1,1,0,1,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 10
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,1,1,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]
];

// --- CONFIGURATION DES NIVEAUX ---
const levelsConfig = [
  { level: 1, ammo: 8,  breakables: [[1,13],[2,14]], traps: [], enemies: [] },
  { level: 2, ammo: 10, breakables: [[2,13],[3,4]], traps: [[1,6]], enemies: [{x:375, y:75, vx:1.8, vy:0}] },
  { level: 3, ammo: 10, breakables: [[2,13],[8,7]], traps: [], enemies: [{x:400, y:175, vx:1.8, vy:0}] },
  { level: 4, ammo: 12, breakables: [[2,13],[6,13]], traps: [[5,8]], enemies: [{x:375, y:75, vx:2, vy:0},{x:175, y:225, vx:0, vy:1.8}] },
  { level: 5, ammo: 12, breakables: [[2,13],[6,13]], traps: [[1,8]], enemies: [{x:375, y:75, vx:2.2, vy:0},{x:425, y:375, vx:-2.2, vy:0}] },
  { level: 6, ammo: 12, breakables: [[2,14],[6,14]], traps: [[1,8]], enemies: [{x:375, y:175, vx:2.0, vy:0}] },
  { level: 7, ammo: 14, breakables: [[2,13],[6,13]], traps: [[1,6]], enemies: [{x:375, y:75, vx:2.5, vy:0},{x:175, y:225, vx:0, vy:2}] },
  { level: 8, ammo: 14, breakables: [[2,13],[6,13]], traps: [[1,6],[7,1]], enemies: [{x:375, y:75, vx:3, vy:0},{x:425, y:375, vx:-3, vy:0}] },
  { level: 9, ammo: 15, breakables: [[2,13],[6,11]], traps: [[1,6],[7,1]], enemies: [{x:375, y:75, vx:3, vy:0},{x:425, y:375, vx:-3, vy:0},{x:175, y:225, vx:0, vy:2.2}] },
  { level: 10, ammo: 18, breakables: [[2,13],[6,13]], traps: [[1,6],[7,7]], enemies: [{x:375, y:75, vx:3.5, vy:0},{x:425, y:375, vx:-3.5, vy:0},{x:175, y:225, vx:0, vy:3}] }
];

// --- ÉTAT DU JEU ---
let currentLevelIndex = 0;
let score = 0;
let ammo = 5;
let lives = 3;
let gameOver = false;

// Position du joueur
let player = {
  x: 75,
  y: 75,
  size: 20,
  speed: 3.5,
  dx: 0,
  dy: 0,
  isDashing: false,
  dashCooldown: 0,
  lastVx: 1,
  lastVy: 0
};

// Trésor (Position dynamique)
let treasure = { x: 0, y: 0, size: 24 };

// Tableaux dynamiques
let bullets = [];
let enemies = [];
let breakableWalls = [];
let traps = [];

// Commandes clavier robustes (compatible flèches, WASD, ZQSD)
const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  keys[e.key.toLowerCase()] = true;
  
  if (e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space') {
    triggerDash();
  }
  if (e.key === 'f' || e.key === 'F' || e.code === 'KeyF') {
    shootBullet();
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
  keys[e.key.toLowerCase()] = false;
});

// --- INITIALISATION DU NIVEAU ---
function loadLevel(index) {
  if (index >= levelsConfig.length) {
    index = 0;
  }
  currentLevelIndex = index;
  const config = levelsConfig[index];
  
  ammo = config.ammo;
  player.x = 75;
  player.y = 75;
  bullets = [];
  
  breakableWalls = config.breakables.map(pos => ({ r: pos[0], c: pos[1] }));
  traps = config.traps.map(pos => ({ r: pos[0], c: pos[1] }));
  
  enemies = config.enemies.map(en => ({
    x: en.x,
    y: en.y,
    vx: en.vx,
    vy: en.vy,
    size: 20
  }));

  placeRandomTreasure();
  updateHUD();
}

function placeRandomTreasure() {
  const map = levelMaps[currentLevelIndex];
  let emptyTiles = [];
  
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] === 0) {
        if (!(r === 1 && c === 1)) {
          emptyTiles.push({ r, c });
        }
      }
    }
  }
  
  if (emptyTiles.length > 0) {
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    treasure.x = randomTile.c * TILE_SIZE + TILE_SIZE / 2;
    treasure.y = randomTile.r * TILE_SIZE + TILE_SIZE / 2;
  }
}

// --- MÉCANISMES DU JOUEUR ---
function triggerDash() {
  if (player.dashCooldown <= 0 && !gameOver) {
    player.isDashing = true;
    player.dashCooldown = 60;
    setTimeout(() => { player.isDashing = false; }, 200);
  }
}

function shootBullet() {
  if (ammo > 0 && !gameOver) {
    ammo--;
    playSound('shoot');
    bullets.push({
      x: player.x,
      y: player.y,
      vx: player.lastVx * 8,
      vy: player.lastVy * 8,
      size: 6
    });
    updateHUD();
  }
}

// --- MISE À JOUR DE LA PHYSIQUE ET LOGIQUE ---
function update() {
  if (gameOver) return;

  player.dx = 0;
  player.dy = 0;
  let currentSpeed = player.isDashing ? player.speed * 2.2 : player.speed;

  // Lecture des mouvements compatibles
  if (keys['ArrowUp'] || keys['w'] || keys['W'] || keys['KeyW'] || keys['z'] || keys['Z'] || keys['KeyZ']) player.dy = -currentSpeed;
  if (keys['ArrowDown'] || keys['s'] || keys['S'] || keys['KeyS']) player.dy = currentSpeed;
  if (keys['ArrowLeft'] || keys['q'] || keys['Q'] || keys['KeyQ'] || keys['a'] || keys['A'] || keys['KeyA']) player.dx = -currentSpeed;
  if (keys['ArrowRight'] || keys['d'] || keys['D'] || keys['KeyD']) player.dx = currentSpeed;

  if (player.dx !== 0 || player.dy !== 0) {
    player.lastVx = player.dx !== 0 ? Math.sign(player.dx) : 0;
    player.lastVy = player.dy !== 0 ? Math.sign(player.dy) : 0;
  }

  movePlayerWithCollisions();

  if (player.dashCooldown > 0) player.dashCooldown--;

  // Mise à jour des balles
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.x += b.vx;
    b.y += b.vy;

    let map = levelMaps[currentLevelIndex];
    let tileR = Math.floor(b.y / TILE_SIZE);
    let tileC = Math.floor(b.x / TILE_SIZE);

    if (tileR < 0 || tileR >= map.length || tileC < 0 || tileC >= map[0].length || map[tileR][tileC] === 1) {
      bullets.splice(i, 1);
      continue;
    }

    let wallIndex = breakableWalls.findIndex(w => w.r === tileR && w.c === tileC);
    if (wallIndex !== -1) {
      breakableWalls.splice(wallIndex, 1);
      playSound('break');
      bullets.splice(i, 1);
    }
  }

  // Mise à jour des ennemis
  enemies.forEach(en => {
    en.x += en.vx;
    en.y += en.vy;

    if (en.x < 50 || en.x > canvas.width - 50) en.vx *= -1;
    if (en.y < 50 || en.y > canvas.height - 50) en.vy *= -1;

    let dist = Math.hypot(player.x - en.x, player.y - en.y);
    if (dist < player.size / 2 + en.size / 2 && !player.isDashing) {
      handlePlayerHit();
    }
  });

  // Collision avec le trésor
  let distTreasure = Math.hypot(player.x - treasure.x, player.y - treasure.y);
  if (distTreasure < player.size / 2 + treasure.size / 2) {
    playSound('treasure');
    score += 500;
    triggerLevelComplete();
  }
}

// Collisions fluides par axe
function movePlayerWithCollisions() {
  let map = levelMaps[currentLevelIndex];

  player.x += player.dx;
  if (checkCollision(player.x, player.y, map)) {
    player.x -= player.dx;
  }

  player.y += player.dy;
  if (checkCollision(player.x, player.y, map)) {
    player.y -= player.dy;
  }
}

function checkCollision(x, y, map) {
  let radius = player.size / 2;
  let points = [
    {x: x - radius, y: y - radius},
    {x: x + radius, y: y - radius},
    {x: x - radius, y: y + radius},
    {x: x + radius, y: y + radius}
  ];

  for (let p of points) {
    let r = Math.floor(p.y / TILE_SIZE);
    let c = Math.floor(p.x / TILE_SIZE);

    if (r < 0 || r >= map.length || c < 0 || c >= map[0].length) return true;
    if (map[r][c] === 1) return true;

    if (breakableWalls.some(w => w.r === r && w.c === c)) return true;
  }
  return false;
}

function handlePlayerHit() {
  playSound('hurt');
  lives--;
  updateHUD();
  if (lives <= 0) {
    triggerGameOver();
  } else {
    player.x = 75;
    player.y = 75;
  }
}

function triggerLevelComplete() {
  if (currentLevelIndex + 1 < levelsConfig.length) {
    showOverlay("LEVEL COMPLETE !", "Préparez-vous pour le niveau suivant !", "NIVEAU SUIVANT", () => {
      loadLevel(currentLevelIndex + 1);
    });
  } else {
    showOverlay("VICTOIRE ULTIME !", "Vous avez vaincu tous les labyrinthes !", "REJOUER", () => {
      score = 0;
      lives = 3;
      loadLevel(0);
    });
  }
}

function triggerGameOver() {
  gameOver = true;
  showOverlay("GAME OVER", "Le réseau vous a eu...", "RÉESSAYER", () => {
    lives = 3;
    gameOver = false;
    loadLevel(currentLevelIndex);
  });
}

function showOverlay(title, msg, btnText, callback) {
  gameOver = true;
  const screen = document.getElementById("game-over-screen");
  document.getElementById("over-title").innerText = title;
  document.getElementById("over-msg").innerText = msg;
  const btn = document.getElementById("btn-action-main");
  btn.innerText = btnText;
  
  btn.onclick = () => {
    screen.classList.add("hidden");
    gameOver = false; // <-- Correction : Débloque le jeu lors du changement de niveau ou redémarrage
    callback();
  };
  screen.classList.remove("hidden");
}

function updateHUD() {
  document.getElementById("level-val").innerText = `${currentLevelIndex + 1}/${levelsConfig.length}`;
  document.getElementById("score-val").innerText = String(score).padStart(4, '0');
  document.getElementById("ammo-val").innerText = String(ammo).padStart(2, '0');
  document.getElementById("lives-val").innerText = '♥'.repeat(Math.max(0, lives));
}

// --- RENDU GRAPHIQUE ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let map = levelMaps[currentLevelIndex];

  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] === 1) {
        ctx.fillStyle = "#16192b";
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 1;
        ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  ctx.fillStyle = "#e67e22";
  breakableWalls.forEach(w => {
    ctx.fillRect(w.c * TILE_SIZE + 2, w.r * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  });

  ctx.fillStyle = "#ffcc00";
  ctx.shadowColor = "#ffcc00";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(treasure.x, treasure.y, treasure.size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = player.isDashing ? "#ff007f" : "#00f3ff";
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#00ff66";
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#ff1a1a";
  enemies.forEach(en => {
    ctx.shadowColor = "#ff1a1a";
    ctx.shadowBlur = 10;
    ctx.fillRect(en.x - en.size / 2, en.y - en.size / 2, en.size, en.size);
    ctx.shadowBlur = 0;
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Contrôles tactiles / boutons mobiles
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

if (btnUp) {
  btnUp.addEventListener('touchstart', () => { keys['ArrowUp'] = true; });
  btnUp.addEventListener('touchend', () => { keys['ArrowUp'] = false; });
}
if (btnDown) {
  btnDown.addEventListener('touchstart', () => { keys['ArrowDown'] = true; });
  btnDown.addEventListener('touchend', () => { keys['ArrowDown'] = false; });
}
if (btnLeft) {
  btnLeft.addEventListener('touchstart', () => { keys['ArrowLeft'] = true; });
  btnLeft.addEventListener('touchend', () => { keys['ArrowLeft'] = false; });
}
if (btnRight) {
  btnRight.addEventListener('touchstart', () => { keys['ArrowRight'] = true; });
  btnRight.addEventListener('touchend', () => { keys['ArrowRight'] = false; });
}

const btnDash = document.getElementById('btn-dash');
const btnShoot = document.getElementById('btn-shoot');
if (btnDash) btnDash.addEventListener('click', triggerDash);
if (btnShoot) btnShoot.addEventListener('click', shootBullet);

// Gestion de la modale d'aide
const btnHelp = document.getElementById('btn-help');
const btnCloseHelp = document.getElementById('btn-close-help');
if (btnHelp) {
  btnHelp.addEventListener('click', () => {
    document.getElementById('help-modal').classList.remove('hidden');
    gameOver = true;
  });
}
if (btnCloseHelp) {
  btnCloseHelp.addEventListener('click', () => {
    document.getElementById('help-modal').classList.add('hidden');
    gameOver = false;
  });
}

// Démarrage initial
loadLevel(0);
gameLoop();