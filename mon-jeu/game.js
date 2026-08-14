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

// 1: Mur solide | 0: Chemin libre | 2: Piège/Zone rouge | 3: Mur destructible

// --- 30 CARTES RÉÉQUILIBRÉES ET SOLVABLES ---
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
  ],
  // Niveau 11
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,0,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 12 (Refonte complète & fluide)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 13
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,0,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,0,1,0,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 14
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1],
    [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 15
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 16
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 17
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,0,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,1,1,0,1],
    [1,1,1,0,1,0,1,1,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,1,1,1,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 18
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
  // Niveau 19
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
  // Niveau 20
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
  // Niveau 21
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
  // Niveau 22
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
  // Niveau 23
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
  // Niveau 24
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
  // Niveau 25
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
  // Niveau 26
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
  // Niveau 27
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
  ],
  // Niveau 28
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,0,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 29
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1],
    [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Niveau 30 : L'Ultime Labyrinthe du Maître
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]
];

// --- CONFIGURATION DES 30 NIVEAUX ---
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
  { level: 10, ammo: 18, breakables: [[2,13],[6,13]], traps: [[1,6],[7,7]], enemies: [{x:375, y:75, vx:3.5, vy:0},{x:425, y:375, vx:-3.5, vy:0},{x:175, y:225, vx:0, vy:3}] },
  { level: 11, ammo: 16, breakables: [[1,11],[5,11]], traps: [[3,7]], enemies: [{x:375, y:75, vx:3, vy:0},{x:225, y:225, vx:0, vy:2.5}] },
  { level: 12, ammo: 18, breakables: [[3,3],[6,5]], traps: [[4,11]], enemies: [{x:325, y:175, vx:2.5, vy:0},{x:375, y:325, vx:0, vy:2}] },
  { level: 13, ammo: 18, breakables: [[3,13],[6,11]], traps: [[1,1],[7,7]], enemies: [{x:325, y:75, vx:3.5, vy:0},{x:425, y:275, vx:-3.5, vy:0},{x:175, y:225, vx:0, vy:2.8}] },
  { level: 14, ammo: 20, breakables: [[2,14],[6,13]], traps: [[1,6],[5,10]], enemies: [{x:375, y:75, vx:3.8, vy:0},{x:425, y:375, vx:-3.8, vy:0},{x:225, y:175, vx:0, vy:3.2}] },
  { level: 15, ammo: 22, breakables: [[3,13],[6,13]], traps: [[1,6],[7,7],[5,2]], enemies: [{x:375, y:75, vx:4, vy:0},{x:425, y:375, vx:-4, vy:0},{x:175, y:225, vx:0, vy:3.5},{x:525, y:225, vx:0, vy:-3.5}] },
  { level: 16, ammo: 16, breakables: [[1,10],[6,3]], traps: [[2,4]], enemies: [{x:300, y:150, vx:2.5, vy:0}] },
  { level: 17, ammo: 18, breakables: [[3,13],[7,6]], traps: [[4,2],[6,10]], enemies: [{x:350, y:100, vx:0, vy:2.5},{x:500, y:300, vx:-2.5, vy:0}] },
  { level: 18, ammo: 18, breakables: [[2,13],[6,13]], traps: [[1,6]], enemies: [{x:375, y:75, vx:3, vy:0},{x:200, y:200, vx:0, vy:2.5}] },
  { level: 19, ammo: 20, breakables: [[2,13],[7,10]], traps: [[3,4],[5,8]], enemies: [{x:400, y:150, vx:-3, vy:0},{x:150, y:300, vx:2, vy:0}] },
  { level: 20, ammo: 20, breakables: [[4,13],[8,7]], traps: [[2,6]], enemies: [{x:300, y:200, vx:3, vy:0},{x:450, y:100, vx:0, vy:3}] },
  { level: 21, ammo: 22, breakables: [[2,13],[6,11]], traps: [[1,6],[6,3]], enemies: [{x:375, y:75, vx:3.2, vy:0},{x:425, y:375, vx:-3.2, vy:0},{x:200, y:200, vx:0, vy:2.5}] },
  { level: 22, ammo: 22, breakables: [[1,11],[4,11]], traps: [[2,2],[5,6]], enemies: [{x:350, y:150, vx:3.5, vy:0},{x:250, y:300, vx:0, vy:-3}] },
  { level: 23, ammo: 24, breakables: [[2,14],[6,14]], traps: [[1,6],[7,1]], enemies: [{x:375, y:100, vx:3.5, vy:0},{x:400, y:300, vx:-3.5, vy:0},{x:150, y:200, vx:0, vy:3}] },
  { level: 24, ammo: 24, breakables: [[2,13],[6,13]], traps: [[1,6],[4,8]], enemies: [{x:375, y:75, vx:3.8, vy:0},{x:425, y:375, vx:-3.8, vy:0},{x:225, y:225, vx:0, vy:3.2}] },
  { level: 25, ammo: 25, breakables: [[2,13],[5,10]], traps: [[2,4],[6,6]], enemies: [{x:300, y:150, vx:4, vy:0},{x:500, y:300, vx:-4, vy:0},{x:200, y:250, vx:0, vy:3.5}] },
  { level: 26, ammo: 25, breakables: [[3,11],[6,11]], traps: [[1,6],[7,7]], enemies: [{x:375, y:75, vx:4, vy:0},{x:425, y:375, vx:-4, vy:0},{x:175, y:225, vx:0, vy:3.5}] },
  { level: 27, ammo: 26, breakables: [[2,13],[6,13]], traps: [[1,6],[4,7]], enemies: [{x:350, y:100, vx:4.2, vy:0},{x:450, y:350, vx:-4.2, vy:0},{x:200, y:200, vx:0, vy:3.8}] },
  { level: 28, ammo: 26, breakables: [[1,11],[6,11]], traps: [[2,3],[6,7]], enemies: [{x:375, y:75, vx:4.5, vy:0},{x:425, y:375, vx:-4.5, vy:0},{x:175, y:225, vx:0, vy:4}] },
  { level: 29, ammo: 28, breakables: [[2,13],[6,13]], traps: [[1,6],[5,10]], enemies: [{x:375, y:75, vx:4.5, vy:0},{x:425, y:375, vx:-4.5, vy:0},{x:225, y:175, vx:0, vy:4},{x:300, y:250, vx:-4, vy:0}] },
  { level: 30, ammo: 30, breakables: [[3,13],[6,13]], traps: [[1,6],[7,7],[5,2]], enemies: [{x:375, y:75, vx:5, vy:0},{x:425, y:375, vx:-5, vy:0},{x:175, y:225, vx:0, vy:4.5},{x:525, y:225, vx:0, vy:-4.5}] }
];

