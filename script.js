/* ==========================================================================
   1. COLOR PALETTES (6 Vibrant Primary Studio Tones per Palette)
   ========================================================================== */
const PALETTES = {
  cyber: [
    { name: "Solar Gold", hex: "#FFBE0B", num: 1 },
    { name: "Blaze Coral", hex: "#FB5607", num: 2 },
    { name: "Neon Magenta", hex: "#FF006E", num: 3 },
    { name: "Electric Violet", hex: "#8338EC", num: 4 },
    { name: "Cyber Blue", hex: "#3A86FF", num: 5 },
    { name: "Laser Mint", hex: "#00F5D4", num: 6 }
  ],
  pastel: [
    { name: "Morning Sun", hex: "#FEE140", num: 1 },
    { name: "Peach Glow", hex: "#FA709A", num: 2 },
    { name: "Soft Blossom", hex: "#FF99AC", num: 3 },
    { name: "Lilac Cloud", hex: "#A18CD1", num: 4 },
    { name: "Sky Mist", hex: "#48CAE4", num: 5 },
    { name: "Pistachio", hex: "#95D5B2", num: 6 }
  ],
  oasis: [
    { name: "Lemon Glow", hex: "#F0F3BD", num: 1 },
    { name: "Seafoam", hex: "#02C39A", num: 2 },
    { name: "Amazon Teal", hex: "#00A896", num: 3 },
    { name: "Cerulean", hex: "#028090", num: 4 },
    { name: "Abyss Deep", hex: "#05668D", num: 5 },
    { name: "Emerald Glade", hex: "#52B788", num: 6 }
  ],
  pop: [
    { name: "Sunray", hex: "#FFD166", num: 1 },
    { name: "Vivid Papaya", hex: "#EF476F", num: 2 },
    { name: "Ultra Crimson", hex: "#D90429", num: 3 },
    { name: "Midnight Navy", hex: "#118AB2", num: 4 },
    { name: "Tropical Cyan", hex: "#06D6A0", num: 5 },
    { name: "Royal Indigo", hex: "#7209B7", num: 6 }
  ]
};

/* ==========================================================================
   2. WEB AUDIO SYNTHESIZER (Native Zero-Dependency FX)
   ========================================================================== */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPick(num = 1) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const baseFreqs = [330, 392, 440, 523, 587, 659];
    const freq = baseFreqs[num - 1] || 440;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  playFill(num = 1) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const baseFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const freq = baseFreqs[num - 1] || 320;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 1.2, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + 0.22);

    sub.type = 'sine';
    sub.frequency.setValueAtTime(freq * 0.5, now);
    sub.frequency.exponentialRampToValueAtTime(90, now + 0.22);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    sub.start(now);
    osc.stop(now + 0.26);
    sub.stop(now + 0.26);
  }

  playGroupComplete() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const freqs = [523.25, 659.25, 783.99]; // C - E - G
    freqs.forEach((f, i) => {
      const now = this.ctx.currentTime + (i * 0.08);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    });
  }

  playVictory() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + (idx * 0.1);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    });
  }
}

const sound = new SoundEngine();

/* ==========================================================================
   3. PARTICLE & CONFETTI ENGINE
   ========================================================================== */
class ParticleFX {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  splash(x, y, color) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.5);
      const speed = 2.5 + Math.random() * 4.5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3.5 + Math.random() * 4,
        alpha: 1,
        decay: 0.025 + Math.random() * 0.02,
        color
      });
    }
  }

  confetti() {
    const colors = ['#FFBE0B', '#FB5607', '#FF006E', '#8338EC', '#3A86FF', '#00F5D4'];
    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: window.innerWidth * 0.5 + (Math.random() * 240 - 120),
        y: window.innerHeight * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: - (Math.random() * 11 + 6),
        gravity: 0.35,
        radius: 4 + Math.random() * 5,
        alpha: 1,
        decay: 0.012,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.gravity) p.vy += p.gravity;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(this.animate);
  }
}

const fx = new ParticleFX(document.getElementById('fxCanvas'));

/* ==========================================================================
   4. APP STATE
   ========================================================================== */
const state = {
  activeColor: null,
  activeNumber: null,
  continuousMode: false,
  eyedropperMode: false,
  showNumbers: true,
  currentArtboard: 'galaxy',
  currentTheme: 'cyber',
  mode: 'pbn', // 'pbn' (paint by numbers) | 'free'
  historyStack: [],
  redoStack: []
};

