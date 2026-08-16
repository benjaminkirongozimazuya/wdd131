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
const TILE_SIZE = 50;

// --- CARTES DES 30 NIVEAUX ---
const levelMaps = [
  // Niveau 1
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1],[1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,0,1,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],[1,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 2
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],[1,1,1,1,0,0,1,0,1,1,1,1,1,1,0,1],[1,0,0,0,1,0,1,0,1,0,0,0,0,1,0,1],[1,0,1,0,1,0,0,0,1,0,1,1,0,0,0,1],[1,0,1,0,1,1,1,1,1,0,1,1,0,1,0,1],[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 3
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1],[1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,0,1,1,1,1,1,1,1,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 4
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],[1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1],[1,0,1,0,1,1,1,0,1,1,1,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],[1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 5
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],[1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],[1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 6
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1],[1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],[1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1],[1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],[1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,0,1,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 7
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],[1,0,1,1,0,0,1,0,1,1,0,1,0,1,0,1],[1,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1],[1,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1],[1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],[1,1,1,0,1,0,0,1,1,1,0,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 8
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,1,0,0,0,0,1,1,1,0,0,0,1,1,0,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,1,1,1,0,1,1,1,1,1,0,1,0,1],[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],[1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 9
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],[1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1],[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],[1,1,0,0,1,1,1,0,1,1,0,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 10
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],[1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1],[1,0,1,0,1,0,0,0,0,0,1,1,0,1,0,1],[1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 11
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1],[1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],[1,0,1,0,1,1,1,0,1,1,1,0,1,1,0,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 12
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1],[1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,0,1,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],[1,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 13
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,1,0,1,1,1,0,1],[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],[1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],[1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 14
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1],[1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,0,1,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],[1,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 15
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],[1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1],[1,0,1,0,1,1,1,0,1,1,1,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],[1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 16
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],[1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],[1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 17
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1],[1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],[1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1],[1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],[1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,0,1,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 18
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],[1,0,1,1,0,0,1,0,1,1,0,1,0,1,0,1],[1,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1],[1,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1],[1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],[1,1,1,0,1,0,0,1,1,1,0,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 19
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,1,0,0,0,0,1,1,1,0,0,0,1,1,0,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,1,1,1,0,1,1,1,1,1,0,1,0,1],[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],[1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 20
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],[1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1],[1,0,1,0,1,0,0,0,0,0,1,1,0,1,0,1],[1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 21
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1],[1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,0,1,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],[1,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 22
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],[1,1,1,1,0,0,1,0,1,1,1,1,1,1,0,1],[1,0,0,0,1,0,1,0,1,0,0,0,0,1,0,1],[1,0,1,0,1,0,0,0,1,0,1,1,0,0,0,1],[1,0,1,0,1,1,1,1,1,0,1,1,0,1,0,1],[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 23
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1],[1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,0,1,1,1,1,1,1,1,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 24
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],[1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1],[1,0,1,0,1,1,1,0,1,1,1,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],[1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 25
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],[1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],[1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 26
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1],[1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],[1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1],[1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],[1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,0,1,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 27
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],[1,0,1,1,0,0,1,0,1,1,0,1,0,1,0,1],[1,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1],[1,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1],[1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],[1,1,1,0,1,0,0,1,1,1,0,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 28
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,1,0,0,0,0,1,1,1,0,0,0,1,1,0,1],[1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],[1,0,1,1,1,1,0,1,1,1,1,1,0,1,0,1],[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],[1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 29
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],[1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1],[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],[1,1,0,0,1,1,1,0,1,1,0,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  // Niveau 30 (Niveau Final Ultime)
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],[1,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1],[1,0,1,0,1,0,0,0,0,0,1,1,0,1,0,1],[1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,1],[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
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
  { level: 10, ammo: 16, breakables: [[2,13],[6,13]], traps: [[1,6],[7,7]], enemies: [{x:375, y:75, vx:3.5, vy:0},{x:425, y:375, vx:-3.5, vy:0},{x:175, y:225, vx:0, vy:3}] },
  { level: 11, ammo: 16, breakables: [[2,13],[4,7]], traps: [[1,7]], enemies: [{x:375, y:75, vx:3.5, vy:0},{x:225, y:225, vx:0, vy:3}] },
  { level: 12, ammo: 18, breakables: [[2,13],[6,13]], traps: [[1,6],[7,7]], enemies: [{x:375, y:75, vx:3.8, vy:0},{x:425, y:375, vx:-3.8, vy:0},{x:175, y:225, vx:0, vy:3.2}] },
  { level: 13, ammo: 18, breakables: [[2,14],[3,4]], traps: [[2,6]], enemies: [{x:375, y:75, vx:4, vy:0},{x:200, y:200, vx:0, vy:3.5}] },
  { level: 14, ammo: 18, breakables: [[2,13],[6,13]], traps: [[1,6]], enemies: [{x:375, y:75, vx:4, vy:0},{x:425, y:375, vx:-4, vy:0}] },
  { level: 15, ammo: 20, breakables: [[2,13],[6,13]], traps: [[5,8]], enemies: [{x:375, y:75, vx:4.2, vy:0},{x:175, y:225, vx:0, vy:3.8},{x:300, y:300, vx:2, vy:2}] },
  { level: 16, ammo: 20, breakables: [[2,13],[6,13]], traps: [[1,8]], enemies: [{x:375, y:75, vx:4.5, vy:0},{x:425, y:375, vx:-4.5, vy:0}] },
  { level: 17, ammo: 20, breakables: [[2,14],[6,14]], traps: [[1,8]], enemies: [{x:375, y:175, vx:4.5, vy:0},{x:200, y:200, vx:0, vy:4}] },
  { level: 18, ammo: 22, breakables: [[2,13],[6,13]], traps: [[1,6]], enemies: [{x:375, y:75, vx:4.8, vy:0},{x:175, y:225, vx:0, vy:4.2},{x:250, y:250, vx:-3, vy:3}] },
  { level: 19, ammo: 22, breakables: [[2,13],[6,13]], traps: [[1,6],[7,1]], enemies: [{x:375, y:75, vx:5, vy:0},{x:425, y:375, vx:-5, vy:0}] },
  { level: 20, ammo: 24, breakables: [[2,13],[6,11]], traps: [[1,6],[7,1]], enemies: [{x:375, y:75, vx:5, vy:0},{x:425, y:375, vx:-5, vy:0},{x:175, y:225, vx:0, vy:4.5}] },
  { level: 21, ammo: 24, breakables: [[2,13],[6,13]], traps: [[1,6],[7,7]], enemies: [{x:375, y:75, vx:5.2, vy:0},{x:425, y:375, vx:-5.2, vy:0},{x:175, y:225, vx:0, vy:4.8}] },
  { level: 22, ammo: 25, breakables: [[2,13],[4,7]], traps: [[1,7]], enemies: [{x:375, y:75, vx:5.5, vy:0},{x:225, y:225, vx:0, vy:5}] },
  { level: 23, ammo: 25, breakables: [[2,13],[6,13]], traps: [[1,6],[7,7]], enemies: [{x:375, y:75, vx:5.8, vy:0},{x:425, y:375, vx:-5.8, vy:0},{x:175, y:225, vx:0, vy:5.2}] },
  { level: 24, ammo: 26, breakables: [[2,14],[3,4]], traps: [[2,6]], enemies: [{x:375, y:75, vx:6, vy:0},{x:200, y:200, vx:0, vy:5.5}] },
  { level: 25, ammo: 26, breakables: [[2,13],[6,13]], traps: [[1,6]], enemies: [{x:375, y:75, vx:6.2, vy:0},{x:425, y:375, vx:-6.2, vy:0},{x:300, y:300, vx:4, vy:4}] },
  { level: 26, ammo: 28, breakables: [[2,13],[6,13]], traps: [[5,8]], enemies: [{x:375, y:75, vx:6.5, vy:0},{x:175, y:225, vx:0, vy:5.8},{x:250, y:250, vx:-4, vy:4}] },
  { level: 27, ammo: 28, breakables: [[2,13],[6,13]], traps: [[1,8]], enemies: [{x:375, y:75, vx:6.8, vy:0},{x:425, y:375, vx:-6.8, vy:0},{x:200, y:200, vx:0, vy:6}] },
  { level: 28, ammo: 30, breakables: [[2,14],[6,14]], traps: [[1,8]], enemies: [{x:375, y:175, vx:7, vy:0},{x:200, y:200, vx:0, vy:6.2},{x:300, y:300, vx:-5, vy:5}] },
  { level: 29, ammo: 30, breakables: [[2,13],[6,13]], traps: [[1,6]], enemies: [{x:375, y:75, vx:7.2, vy:0},{x:175, y:225, vx:0, vy:6.5},{x:400, y:200, vx:-6, vy:6}] },
  { level: 30, ammo: 35, breakables: [[2,13],[6,13]], traps: [[1,6],[7,7]], enemies: [{x:375, y:75, vx:8, vy:0},{x:425, y:375, vx:-8, vy:0},{x:175, y:225, vx:0, vy:7},{x:250, y:250, vx:5, vy:5}] }
];

