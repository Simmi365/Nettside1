
// --- Konfigurasjon for europeisk roulette (0–36) ---
const sequence = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
  8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
  28, 12, 35, 3, 26
];

// Farger for europeisk hjul (0 grønn, rester rød/svart i mønster)
function numberColor(n) {
  if (n === 0) return "green";
  // Rød/svart mønster i europeisk sekvens
  const reds = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
  return reds.has(n) ? "red" : "black";
}

// --- Canvas setup ---
const canvas = document.getElementById("roulette");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
const cx = W / 2;
const cy = H / 2;
const outerR = Math.min(W, H) / 2 - 10;   // ytterkant
const innerR = outerR * 0.55;             // midtring
const textR  = outerR * 0.82;             // radius for nummertekst
const pocketCount = sequence.length;

// Ball:
let ballAngle = 0;
const ballR = innerR * 0.88;
const ballRadiusPx = 8;

// Spinn-tilstand
let spinning = false;
let startAngle = 0;      // basisrotasjon
let targetAngle = 0;     // endelig rotasjon
let startTime = 0;
let duration = 4500;     // ms
let resultIndex = 0;     // index i sequence som vinner

// Easing (easeOutCubic)
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Tegn hele hjulet
function drawWheel(rotation = 0) {
  ctx.clearRect(0, 0, W, H);

  const slice = (2 * Math.PI) / pocketCount;

  // Bakgrunn
  ctx.save();
  ctx.translate(cx, cy);

  // Felter
  for (let i = 0; i < pocketCount; i++) {
    const start = i * slice + rotation;
    const end = start + slice;
    const n = sequence[i];

    // Ytre sektor
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, outerR, start, end);
    ctx.arc(0, 0, innerR, end, start, true);
    ctx.closePath();

    ctx.fillStyle = numberColor(n);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#111";
    ctx.stroke();

    // Nummertekst
    ctx.save();
    const mid = start + slice / 2;
    ctx.rotate(mid);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = n === 0 ? "#001d06" : "#fff";
    ctx.font = "14px Arial";
    ctx.translate(textR, 0);
    // Legg til liten svart skygge for kontrast
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 2;
    ctx.fillText(String(n), 0, 0);
    ctx.restore();
  }

  // Midtring / hub
  ctx.beginPath();
  ctx.arc(0, 0, innerR * 0.82, 0, 2 * Math.PI);
  ctx.fillStyle = "#b88a4a"; // gullaktig
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, innerR * 0.45, 0, 2 * Math.PI);
  ctx.fillStyle = "#2b2b2b";
  ctx.fill();

  // Ball
  const ballX = Math.cos(ballAngle + rotation) * ballR;
  const ballY = Math.sin(ballAngle + rotation) * ballR;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadiusPx, 0, 2 * Math.PI);
  ctx.fillStyle = "#f9f9f9";
  ctx.fill();
  ctx.strokeStyle = "#bbb";
  ctx.stroke();

  ctx.restore();
}

// Finn vinnerfelt gitt rotasjon: vi definerer at "pilen" er på topp (vinkel = -PI/2)
function angleToIndex(rotation) {
  const slice = (2 * Math.PI) / pocketCount;
  const pointerAngle = -Math.PI / 2; // topp
  // Hjulet er rotert med 'rotation', så feltet på pointer er nærmest -rotation
  let a = (pointerAngle - rotation) % (2 * Math.PI);
  if (a < 0) a += 2 * Math.PI;
  const i = Math.floor(a / slice);
  return i % pocketCount;
}

// Start et spinn
function startSpin() {
  if (spinning) return;
  spinning = true;

  // Tilfeldig sluttposisjon + hele runder for god animasjon
  const fullTurns = 6 + Math.floor(Math.random() * 4); // 6–9 runder
  const slice = (2 * Math.PI) / pocketCount;
  resultIndex = Math.floor(Math.random() * pocketCount);
  const endRotation = resultIndex * slice; // slik at valgt index havner på pointer

  startAngle = startAngle % (2 * Math.PI);
  targetAngle = startAngle + fullTurns * 2 * Math.PI + endRotation;
  startTime = performance.now();

  document.getElementById("spinBtn").disabled = true;
  document.getElementById("status").textContent = "Spinner...";
  requestAnimationFrame(step);
}

function step(now) {
  const t = Math.min(1, (now - startTime) / duration);
  const eased = easeOutCubic(t);
  const current = startAngle + (targetAngle - startAngle) * eased;

  // Ballen kan ha litt motsatt bevegelse for realisme
  ballAngle += 0.20 * (1 - eased); // sakter av mot slutten

  drawWheel(current);

  if (t < 1) {
    requestAnimationFrame(step);
  } else {
    spinning = false;
    startAngle = current; // lås sluttilstand
    const i = angleToIndex(startAngle);
    const winningNumber = sequence[i];
    const color = numberColor(winningNumber);
    showResult(winningNumber, color);
    document.getElementById("spinBtn").disabled = false;
  }
}

// Resultat + gevinster
function showResult(n, color) {
  const bet = parseInt(document.getElementById("bet").value, 10);
  const betType = document.getElementById("betType").value;
  const betNumber = parseInt(document.getElementById("betNumber").value, 10);

  let msg = `Resultat: ${n} (${color}). `;

  if (betType === "red" && color === "red") {
    msg += `Du vant ${bet * 2} kr!`;
  } else if (betType === "black" && color === "black") {
    msg += `Du vant ${bet * 2} kr!`;
  } else if (betType === "number" && betNumber === n) {
    msg += `Jackpot! Du vant ${bet * 36} kr!`;
  } else {
    msg += `Du tapte.`;
  }

  document.getElementById("status").textContent = msg;
}

// Init
drawWheel(0);

// UI
document.getElementById("spinBtn").addEventListener("click", startSpin);