/* DOM Selectors */
const canvasLayout = document.getElementById('canvasLayout');
const fluidCursor = document.getElementById('fluidCursor');
const swatchesStrip = document.getElementById('swatchesStrip');
const themeSelect = document.getElementById('themeSelect');
const customColorPicker = document.getElementById('customColorPicker');
const eyedropperBtn = document.getElementById('eyedropperBtn');
const continuousBtn = document.getElementById('continuousBtn');
const toggleNumbersBtn = document.getElementById('toggleNumbersBtn');
const statusText = document.getElementById('statusText');
const statusDot = document.getElementById('statusDot');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const clearBtn = document.getElementById('clearBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const exportBtn = document.getElementById('exportBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeHelpBtn = document.getElementById('closeHelpBtn');
const modePbnBtn = document.getElementById('modePbnBtn');
const modeFreeBtn = document.getElementById('modeFreeBtn');
const pbnBanner = document.getElementById('pbnBanner');
const pbnInstruction = document.getElementById('pbnInstruction');
const pbnProgress = document.getElementById('pbnProgress');
const resetPbnBtn = document.getElementById('resetPbnBtn');
const celebrationToast = document.getElementById('celebrationToast');

/* ==========================================================================
   5. DYNAMIC THEMED ARTBOARDS (Multi-Sized 3D Shapes & Geometries)
   ========================================================================== */
const ARTBOARDS = {
  // ARTBOARD 1: Cosmic Galaxy (Sun 128px, Saturn 96px with ring, Jupiter, Earth, Mars, Moons, Stars)
  galaxy: {
    title: "Cosmic Galaxy",
    render: (container) => {
      container.className = 'canvas-layout artboard-galaxy';
      container.innerHTML = `
        <!-- Giant Sun (Node 0, Size: Huge, Number: 1) -->
        <div class="art-node node-huge" id="node-0" data-num="1" style="position: absolute; left: 8%; top: 32%;">
          <span class="node-number">1</span>
        </div>

        <!-- Mercury (Node 1, Size: Mini, Number: 6) -->
        <div class="art-node node-mini" id="node-1" data-num="6" style="position: absolute; left: 28%; top: 46%;">
          <span class="node-number">6</span>
        </div>

        <!-- Mars (Node 2, Size: Small, Number: 5) -->
        <div class="art-node node-small" id="node-2" data-num="5" style="position: absolute; left: 34%; top: 22%;">
          <span class="node-number">5</span>
        </div>

        <!-- Earth (Node 3, Size: Medium, Number: 4) -->
        <div class="art-node node-medium" id="node-3" data-num="4" style="position: absolute; left: 42%; top: 52%;">
          <span class="node-number">4</span>
        </div>

        <!-- Moon (Node 4, Size: Mini, Number: 4) -->
        <div class="art-node node-mini" id="node-4" data-num="4" style="position: absolute; left: 49%; top: 40%;">
          <span class="node-number">4</span>
        </div>

        <!-- Jupiter (Node 5, Size: Large, Number: 3) -->
        <div class="art-node node-large" id="node-5" data-num="3" style="position: absolute; left: 56%; top: 16%;">
          <span class="node-number">3</span>
        </div>

        <!-- Saturn with Orbit Rings (Node 6, Size: Large, Number: 2) -->
        <div class="planet-ring-wrapper" style="position: absolute; left: 72%; top: 38%;">
          <div class="art-node node-large" id="node-6" data-num="2">
            <span class="node-number">2</span>
          </div>
          <div class="planet-ring"></div>
        </div>

        <!-- Titan Moon (Node 7, Size: Mini, Number: 2) -->
        <div class="art-node node-mini" id="node-7" data-num="2" style="position: absolute; left: 88%; top: 26%;">
          <span class="node-number">2</span>
        </div>

        <!-- Distant Comet / Star 1 (Node 8, Size: Small, Number: 6) -->
        <div class="art-node node-small" id="node-8" data-num="6" style="position: absolute; left: 24%; top: 72%;">
          <span class="node-number">6</span>
        </div>

        <!-- Distant Star 2 (Node 9, Size: Mini, Number: 1) -->
        <div class="art-node node-mini" id="node-9" data-num="1" style="position: absolute; left: 68%; top: 76%;">
          <span class="node-number">1</span>
        </div>
      `;
    }
  },

  // ARTBOARD 2: Crystal Geode (Faceted Gem shapes of varied scales)
  geode: {
    title: "Crystal Geode",
    render: (container) => {
      container.className = 'canvas-layout artboard-geode';
      container.innerHTML = `
        <!-- Heart Diamond (Node 0, Huge, Number 1) -->
        <div class="art-node node-huge shape-gem" id="node-0" data-num="1" style="position: absolute; left: 40%; top: 32%; z-index: 5;">
          <span class="node-number">1</span>
        </div>

        <!-- Top Emerald Shard (Node 1, Large, Number 2) -->
        <div class="art-node node-large shape-gem" id="node-1" data-num="2" style="position: absolute; left: 39%; top: 6%;">
          <span class="node-number">2</span>
        </div>

        <!-- Bottom Amethyst (Node 2, Large, Number 3) -->
        <div class="art-node node-large shape-gem" id="node-2" data-num="3" style="position: absolute; left: 41%; top: 62%;">
          <span class="node-number">3</span>
        </div>

        <!-- Left Ruby Shard (Node 3, Medium, Number 4) -->
        <div class="art-node node-medium shape-gem" id="node-3" data-num="4" style="position: absolute; left: 20%; top: 26%;">
          <span class="node-number">4</span>
        </div>

        <!-- Right Sapphire Shard (Node 4, Medium, Number 5) -->
        <div class="art-node node-medium shape-gem" id="node-4" data-num="5" style="position: absolute; left: 66%; top: 28%;">
          <span class="node-number">5</span>
        </div>

        <!-- Bottom-Left Citrine (Node 5, Small, Number 4) -->
        <div class="art-node node-small shape-gem" id="node-5" data-num="4" style="position: absolute; left: 24%; top: 54%;">
          <span class="node-number">4</span>
        </div>

        <!-- Bottom-Right Aquamarine (Node 6, Small, Number 5) -->
        <div class="art-node node-small shape-gem" id="node-6" data-num="5" style="position: absolute; left: 63%; top: 56%;">
          <span class="node-number">5</span>
        </div>

        <!-- Sparkling Micro Crystals (Nodes 7-9, Mini, Number 6) -->
        <div class="art-node node-mini" id="node-7" data-num="6" style="position: absolute; left: 14%; top: 44%;">
          <span class="node-number">6</span>
        </div>
        <div class="art-node node-mini" id="node-8" data-num="6" style="position: absolute; left: 78%; top: 46%;">
          <span class="node-number">6</span>
        </div>
        <div class="art-node node-mini" id="node-9" data-num="2" style="position: absolute; left: 56%; top: 12%;">
          <span class="node-number">2</span>
        </div>
      `;
    }
  },

  // ARTBOARD 3: Lotus Bloom (Center blossom with teardrop petal shapes)
  bloom: {
    title: "Lotus Bloom",
    render: (container) => {
      container.className = 'canvas-layout artboard-bloom';
      container.innerHTML = `
        <!-- Lotus Center Core (Node 0, Huge, Number 1) -->
        <div class="art-node node-huge" id="node-0" data-num="1" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 6;">
          <span class="node-number">1</span>
        </div>

        <!-- Inner Petal Ring (Nodes 1-4, Large Petal shapes, Numbers 2 & 3) -->
        <div class="art-node node-large shape-petal" id="node-1" data-num="2" style="position: absolute; left: 50%; top: 18%; transform: translate(-50%, -50%) rotate(0deg); z-index: 4;">
          <span class="node-number">2</span>
        </div>
        <div class="art-node node-large shape-petal" id="node-2" data-num="2" style="position: absolute; left: 50%; top: 82%; transform: translate(-50%, -50%) rotate(180deg); z-index: 4;">
          <span class="node-number">2</span>
        </div>
        <div class="art-node node-large shape-petal" id="node-3" data-num="3" style="position: absolute; left: 18%; top: 50%; transform: translate(-50%, -50%) rotate(-90deg); z-index: 4;">
          <span class="node-number">3</span>
        </div>
        <div class="art-node node-large shape-petal" id="node-4" data-num="3" style="position: absolute; left: 82%; top: 50%; transform: translate(-50%, -50%) rotate(90deg); z-index: 4;">
          <span class="node-number">3</span>
        </div>

        <!-- Diagonal Outer Petals (Nodes 5-8, Medium, Numbers 4 & 5) -->
        <div class="art-node node-medium shape-petal" id="node-5" data-num="4" style="position: absolute; left: 26%; top: 26%; transform: translate(-50%, -50%) rotate(-45deg); z-index: 3;">
          <span class="node-number">4</span>
        </div>
        <div class="art-node node-medium shape-petal" id="node-6" data-num="4" style="position: absolute; left: 74%; top: 26%; transform: translate(-50%, -50%) rotate(45deg); z-index: 3;">
          <span class="node-number">4</span>
        </div>
        <div class="art-node node-medium shape-petal" id="node-7" data-num="5" style="position: absolute; left: 26%; top: 74%; transform: translate(-50%, -50%) rotate(-135deg); z-index: 3;">
          <span class="node-number">5</span>
        </div>
        <div class="art-node node-medium shape-petal" id="node-8" data-num="5" style="position: absolute; left: 74%; top: 74%; transform: translate(-50%, -50%) rotate(135deg); z-index: 3;">
          <span class="node-number">5</span>
        </div>

        <!-- Floating Dew Drops (Nodes 9-10, Mini, Number 6) -->
        <div class="art-node node-mini" id="node-9" data-num="6" style="position: absolute; left: 10%; top: 12%;">
          <span class="node-number">6</span>
        </div>
        <div class="art-node node-mini" id="node-10" data-num="6" style="position: absolute; left: 90%; top: 88%;">
          <span class="node-number">6</span>
        </div>
      `;
    }
  }
};

function updateResponsiveScale() {
  if (!canvasLayout) return;
  const artboardKey = state.currentArtboard;
  let baseWidth = 820;
  let baseHeight = 440;

  if (artboardKey === 'geode') {
    baseWidth = 650;
    baseHeight = 420;
  } else if (artboardKey === 'bloom') {
    baseWidth = 580;
    baseHeight = 420;
  }

  const screenW = window.innerWidth;
  const padding = screenW <= 480 ? 16 : 32;
  const availableWidth = Math.min(screenW - padding, 960);

  const scale = Math.min(1, Math.max(0.35, availableWidth / baseWidth));
  canvasLayout.style.setProperty('--stage-scale', scale.toFixed(3));
  canvasLayout.style.height = (baseHeight * scale) + 'px';
}

function loadArtboard(artboardKey) {
  state.currentArtboard = artboardKey;
  state.historyStack = [];
  state.redoStack = [];
  updateUndoRedoUI();

  ARTBOARDS[artboardKey].render(canvasLayout);
  
  if (state.mode === 'free' || !state.showNumbers) {
    canvasLayout.classList.add('hide-numbers');
  } else {
    canvasLayout.classList.remove('hide-numbers');
  }

  attachNodeEvents();
  updateResponsiveScale();

  if (state.mode === 'pbn') {
    refreshSwatchesCompletion();
    updatePbnProgress();
    if (state.activeNumber) {
      highlightMatchingNodes(state.activeNumber, state.activeColor);
    }
  }
}

/* ==========================================================================
   6. SWATCHES & NUMBER-LINKED SELECTION
   ========================================================================== */
function renderSwatches(themeKey) {
  state.currentTheme = themeKey;
  const palette = PALETTES[themeKey] || PALETTES.cyber;
  swatchesStrip.innerHTML = '';

  palette.forEach((item) => {
    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = item.hex;
    swatch.style.setProperty('--swatch-color', item.hex);
    swatch.title = `#${item.num} ${item.name} (${item.hex})`;
    swatch.dataset.num = item.num;
    swatch.dataset.color = item.hex;

    const keyBadge = document.createElement('span');
    keyBadge.className = 'swatch-key';
    keyBadge.textContent = item.num;
    swatch.appendChild(keyBadge);

    swatch.addEventListener('click', () => {
      selectNumberedColor(item.num, item.hex, swatch);
    });

    swatchesStrip.appendChild(swatch);
  });

  refreshSwatchesCompletion();
}

function selectNumberedColor(num, hex, swatchEl = null) {
  state.activeColor = hex;
  state.activeNumber = (state.mode === 'pbn') ? num : null;
  state.eyedropperMode = false;
  eyedropperBtn.classList.remove('active');
  document.body.classList.remove('eyedropper-active');

  // Highlight active swatch
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
  if (swatchEl) {
    swatchEl.classList.add('selected');
  } else {
    const match = Array.from(document.querySelectorAll('.swatch')).find(s => parseInt(s.dataset.num) === num);
    if (match) match.classList.add('selected');
  }

  // Update Custom Droplet Cursor (Desktop only; touch devices use standard touch feedback)
  fluidCursor.style.backgroundColor = hex;
  fluidCursor.style.setProperty('--cursor-glow', hex);
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (!isTouch) {
    fluidCursor.style.display = 'block';
    document.body.style.cursor = 'none';
  }

  statusDot.style.backgroundColor = hex;

  if (state.mode === 'pbn') {
    // Highlight matching nodes with glowing pulse beacon
    highlightMatchingNodes(num, hex);
    statusText.textContent = `Color #${num} active • Click the glowing pulsing #${num} shapes!`;
    pbnInstruction.innerHTML = `Color <strong>#${num}</strong> selected. Click matching <strong>#${num}</strong> shapes!`;
  } else {
    clearNodeHighlights();
    statusText.textContent = `Color selected: ${hex.toUpperCase()} • Click any shape to fill`;
  }

  sound.playPick(num);
}

function selectCustomColor(hex) {
  state.activeColor = hex;
  state.activeNumber = null;
  state.eyedropperMode = false;
  eyedropperBtn.classList.remove('active');
  document.body.classList.remove('eyedropper-active');

  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
  clearNodeHighlights();

  fluidCursor.style.backgroundColor = hex;
  fluidCursor.style.setProperty('--cursor-glow', hex);
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (!isTouch) {
    fluidCursor.style.display = 'block';
    document.body.style.cursor = 'none';
  }

  statusDot.style.backgroundColor = hex;
  statusText.textContent = `Custom color ${hex.toUpperCase()} • Click any shape to fill`;
  sound.playPick(4);
}

function deselectColor() {
  state.activeColor = null;
  state.activeNumber = null;
  fluidCursor.style.display = 'none';
  document.body.style.cursor = 'default';
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
  clearNodeHighlights();
  statusDot.style.backgroundColor = '#94a3b8';
  statusText.textContent = 'Select a numbered color (1–6) or click any shape';
  if (state.mode === 'pbn') {
    pbnInstruction.innerHTML = 'Pick a numbered color below (<strong>1–6</strong>), then click the pulsing matching shapes!';
  }
}

function highlightMatchingNodes(targetNum, hexColor) {
  clearNodeHighlights();
  if (state.mode !== 'pbn' || !targetNum) return;

  const nodes = document.querySelectorAll('.art-node');
  nodes.forEach(node => {
    const nodeNum = parseInt(node.dataset.num);
    // If matching number and not yet properly completed
    if (nodeNum === targetNum && !node.classList.contains('matched')) {
      node.classList.add('node-hint-pulse');
      node.style.setProperty('--pulse-color', hexColor);
    }
  });
}

function clearNodeHighlights() {
  document.querySelectorAll('.art-node').forEach(node => {
    node.classList.remove('node-hint-pulse');
  });
}

/* ==========================================================================
   7. MOUSE & CURSOR TRACKING
   ========================================================================== */
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  fluidCursor.style.left = mouseX + 'px';
  fluidCursor.style.top = mouseY + 'px';

  document.body.style.setProperty('--mouse-x', `${(mouseX / window.innerWidth) * 100}%`);
  document.body.style.setProperty('--mouse-y', `${(mouseY / window.innerHeight) * 100}%`);
});