// --- ÉTATS DU JEU ---
let currentLevelIndex = 0;
let score = 0;
let ammo = 5;
let lives = 3;
let gameState = "RUNNING";

let currentMap = [];
let breakableWallsHP = {};
let bullets = [];
let enemies = [];

const levelElem = document.getElementById("level-val");
const scoreElem = document.getElementById("score-val");
const ammoElem = document.getElementById("ammo-val");
const livesElem = document.getElementById("lives-val");
const gameOverScreen = document.getElementById("game-over-screen");
const helpModal = document.getElementById("help-modal");

// --- JOUEUR & TRÉSOR ---
const player = {
  x: 75, y: 75, radius: 14,
  vx: 0, vy: 0, speed: 0.8, friction: 0.85,
  color: "#00f3ff", isDashing: false, dashCooldown: 0, invulnerable: 0,
  dirX: 1, dirY: 0
};

const treasure = { x: 725, y: 75, radius: 15 };

// --- CHARGEMENT DU NIVEAU ---
function loadLevel(index) {
  const config = levelsConfig[index];
  currentLevelIndex = index;
  ammo = config.ammo;
  
  levelElem.innerText = `${config.level}/30`;
  ammoElem.innerText = String(ammo).padStart(2, '0');

  currentMap = JSON.parse(JSON.stringify(levelMaps[index]));
  breakableWallsHP = {};

  config.breakables.forEach(([r, c]) => {
    currentMap[r][c] = 3;
    breakableWallsHP[`${r}_${c}`] = 2;
  });

  config.traps.forEach(([r, c]) => {
    currentMap[r][c] = 2;
  });

  enemies = config.enemies.map(e => ({ x: e.x, y: e.y, vx: e.vx, vy: e.vy, radius: 12 }));

  player.x = 75; player.y = 75; player.vx = 0; player.vy = 0;
  bullets = [];
}

// --- CONTRÔLES ---
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, Space: false, KeyF: false };

