// -------------------------------- Terminal --------------------------------
console.clear();

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

const historyEl = document.querySelector('ul#terminal-history');
const terminalText = document.querySelector('#terminal-text');
const delay = 13
let currentText = "";

const katakana = 'ア$ァ$カ$サ$タ$ナ$ハ$マ$ヤ$ャ$ラ$ワ$ガ$ザ$ダ$バ$イ$ィ$キ$チ$ニ$ヒ$ミ$リ$ヰ$ギ$ヂ$ビ$ウ$ゥ$ク$ス$ヌ$フ$ム$ユ$ュ$ル$グ$ズ$プ$エ$ェ$ケ$セ$テ$ネ$ヘ$メ$レ$ヱ$ゲ$ゼ$デ$ペ$オ$ォ$コ$ト$ノ$ホ$モ$ヨ$ョ$ロ$ヲ$ゴ$ゾ$ド$ボ$ヴ$ン$';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';

const characters = `${latin}${nums}`;

const initialMsgs = [
  "Initializing hardware... [OK]",
  "Loading system files... [OK]",
  "Starting network services... [OK]",
  "Synchronizing system clock... [OK]",
  "Connecting to Solana's blockchain... [OK]",
  "Verifying digital signature... [OK]",
  "Mounting encrypted volumes... [OK]",
  "Checking system integrity... [OK]",
  "Launching security protocols... [OK]",
  "Establishing RPC connection... [OK]",
  "Scanning for active nodes... [OK]",
  "Initializing smart contract interface... [OK]",
  "Finalizing startup sequence... [OK]",
  "System ready...",
  "<b>Don't enter his last name.</b>"
];

init();

function init() {
  delayMsg('*** Welcome to the pumpOS ***', delay / 2);
  setTimeout(displayMsgs, delay);
}

function displayMsgs() {
  setTimeout(() => {
    for (let i = 0; i < initialMsgs.length; i++) {
      const randomInterval = Math.random() * 10 + (i === initialMsgs.length - 1 ? (delay * i) * 3 : delay * i);
      delayMsg(initialMsgs[i], i * randomInterval)
    }
  }, delay)
}

function delayMsg(msg, ms) {
  setTimeout(() => {
    historyEl.insertAdjacentHTML("beforeend", `<li>${msg}</li>`);
  }, ms)
}

function updateTerminalText() {
  terminalText.textContent = currentText;
}

function inputTerminalText() {
  if (currentText.toLowerCase() === "nakamoto") {
    nakamotoOut();
  } else {
    historyEl.insertAdjacentHTML("beforeend", `<li>${currentText}</li>`);
  }
}

function nakamotoOut() {
  document.querySelector('#caret').classList.remove('blinking');
  document.querySelectorAll('ul#terminal-history > li').forEach((li, i) => {
    const text = li.textContent;
    const textLength = text.length;
    setTimeout(() => {
      let iLetter = 0;
      const interval = setInterval(() => {
        const randomChar = Math.floor(Math.random() * characters.length);
        let characterSet = Math.random() < .8 ? characters : katakana;
        let newChar = Math.random() > .2 ? characterSet[randomChar] : ' ';
        newChar = Math.random() < .8 ? newChar : newChar + characterSet[Math.floor(Math.random() * characterSet.length)];
        let newStr = li.textContent.replace(text[iLetter], newChar);
        li.textContent = newStr;
        iLetter++
        if (iLetter >= text.length) {
          if (i === 0) {
            
            displayAlert();
          }
          clearInterval(interval);
        }
      }, 100);
    }, 100)
  })
}

function displayAlert() {
  document.querySelector('#alert').classList.remove('hidden');

}

window.addEventListener('keyup', e => {
  const key = e.key;
  if (key.toLowerCase() === "enter") {
    inputTerminalText();
    currentText.toLowerCase() === 'nakamoto' ? currentText : '';
  } else if (key.toLowerCase() === "backspace") {
    currentText = currentText.length ? currentText.slice(0, -1) : currentText;
  } else if (`${latin + " "}`.toLowerCase().includes(key.toLowerCase())) {
    if (currentText.toLowerCase() === "nakamoto") {
      return false;
    } else {
      currentText += key;
    }
  }
  updateTerminalText();
})