// Restore normal pointer on header, dock, and modal
const uiChrome = 'header, .dock-container, .modal-overlay, #pbnBanner, .template-bar';
document.querySelectorAll(uiChrome).forEach(elem => {
  elem.addEventListener('mouseenter', () => {
    if (state.activeColor) {
      fluidCursor.style.opacity = '0.35';
      document.body.style.cursor = 'default';
    }
  });
  elem.addEventListener('mouseleave', () => {
    if (state.activeColor) {
      fluidCursor.style.opacity = '1';
      document.body.style.cursor = 'none';
    }
  });
});

/* ==========================================================================
   8. NODE FILL & PAINT-BY-NUMBERS EVALUATION
   ========================================================================== */
function attachNodeEvents() {
  const nodes = document.querySelectorAll('.art-node');
  nodes.forEach((node) => {
    node.addEventListener('click', (e) => {
      handleNodeClick(node, e);
    });

    node.addEventListener('mouseenter', () => {
      if (state.activeColor) {
        node.style.setProperty('--hover-glow', state.activeColor);
      }
    });
  });
}

function handleNodeClick(node, e) {
  // Eyedropper mode
  if (state.eyedropperMode) {
    const bg = window.getComputedStyle(node).backgroundColor;
    const hex = rgbToHex(bg);
    const nodeNum = parseInt(node.dataset.num);
    selectNumberedColor(nodeNum, hex);
    return;
  }

  if (!state.activeColor) {
    if (state.mode === 'pbn') {
      // If user clicked a node in PBN mode, pick its matching color for them!
      const nodeNum = parseInt(node.dataset.num);
      const palette = PALETTES[state.currentTheme];
      const match = palette.find(p => p.num === nodeNum);
      if (match) {
        selectNumberedColor(match.num, match.hex);
      }
    } else {
      statusText.textContent = 'Please choose a color from the palette to paint!';
      sound.playPick(3);
    }
    return;
  }

  const prevColor = node.style.backgroundColor || 'rgb(255, 255, 255)';
  const prevFilled = node.classList.contains('filled');
  const prevMatched = node.classList.contains('matched');
  const newColor = state.activeColor;
  const nodeNum = parseInt(node.dataset.num);
  const isMatch = (state.activeNumber === nodeNum);

  // Push to Undo history
  pushHistory({
    nodeId: node.id,
    fromColor: prevColor,
    toColor: newColor,
    fromFilled: prevFilled,
    toFilled: true,
    fromMatched: prevMatched,
    toMatched: isMatch
  });

  // Apply visual styling
  node.style.backgroundColor = newColor;
  node.classList.add('filled');

  if (state.mode === 'pbn') {
    if (isMatch) {
      node.classList.add('matched');
      node.classList.remove('node-hint-pulse');
    }
  } else {
    node.classList.remove('matched', 'node-hint-pulse');
  }

  // Ripple effect inside node
  const rect = node.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple-wave';
  ripple.style.width = rect.width + 'px';
  ripple.style.height = rect.height + 'px';
  node.appendChild(ripple);
  setTimeout(() => ripple.remove(), 550);

  // Particle splash burst
  const splashX = rect.left + rect.width / 2;
  const splashY = rect.top + rect.height / 2;
  fx.splash(splashX, splashY, newColor);

  // Sound effect
  sound.playFill(nodeNum);

  // Check group & total completion in Paint-by-Numbers mode
  if (state.mode === 'pbn') {
    checkGroupCompletion(nodeNum);
    updatePbnProgress();
  }

  // If not continuous mode, return cursor to default
  if (!state.continuousMode) {
    deselectColor();
  }
}