window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
  if (e.code === "Space") keys.Space = true;
  if (e.code === "KeyF") {
    if (!keys.KeyF && gameState === "RUNNING") shootBullet();
    keys.KeyF = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
  if (e.code === "Space") keys.Space = false;
  if (e.code === "KeyF") keys.KeyF = false;
});

// Modal Aide
document.getElementById("btn-help").addEventListener("click", () => {
  gameState = "PAUSED";
  helpModal.classList.remove("hidden");
});

document.getElementById("btn-close-help").addEventListener("click", () => {
  helpModal.classList.add("hidden");
  gameState = "RUNNING";
});

// Mobile Controls
const bindBtn = (id, action) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener("touchstart", (e) => { e.preventDefault(); action(true); });
  btn.addEventListener("touchend", (e) => { e.preventDefault(); action(false); });
};

bindBtn("btn-up", (s) => keys.ArrowUp = s);
bindBtn("btn-down", (s) => keys.ArrowDown = s);
bindBtn("btn-left", (s) => keys.ArrowLeft = s);
bindBtn("btn-right", (s) => keys.ArrowRight = s);
bindBtn("btn-dash", (s) => keys.Space = s);
bindBtn("btn-shoot", (s) => { if (s && gameState === "RUNNING") shootBullet(); });

function shootBullet() {
  if (ammo <= 0) return;
  ammo--;
  ammoElem.innerText = String(ammo).padStart(2, '0');
  playSound('shoot');

  bullets.push({
    x: player.x, y: player.y,
    vx: player.dirX * 8, vy: player.dirY * 8, radius: 4
  });
}

function isSolid(x, y) {
  let col = Math.floor(x / TILE_SIZE);
  let row = Math.floor(y / TILE_SIZE);
  if (row < 0 || row >= 10 || col < 0 || col >= 16) return true;
  return currentMap[row][col] === 1 || currentMap[row][col] === 3;
}

function canMove(newX, newY, radius) {
  const r = radius * 0.8;
  return !(isSolid(newX - r, newY - r) || isSolid(newX + r, newY - r) ||
           isSolid(newX - r, newY + r) || isSolid(newX + r, newY + r));
}

// --- MISE À JOUR (LOGIQUE) ---
function update() {
  if (gameState !== "RUNNING") return;

  if (keys.ArrowUp) { player.dirX = 0; player.dirY = -1; }
  if (keys.ArrowDown) { player.dirX = 0; player.dirY = 1; }
  if (keys.ArrowLeft) { player.dirX = -1; player.dirY = 0; }
  if (keys.ArrowRight) { player.dirX = 1; player.dirY = 0; }

  let currentSpeed = player.speed;
  if (keys.Space && player.dashCooldown <= 0) {
    player.isDashing = true;
    player.dashCooldown = 60;
  }
  if (player.isDashing) {
    currentSpeed = player.speed * 4;
    if (player.dashCooldown < 50) player.isDashing = false;
  }
  if (player.dashCooldown > 0) player.dashCooldown--;

  if (keys.ArrowUp) player.vy -= currentSpeed;
  if (keys.ArrowDown) player.vy += currentSpeed;
  if (keys.ArrowLeft) player.vx -= currentSpeed;
  if (keys.ArrowRight) player.vx += currentSpeed;

  player.vx *= player.friction;
  player.vy *= player.friction;

  if (canMove(player.x + player.vx, player.y, player.radius)) player.x += player.vx;
  if (canMove(player.x, player.y + player.vy, player.radius)) player.y += player.vy;

  if (player.invulnerable > 0) player.invulnerable--;

  // Degats piege (zones rouges)
  let pCol = Math.floor(player.x / TILE_SIZE);
  let pRow = Math.floor(player.y / TILE_SIZE);
  if (pRow >= 0 && pRow < 10 && pCol >= 0 && pCol < 16) {
    if (currentMap[pRow][pCol] === 2 && player.invulnerable === 0) {
      takeDamage();
    }
  }

  // Balles
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.x += b.vx;
    b.y += b.vy;
    let col = Math.floor(b.x / TILE_SIZE);
    let row = Math.floor(b.y / TILE_SIZE);

    if (row >= 0 && row < 10 && col >= 0 && col < 16) {
      if (currentMap[row][col] === 1) {
        bullets.splice(i, 1);
      } else if (currentMap[row][col] === 3) {
        bullets.splice(i, 1);
        let key = `${row}_${col}`;
        breakableWallsHP[key]--;
        if (breakableWallsHP[key] <= 0) {
          currentMap[row][col] = 0;
          playSound('break');
          score += 20;
          scoreElem.innerText = String(score).padStart(4, '0');
        } else {
          playSound('break');
        }
      }
    }
  }

  // Ennemis
  enemies.forEach(enemy => {
    if (canMove(enemy.x + enemy.vx, enemy.y + enemy.vy, enemy.radius)) {
      enemy.x += enemy.vx;
      enemy.y += enemy.vy;
    } else {
      enemy.vx *= -1;
      enemy.vy *= -1;
    }

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    if (Math.sqrt(dx*dx + dy*dy) < player.radius + enemy.radius && player.invulnerable === 0) {
      takeDamage();
    }
  });

  // Collision avec le Trésor
  const dxT = player.x - treasure.x;
  const dyT = player.y - treasure.y;
  if (Math.sqrt(dxT*dxT + dyT*dyT) < player.radius + treasure.radius) {
    playSound('treasure');
    score += 100 * (currentLevelIndex + 1);
    scoreElem.innerText = String(score).padStart(4, '0');

    if (currentLevelIndex < 29) {
      gameState = "LEVEL_WIN";
      showOverlay("NIVEAU COMPLÉTÉ !", `Nouveau labyrinthe débloqué : Niveau ${currentLevelIndex + 2}`, "NIVEAU SUIVANT");
    } else {
      gameState = "GAME_WIN";
      showOverlay("VICTOIRE FINALE !", "Félicitations ! Vous avez traversé les 30 labyrinthes !", "REJOUER DU DÉBUT");
    }
  }
}