// -------------------------------- hologram ASCII --------------------------------

    const W = 48, H = 84;
    const SCALE = 1/1;
    const chars = ['█','▓','▒','░',' '];
    const depthBuf = new Float32Array(W * H);
    const buf = new Array(W * H).fill(' ');

    const out = document.getElementById('asciiDie');

    // Sommets d’un dodécaèdre
    const φ = (1 + Math.sqrt(5)) / 2;
    const verts = [
      [-1,-1,-1], [-1,-1,1], [-1,1,-1], [-1,1,1],
      [1,-1,-1],  [1,-1,1],  [1,1,-1],  [1,1,1],
      [0, -1/φ, -φ], [0, -1/φ, φ], [0, 1/φ, -φ], [0, 1/φ, φ],
      [-1/φ, -φ, 0], [-1/φ, φ, 0], [1/φ, -φ, 0], [1/φ, φ, 0],
      [-φ, 0, -1/φ], [φ, 0, -1/φ], [-φ, 0, 1/φ], [φ, 0, 1/φ]
    ];

    // Arêtes (30)
    const edges = [
      [0,8],[0,10],[0,16],[1,9],[1,11],[1,18],
      [2,10],[2,12],[2,17],[3,11],[3,13],[3,19],
      [4,12],[4,14],[4,17],[5,13],[5,15],[5,18],
      [6,14],[6,16],[6,19],[7,15],[7,17],[7,19],
      [8,14],[9,15],[10,12],[11,13],[16,18],[17,19]
      
    ];

    function clear() {
      for (let i = 0; i < W*H; i++) {
        depthBuf[i] = -Infinity;
        buf[i] = ' ';
      }
    }

    // Projection + rotation autour de Y (avec mise à l'échelle)
    function project([x, y, z], ay) {
      // Appliquer l'échelle
      x *= SCALE;
      y *= SCALE;
      z *= SCALE;

      const X =  x * Math.cos(ay) + z * Math.sin(ay);
      const Z = -x * Math.sin(ay) + z * Math.cos(ay);
      const K = 30, d = 3;
      const ooz = 1 / (Z + d);
      const xp = Math.floor(W/2  + K * ooz * X);
      const yp = Math.floor(H/2 -  K * ooz * y);
      return { x: xp, y: yp, ooz };
    }

    function line(x0, y0, x1, y1, depth) {
      let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
      let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
      let err = dx + dy;
      while (true) {
        const idx = x0 + y0 * W;
        if (idx >= 0 && idx < W*H && depth > depthBuf[idx]) {
          depthBuf[idx] = depth;
          const ci = Math.min(chars.length - 1, Math.floor(depth * chars.length));
          buf[idx] = chars[ci];
        }
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
      }
    }

    function draw(ay) {
      clear();
      for (const [i, j] of edges) {
        const p0 = project(verts[i], ay);
        const p1 = project(verts[j], ay);
        const depth = (p0.ooz + p1.ooz) / 2;
        line(p0.x, p0.y, p1.x, p1.y, depth);
      }
      let s = '';
      for (let y = 0; y < H; y++) {
        s += buf.slice(y*W, y*W + W).join('') + '\n';
      }
      out.textContent = s;
    }

    // Animation : rotation continue gauche-droite
    let ay = 0;
    function animate() {
      ay += 0.01; // vitesse constante
      draw(ay);
      requestAnimationFrame(animate);
    }
    animate();
    
// -------------------------------- horloge numerique --------------------------------
function updateDigitalClock() {
  const now   = new Date();
  let hrs     = String(now.getHours()).padStart(2, '0');
  let mins    = String(now.getMinutes()).padStart(2, '0');
  let secs    = String(now.getSeconds()).padStart(2, '0');

  document.getElementById('hours').textContent   = hrs;
  document.getElementById('minutes').textContent = mins;
  document.getElementById('seconds').textContent = secs;

  setTimeout(updateDigitalClock, 1000);
}

updateDigitalClock();

// -------------------------------- redTransition --------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const alertLink = document.getElementById('alert');
  if (!alertLink) return;

  alertLink.addEventListener('click', function(event) {
    event.preventDefault();                       // stoppe la navigation immédiate
    document.body.classList.add('red-theme');

    // redirection vers countdown.html avec un temps
    setTimeout(() => {
      window.location.href = alertLink.href;
    }, 3000);
  });
});