// --- ÉTAT DU JEU ---
let currentLevelIndex = 0;
let score = 0;
let ammo = 5;
let lives = 3;
let gameOver = false;
let screenShake = 0;

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

let treasure = { x: 0, y: 0, size: 24, pulse: 0 };
let bullets = [];
let enemies = [];
let breakableWalls = [];
let traps = [];
let magicalParticles = [];
const keys = {};

// --- GESTIONNAIRES D'ÉVÉNEMENTS CLAVIER & TACTILE ---
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  keys[e.key.toLowerCase()] = true;
  if (e.key === ' ' || e.code === 'Space') { triggerDash(); }
  if (e.key === 'f' || e.key === 'F' || e.code === 'KeyF') { shootBullet(); }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
  keys[e.key.toLowerCase()] = false;
});

// Contrôles tactiles mobiles
document.getElementById('btn-up').addEventListener('touchstart', () => keys['ArrowUp'] = true);
document.getElementById('btn-up').addEventListener('touchend', () => keys['ArrowUp'] = false);
document.getElementById('btn-down').addEventListener('touchstart', () => keys['ArrowDown'] = true);
document.getElementById('btn-down').addEventListener('touchend', () => keys['ArrowDown'] = false);
document.getElementById('btn-left').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('btn-left').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('btn-right').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('btn-right').addEventListener('touchend', () => keys['ArrowRight'] = false);