function takeDamage() {
  playSound('hurt');
  lives--;
  updateLivesDisplay();
  if (lives <= 0) {
    gameState = "OVER";
    showOverlay("GAME OVER", "Le système vous a éliminé.", "RÉESSAYER");
  } else {
    player.x = 75; player.y = 75; player.invulnerable = 90;
  }
}

function updateLivesDisplay() {
  let hearts = "";
  for (let i = 0; i < lives; i++) hearts += "♥";
  livesElem.innerText = hearts;
}

function showOverlay(title, msg, btnText) {
  document.getElementById("over-title").innerText = title;
  document.getElementById("over-msg").innerText = msg;
  document.getElementById("btn-action-main").innerText = btnText;
  gameOverScreen.classList.remove("hidden");
}

function handleScreenAction() {
  gameOverScreen.classList.add("hidden");
  if (gameState === "LEVEL_WIN") {
    loadLevel(currentLevelIndex + 1);
    gameState = "RUNNING";
  } else if (gameState === "OVER" || gameState === "GAME_WIN") {
    score = 0;
    lives = 3;
    scoreElem.innerText = "0000";
    updateLivesDisplay();
    loadLevel(0);
    gameState = "RUNNING";
  }
}

// --- RENDU GRAPHIQUE ---
function draw() {
  ctx.fillStyle = "#05070e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 16; col++) {
      let x = col * TILE_SIZE;
      let y = row * TILE_SIZE;
      if (currentMap[row][col] === 1) {
        ctx.fillStyle = "#16192b";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = "rgba(0, 243, 255, 0.3)";
        ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      } else if (currentMap[row][col] === 3) {
        ctx.fillStyle = "#d35400";
        ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.strokeStyle = "#e67e22";
        ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      } else if (currentMap[row][col] === 2) {
        ctx.fillStyle = "rgba(255, 26, 26, 0.25)";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // Trésor
  ctx.save();
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#ffcc00";
  ctx.fillStyle = "#ffcc00";
  ctx.fillRect(treasure.x - 12, treasure.y - 10, 24, 20);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(treasure.x - 3, treasure.y - 3, 6, 6);
  ctx.restore();

  // Balles
  bullets.forEach(b => {
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ff66";
    ctx.fillStyle = "#00ff66";
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Ennemis
  enemies.forEach(e => {
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff1a1a";
    ctx.fillStyle = "#ff1a1a";
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Joueur
  ctx.save();
  if (player.invulnerable > 0 && Math.floor(Date.now() / 100) % 2 === 0) ctx.globalAlpha = 0.3;
  ctx.shadowBlur = 15;
  ctx.shadowColor = player.color;
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(player.x + player.dirX * 10, player.y + player.dirY * 10, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Lancement initial
loadLevel(0);
gameLoop();