function checkGroupCompletion(num) {
  const nodesOfNum = Array.from(document.querySelectorAll(`.art-node[data-num="${num}"]`));
  const allMatched = nodesOfNum.every(n => n.classList.contains('matched'));

  const swatch = document.querySelector(`.swatch[data-num="${num}"]`);
  if (allMatched && nodesOfNum.length > 0) {
    if (swatch && !swatch.classList.contains('completed')) {
      swatch.classList.add('completed');
      sound.playGroupComplete();
      showCelebrationToast(`Group #${num} Complete! ⭐`);
    }
  } else if (swatch) {
    swatch.classList.remove('completed');
  }
}

function updatePbnProgress() {
  const allNodes = document.querySelectorAll('.art-node');
  const matchedNodes = document.querySelectorAll('.art-node.matched');

  pbnProgress.textContent = `${matchedNodes.length} / ${allNodes.length}`;

  if (matchedNodes.length === allNodes.length && allNodes.length > 0) {
    sound.playVictory();
    fx.confetti();
    showCelebrationToast(`🎉 ${ARTBOARDS[state.currentArtboard].title} Masterpiece Complete!`);
  }
}

function refreshSwatchesCompletion() {
  for (let i = 1; i <= 6; i++) {
    checkGroupCompletion(i);
  }
}