document.getElementById('btn-shoot').addEventListener('click', shootBullet);
document.getElementById('btn-dash').addEventListener('click', triggerDash);

// Bouton Aide & Modale
document.getElementById('btn-help').addEventListener('click', () => {
  document.getElementById('help-modal').classList.remove('hidden');
});
document.getElementById('btn-close-help').addEventListener('click', () => {
  document.getElementById('help-modal').classList.add('hidden');
});

function loadLevel(index) {
  if (index >= levelsConfig.length) index = 0;
  currentLevelIndex = index;
  const config = levelsConfig[index] || levelsConfig[0];
  
  ammo = config.ammo;
  player.x = 75;
  player.y = 75;
  bullets = [];
  magicalParticles = [];
  gameOver = false;
  
  breakableWalls = config.breakables.map(pos => ({ r: pos[0], c: pos[1] }));
  traps = config.traps.map(pos => ({ r: pos[0], c: pos[1] }));
  enemies = config.enemies.map(en => ({ x: en.x, y: en.y, vx: en.vx, vy: en.vy, size: 20 }));

  placeRandomTreasure();
  updateHUD();
}

function placeRandomTreasure() {
  treasure.x = 300;
  treasure.y = 300;
}

function createSparkles(x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    magicalParticles.push({
      x: x, y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 4 + 2,
      color: color,
      life: 30
    });
  }
}

function triggerDash() {
  if (player.dashCooldown <= 0 && !gameOver) {
    player.isDashing = true;
    player.dashCooldown = 60;
    createSparkles(player.x, player.y, "#ff007f", 18);
    screenShake = 6;
    setTimeout(() => { player.isDashing = false; }, 200);
  }
}