function rgbToHex(rgb) {
  if (!rgb || rgb === 'transparent') return '#ffffff';
  const parts = rgb.match(/\d+/g);
  if (!parts || parts.length < 3) return '#ffffff';
  return '#' + ((1 << 24) + (parseInt(parts[0]) << 16) + (parseInt(parts[1]) << 8) + parseInt(parts[2])).toString(16).slice(1);
}

function showCelebrationToast(msg) {
  celebrationToast.textContent = msg;
  celebrationToast.classList.add('show');
  setTimeout(() => celebrationToast.classList.remove('show'), 3800);
}

/* ==========================================================================
   9. UNDO / REDO SYSTEM
   ========================================================================== */
function pushHistory(action) {
  state.historyStack.push(action);
  state.redoStack = [];
  updateUndoRedoUI();
}

function undo() {
  if (state.historyStack.length === 0) return;
  const action = state.historyStack.pop();
  state.redoStack.push(action);

  const node = document.getElementById(action.nodeId);
  if (node) {
    node.style.backgroundColor = action.fromColor;
    if (action.fromFilled) node.classList.add('filled'); else node.classList.remove('filled');
    if (action.fromMatched) node.classList.add('matched'); else node.classList.remove('matched');
    sound.playPick(2);
  }

  updateUndoRedoUI();
  refreshSwatchesCompletion();
  updatePbnProgress();
}

function redo() {
  if (state.redoStack.length === 0) return;
  const action = state.redoStack.pop();
  state.historyStack.push(action);

  const node = document.getElementById(action.nodeId);
  if (node) {
    node.style.backgroundColor = action.toColor;
    if (action.toFilled) node.classList.add('filled'); else node.classList.remove('filled');
    if (action.toMatched) node.classList.add('matched'); else node.classList.remove('matched');
    sound.playFill(3);
  }

  updateUndoRedoUI();
  refreshSwatchesCompletion();
  updatePbnProgress();
}

function updateUndoRedoUI() {
  undoBtn.disabled = state.historyStack.length === 0;
  redoBtn.disabled = state.redoStack.length === 0;
}

/* ==========================================================================
   10. EXPORT HIGH-RES ARTWORK AS PNG
   ========================================================================== */
function exportArtwork() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1200;
  canvas.height = 900;

  // Background gradient
  const bgGrad = ctx.createRadialGradient(600, 450, 80, 600, 450, 750);
  bgGrad.addColorStop(0, '#151b28');
  bgGrad.addColorStop(1, '#090c12');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title & attribution
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px Outfit, sans-serif';
  ctx.fillText(`ChromaDrop: ${ARTBOARDS[state.currentArtboard].title}`, 60, 80);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 18px Outfit, sans-serif';
  ctx.fillText('Digital Artboard & Color Lab • Created with ChromaDrop Studio', 60, 115);

  // Render nodes mapped to canvas coordinates
  const stageRect = canvasLayout.getBoundingClientRect();
  const nodes = document.querySelectorAll('.art-node');

  nodes.forEach(node => {
    const nodeRect = node.getBoundingClientRect();
    const relX = (nodeRect.left + nodeRect.width / 2 - stageRect.left) / stageRect.width;
    const relY = (nodeRect.top + nodeRect.height / 2 - stageRect.top) / stageRect.height;

    const targetX = 140 + relX * 920;
    const targetY = 180 + relY * 620;
    const radius = (nodeRect.width / 2) * 1.35;
    const color = node.style.backgroundColor || '#ffffff';

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;

    ctx.beginPath();
    ctx.arc(targetX, targetY, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Specular glass highlight ring
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.stroke();

    ctx.restore();
  });

  const link = document.createElement('a');
  link.download = `chromadrop-${state.currentArtboard}-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  sound.playPick(5);
}

/* ==========================================================================
   11. CONTROLS, SHORTCUTS & EVENT LISTENERS
   ========================================================================== */
function setMode(newMode) {
  state.mode = newMode;
  deselectColor(); // Deselect any active color so nothing from previous mode lingers!
  clearNodeHighlights();

  if (newMode === 'free') {
    document.body.classList.add('mode-free');
    document.body.classList.remove('mode-pbn');
    modeFreeBtn.classList.add('active');
    modePbnBtn.classList.remove('active');
    pbnBanner.classList.remove('active');

    // Automatically hide numbers on canvas in Free Studio
    canvasLayout.classList.add('hide-numbers');
    statusText.textContent = 'Free Studio active • Pick any color or use custom picker to paint freely!';
  } else {
    document.body.classList.remove('mode-free');
    document.body.classList.add('mode-pbn');
    modePbnBtn.classList.add('active');
    modeFreeBtn.classList.remove('active');
    pbnBanner.classList.add('active');

    // Restore numbers in Paint-by-Numbers according to state.showNumbers
    if (state.showNumbers) {
      canvasLayout.classList.remove('hide-numbers');
    } else {
      canvasLayout.classList.add('hide-numbers');
    }

    refreshSwatchesCompletion();
    updatePbnProgress();
    statusText.textContent = 'Select a numbered color (1–6) or click any shape';
    pbnInstruction.innerHTML = 'Pick a numbered color below (<strong>1–6</strong>), then click the pulsing matching shapes!';
  }
}

// Mode Buttons
modePbnBtn.addEventListener('click', () => setMode('pbn'));
modeFreeBtn.addEventListener('click', () => setMode('free'));

// Toggle Numbers Button (Eye icon)
toggleNumbersBtn.addEventListener('click', () => {
  state.showNumbers = !state.showNumbers;
  toggleNumbersBtn.classList.toggle('active', state.showNumbers);
  canvasLayout.classList.toggle('hide-numbers', !state.showNumbers);
  statusText.textContent = state.showNumbers ? 'Numbers visible' : 'Numbers hidden for clean view';
});

// Restart / Reset Artboard
resetPbnBtn.addEventListener('click', () => {
  clearBtn.click();
});

// Artboard Template Selector
document.querySelectorAll('.template-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.template-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    loadArtboard(chip.dataset.artboard);
    sound.playPick(3);
  });
});

// Palette Dropdown
themeSelect.addEventListener('change', (e) => {
  renderSwatches(e.target.value);
  sound.playPick(2);
});

// Custom Color Picker
customColorPicker.addEventListener('input', (e) => {
  selectCustomColor(e.target.value);
});

// Eyedropper Tool
eyedropperBtn.addEventListener('click', () => {
  state.eyedropperMode = !state.eyedropperMode;
  eyedropperBtn.classList.toggle('active', state.eyedropperMode);
  document.body.classList.toggle('eyedropper-active', state.eyedropperMode);
  statusText.textContent = state.eyedropperMode ? 'Eyedropper: Click any shape to sample its color' : 'Eyedropper off';
  if (state.eyedropperMode) sound.playPick(5);
});

// Continuous Paint Mode Toggle
continuousBtn.addEventListener('click', () => {
  state.continuousMode = !state.continuousMode;
  continuousBtn.classList.toggle('active', state.continuousMode);
  statusText.textContent = state.continuousMode ? 'Continuous Mode ON (Hold active color)' : 'Continuous Mode OFF';
  sound.playPick(state.continuousMode ? 6 : 2);
});

// Undo / Redo
undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);

// Clear Canvas
clearBtn.addEventListener('click', () => {
  document.querySelectorAll('.art-node').forEach(node => {
    node.style.backgroundColor = '#ffffff';
    node.classList.remove('filled', 'matched');
  });
  state.historyStack = [];
  state.redoStack = [];
  updateUndoRedoUI();
  refreshSwatchesCompletion();
  updatePbnProgress();
  sound.playFill(1);
});

// Randomize Canvas
shuffleBtn.addEventListener('click', () => {
  const palette = PALETTES[state.currentTheme];
  document.querySelectorAll('.art-node').forEach(node => {
    const randomItem = palette[Math.floor(Math.random() * palette.length)];
    node.style.backgroundColor = randomItem.hex;
    node.classList.add('filled');
    if (parseInt(node.dataset.num) === randomItem.num) {
      node.classList.add('matched');
    } else {
      node.classList.remove('matched');
    }
  });
  refreshSwatchesCompletion();
  updatePbnProgress();
  sound.playFill(4);
});

// Export PNG
exportBtn.addEventListener('click', exportArtwork);

// Sound Mute Toggle
soundToggleBtn.addEventListener('click', () => {
  sound.enabled = !sound.enabled;
  soundToggleBtn.style.opacity = sound.enabled ? '1' : '0.45';
  soundToggleBtn.title = sound.enabled ? 'Audio FX Enabled' : 'Audio FX Muted';
  if (sound.enabled) sound.playPick(4);
});

// Help Modal
helpBtn.addEventListener('click', () => helpModal.classList.add('open'));
closeHelpBtn.addEventListener('click', () => helpModal.classList.remove('open'));
helpModal.addEventListener('click', (e) => {
  if (e.target === helpModal) helpModal.classList.remove('open');
});

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  // 1 to 6 keys: Palette swatches
  if (e.key >= '1' && e.key <= '6') {
    const idx = parseInt(e.key) - 1;
    const swatches = document.querySelectorAll('.swatch');
    if (swatches[idx]) swatches[idx].click();
  }
  // H key: Toggle numbers
  if (e.key === 'h' || e.key === 'H') {
    toggleNumbersBtn.click();
  }
  // Ctrl+Z: Undo
  if (e.ctrlKey && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
    e.preventDefault();
    undo();
  }
  // Ctrl+Y: Redo
  if (e.ctrlKey && (e.key === 'y' || e.key === 'Y') || (e.ctrlKey && e.shiftKey && (e.key === 'z' || e.key === 'Z'))) {
    e.preventDefault();
    redo();
  }
  // Escape: Deselect color / close modal
  if (e.key === 'Escape') {
    deselectColor();
    helpModal.classList.remove('open');
  }
  // Space: Toggle continuous mode
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    continuousBtn.click();
  }
  // C key: Clear
  if (e.key === 'c' || e.key === 'C') {
    if (!e.ctrlKey && !e.metaKey) clearBtn.click();
  }
  // R key: Randomize
  if (e.key === 'r' || e.key === 'R') {
    if (!e.ctrlKey && !e.metaKey) shuffleBtn.click();
  }
  // I key: Eyedropper
  if (e.key === 'i' || e.key === 'I') {
    eyedropperBtn.click();
  }
  // ? key: Help
  if (e.key === '?') {
    helpModal.classList.toggle('open');
  }
});

// Window Resize & Orientation Change Handling for Fluid Mobile Scaling
window.addEventListener('resize', () => {
  updateResponsiveScale();
});

window.addEventListener('orientationchange', () => {
  setTimeout(updateResponsiveScale, 150);
});

/* ==========================================================================
   12. BOOTSTRAP INITIALIZATION
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  renderSwatches('cyber');
  loadArtboard('galaxy');
  setMode('pbn');
  updateResponsiveScale();
});