function shootBullet() {
  if (ammo > 0 && !gameOver) {
    ammo--;
    playSound('shoot');
    createSparkles(player.x, player.y, "#00ff66", 6);
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

function movePlayerWithCollisions() {
  player.x += player.dx;
  player.y += player.dy;
}

function handlePlayerHit() {
  lives--;
  playSound('hurt');
  screenShake = 12;
  updateHUD();
  if (lives <= 0) {
    gameOver = true;
    document.getElementById('over-title').innerText = "GAME OVER";
    document.getElementById('over-msg').innerText = "Vous avez perdu toutes vos vies...";
    document.getElementById('game-over-screen').classList.remove('hidden');
  } else {
    player.x = 75;
    player.y = 75;
  }
}

function triggerLevelComplete() {
  gameOver = true;
  document.getElementById('over-title').innerText = "LEVEL COMPLETE !";
  document.getElementById('over-msg').innerText = "Préparez-vous pour le niveau suivant...";
  document.getElementById('game-over-screen').classList.remove('hidden');
}

function handleScreenAction() {
  document.getElementById('game-over-screen').classList.add('hidden');
  if (lives <= 0) {
    lives = 3;
    score = 0;
    loadLevel(0);
  } else {
    loadLevel(currentLevelIndex + 1);
  }
}

function updateHUD() {
  document.getElementById('level-val').innerText = `${currentLevelIndex + 1}/10`;
  document.getElementById('score-val').innerText = String(score).padStart(4, '0');
  document.getElementById('ammo-val').innerText = String(ammo).padStart(2, '0');
  document.getElementById('lives-val').innerText = '♥'.repeat(Math.max(0, lives));
}

function update() {
  if (gameOver) return;
  if (screenShake > 0) screenShake--;

  player.dx = 0;
  player.dy = 0;
  let currentSpeed = player.isDashing ? player.speed * 2.5 : player.speed;

  if (keys['ArrowUp'] || keys['w'] || keys['KeyW']) player.dy = -currentSpeed;
  if (keys['ArrowDown'] || keys['s'] || keys['KeyS']) player.dy = currentSpeed;
  if (keys['ArrowLeft'] || keys['a'] || keys['KeyA']) player.dx = -currentSpeed;
  if (keys['ArrowRight'] || keys['d'] || keys['KeyD']) player.dx = currentSpeed;

  if (player.dx !== 0 || player.dy !== 0) {
    player.lastVx = player.dx !== 0 ? Math.sign(player.dx) : 0;
    player.lastVy = player.dy !== 0 ? Math.sign(player.dy) : 0;
  }

  movePlayerWithCollisions();
  if (player.dashCooldown > 0) player.dashCooldown--;
  treasure.pulse += 0.08;

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

  let distTreasure = Math.hypot(player.x - treasure.x, player.y - treasure.y);
  if (distTreasure < player.size / 2 + treasure.size / 2) {
    playSound('treasure');
    createSparkles(treasure.x, treasure.y, "#ffcc00", 30);
    score += 500;
    triggerLevelComplete();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  if (screenShake > 0) {
    let shakeX = (Math.random() - 0.5) * screenShake;
    let shakeY = (Math.random() - 0.5) * screenShake;
    ctx.translate(shakeX, shakeY);
  }

  // Dessin du Trésor
  ctx.fillStyle = "#ffcc00";
  ctx.beginPath();
  ctx.arc(treasure.x, treasure.y, treasure.size / 2 + Math.sin(treasure.pulse) * 2, 0, Math.PI * 2);
  ctx.fill();

  // Dessin des Ennemis
  enemies.forEach(en => {
    ctx.fillStyle = "#ff007f";
    ctx.fillRect(en.x - en.size/2, en.y - en.size/2, en.size, en.size);
  });

  // Dessin du Joueur
  ctx.fillStyle = player.isDashing ? "#ff007f" : "#00f3ff";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Démarrage
loadLevel(0);
gameLoop();