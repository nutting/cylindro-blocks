import './style.css';
import * as THREE from 'three';

type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Offset = { x: number; y: number };
type PieceDef = { name: string; color: Cell; rotations: Offset[][] };
type Piece = { def: PieceDef; rotation: number; x: number; y: number };

const WIDTH = 20;
const HEIGHT = 14;
const DROP_INTERVAL = 650;
const SOFT_DROP_INTERVAL = 55;
const RADIUS = 4.2;
const CELL_W = (Math.PI * 2 * RADIUS) / WIDTH;
const CELL_H = 0.64;
const DEPTH = 0.38;

const COLORS = {
  0: '#000000',
  1: '#31c6ff',
  2: '#ffd84f',
  3: '#b06eff',
  4: '#65e77a',
  5: '#ff705a',
  6: '#ffab47',
  7: '#4f8dff',
};

const PIECES: PieceDef[] = [
  {
    name: 'I',
    color: 1,
    rotations: [
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
      [
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
    ],
  },
  {
    name: 'O',
    color: 2,
    rotations: [
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
    ],
  },
  {
    name: 'T',
    color: 3,
    rotations: [
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
      ],
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
      ],
    ],
  },
  {
    name: 'S',
    color: 4,
    rotations: [
      [
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ],
    ],
  },
  {
    name: 'Z',
    color: 5,
    rotations: [
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      [
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
    ],
  },
  {
    name: 'L',
    color: 6,
    rotations: [
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: -1 },
      ],
      [
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: -1, y: 1 },
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
    ],
  },
  {
    name: 'J',
    color: 7,
    rotations: [
      [
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: 0, y: -1 },
        { x: 1, y: 1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
      [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: -1 },
      ],
    ],
  },
];

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <div class="layout">
    <div class="panel hud">
      <h1>Cylindro Blocks</h1>
      <p class="subtitle">立体俄罗斯方块原型：方块沿圆柱表面下落，围满一圈就消掉。</p>
      <div class="stats">
        <div><span>得分</span><strong id="score">0</strong></div>
        <div><span>消圈</span><strong id="rings">0</strong></div>
        <div><span>速度</span><strong id="speed">1x</strong></div>
      </div>
      <div class="controls">
        <h2>操作</h2>
        <ul>
          <li>← / →：沿圆柱左右移动</li>
          <li>↑：旋转方块</li>
          <li>↓：加速下落</li>
          <li>空格：直接落到底</li>
          <li>A / D：旋转圆柱视角</li>
          <li>鼠标拖拽：旋转圆柱</li>
          <li>R：重新开始</li>
        </ul>
      </div>
      <p id="status" class="status">准备中…</p>
    </div>
    <div class="panel stage-wrap">
      <canvas id="stage"></canvas>
    </div>
  </div>
`;

const scoreEl = document.querySelector<HTMLElement>('#score')!;
const ringsEl = document.querySelector<HTMLElement>('#rings')!;
const speedEl = document.querySelector<HTMLElement>('#speed')!;
const statusEl = document.querySelector<HTMLElement>('#status')!;
const canvas = document.querySelector<HTMLCanvasElement>('#stage')!;

const board: Cell[][] = [];
let activePiece: Piece | null = null;
let score = 0;
let clearedRings = 0;
let dropAccumulator = 0;
let softDropping = false;
let cameraSpin = Math.PI / 2 + Math.PI / WIDTH;
let gameOver = false;
let isDragging = false;
let dragStartX = 0;
let dragStartSpin = 0;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#09111f');
scene.fog = new THREE.Fog('#09111f', 10, 24);

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(0, 2.2, 17);

const world = new THREE.Group();
scene.add(world);

const ambient = new THREE.AmbientLight('#cfd8ff', 1.25);
scene.add(ambient);

const key = new THREE.DirectionalLight('#ffffff', 1.8);
key.position.set(6, 12, 8);
scene.add(key);

const rim = new THREE.PointLight('#4fa3ff', 35, 30, 2);
rim.position.set(-6, 2, -8);
scene.add(rim);

const cylinderFrame = new THREE.Mesh(
  new THREE.CylinderGeometry(RADIUS - 0.12, RADIUS - 0.12, HEIGHT * CELL_H + 0.35, WIDTH, 1, true),
  new THREE.MeshStandardMaterial({
    color: '#122034',
    emissive: '#08111f',
    emissiveIntensity: 0.18,
    metalness: 0.22,
    roughness: 0.72,
    side: THREE.DoubleSide,
  }),
);
world.add(cylinderFrame);

const topRing = new THREE.Mesh(
  new THREE.TorusGeometry(RADIUS - 0.03, 0.05, 16, WIDTH),
  new THREE.MeshStandardMaterial({ color: '#2b4d7d', emissive: '#10223a' }),
);
topRing.position.y = topY(-1) + 0.18;
topRing.rotation.x = Math.PI / 2;
world.add(topRing);

const bottomRing = topRing.clone();
bottomRing.position.y = topY(HEIGHT - 1) - 0.55;
world.add(bottomRing);

const boardGroup = new THREE.Group();
const ghostGroup = new THREE.Group();
const activeGroup = new THREE.Group();
world.add(boardGroup, ghostGroup, activeGroup);

const cubeGeo = new THREE.BoxGeometry(CELL_W * 0.92, CELL_H * 0.92, DEPTH);
const materialCache = new Map<string, THREE.MeshStandardMaterial>();

function getMaterial(hex: string, ghost = false) {
  const key = `${hex}-${ghost}`;
  if (materialCache.has(key)) return materialCache.get(key)!;
  const material = new THREE.MeshStandardMaterial({
    color: hex,
    emissive: ghost ? hex : hex,
    emissiveIntensity: ghost ? 0.08 : 0.12,
    transparent: ghost,
    opacity: ghost ? 0.18 : 1,
    metalness: 0.08,
    roughness: 0.7,
  });
  materialCache.set(key, material);
  return material;
}

function wrapX(x: number) {
  return ((x % WIDTH) + WIDTH) % WIDTH;
}

function topY(row: number) {
  return (HEIGHT / 2 - row) * CELL_H - CELL_H / 2;
}

function getCells(piece: Piece, dx = 0, dy = 0, rotation = piece.rotation) {
  return piece.def.rotations[rotation].map((c) => ({
    x: wrapX(piece.x + c.x + dx),
    y: piece.y + c.y + dy,
    localX: c.x,
    localY: c.y,
  }));
}

function canPlace(piece: Piece, dx = 0, dy = 0, rotation = piece.rotation) {
  const cells = getCells(piece, dx, dy, rotation);
  return cells.every(({ x, y }) => {
    if (y >= HEIGHT) return false;
    if (y < 0) return true;
    return board[y][x] === 0;
  });
}

function createEmptyBoard() {
  board.length = 0;
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }, () => 0));
  }
}

function randomPiece(): Piece {
  const def = PIECES[Math.floor(Math.random() * PIECES.length)];
  return {
    def,
    rotation: 0,
    x: Math.floor(WIDTH / 2),
    y: -1,
  };
}

function spawnPiece() {
  activePiece = randomPiece();
  if (!canPlace(activePiece)) {
    gameOver = true;
    statusEl.textContent = '游戏结束：按 R 再来一局';
  } else {
    statusEl.textContent = `当前方块：${activePiece.def.name}`;
  }
}

function lockPiece() {
  if (!activePiece) return;
  for (const { x, y } of getCells(activePiece)) {
    if (y >= 0 && y < HEIGHT) board[y][x] = activePiece.def.color;
  }
  const removed = clearFullRings();
  if (removed > 0) {
    clearedRings += removed;
    score += removed * removed * 100;
    statusEl.textContent = removed === 1 ? '整圈消除！' : `连续消掉 ${removed} 圈！`;
  } else {
    score += 12;
  }
  updateHud();
  spawnPiece();
}

function clearFullRings() {
  let removed = 0;
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y].every((cell) => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array.from({ length: WIDTH }, () => 0));
      removed++;
      y++;
    }
  }
  return removed;
}

function tryMove(dx: number, dy: number) {
  if (!activePiece || gameOver) return false;
  if (canPlace(activePiece, dx, dy)) {
    activePiece.x = wrapX(activePiece.x + dx);
    activePiece.y += dy;
    return true;
  }
  return false;
}

function tryRotate() {
  if (!activePiece || gameOver) return;
  const nextRotation = (activePiece.rotation + 1) % activePiece.def.rotations.length;
  const kicks = [0, 1, -1, 2, -2];
  for (const kick of kicks) {
    if (canPlace(activePiece, kick, 0, nextRotation)) {
      activePiece.rotation = nextRotation;
      activePiece.x = wrapX(activePiece.x + kick);
      return;
    }
  }
}

function hardDrop() {
  if (!activePiece || gameOver) return;
  let distance = 0;
  while (tryMove(0, 1)) distance++;
  score += distance * 2;
  lockPiece();
}

function ghostY(piece: Piece) {
  let y = piece.y;
  while (canPlace({ ...piece, y }, 0, 1)) y++;
  return y;
}

function clearGroup(group: THREE.Group) {
  while (group.children.length) group.remove(group.children[0]);
}

function placeCellMesh(group: THREE.Group, x: number, y: number, color: string, ghost = false) {
  const angle = (x / WIDTH) * Math.PI * 2 + Math.PI / WIDTH;
  const mesh = new THREE.Mesh(cubeGeo, getMaterial(color, ghost));
  const surfaceRadius = ghost ? RADIUS - 0.02 : RADIUS - 0.04;
  mesh.position.set(Math.cos(angle) * surfaceRadius, topY(y), Math.sin(angle) * surfaceRadius);
  mesh.rotation.y = -angle + Math.PI / 2;
  group.add(mesh);
}

function renderBoard() {
  clearGroup(boardGroup);
  clearGroup(activeGroup);
  clearGroup(ghostGroup);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const cell = board[y][x];
      if (cell !== 0) placeCellMesh(boardGroup, x, y, COLORS[cell]);
    }
  }

  if (activePiece) {
    const gy = ghostY(activePiece);
    const ghostPiece = { ...activePiece, y: gy };
    for (const { x, y } of getCells(ghostPiece)) {
      if (y >= 0) placeCellMesh(ghostGroup, x, y, COLORS[activePiece.def.color], true);
    }

    for (const { x, y } of getCells(activePiece)) {
      if (y >= 0) placeCellMesh(activeGroup, x, y, COLORS[activePiece.def.color]);
    }
  }
}

function updateHud() {
  scoreEl.textContent = String(score);
  ringsEl.textContent = String(clearedRings);
  speedEl.textContent = `${(1 + clearedRings * 0.08).toFixed(2)}x`;
}

function resetGame() {
  score = 0;
  clearedRings = 0;
  dropAccumulator = 0;
  softDropping = false;
  gameOver = false;
  createEmptyBoard();
  updateHud();
  spawnPiece();
  renderBoard();
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width);
  const height = Math.max(320, rect.height);
  const aspect = width / height;

  camera.aspect = aspect;
  camera.position.set(0, aspect < 0.9 ? 2.0 : 2.2, aspect < 0.9 ? 19 : 17);
  camera.updateProjectionMatrix();

  const fitScale = Math.min(1, Math.max(0.68, height / 980));
  world.scale.setScalar(fitScale);
  world.position.y = aspect < 0.9 ? 1.6 : 1.35;

  renderer.setSize(width, height, false);
}

window.addEventListener('resize', resize);

window.addEventListener('keydown', (event) => {
  if (event.repeat && !['ArrowDown', 'a', 'd', 'A', 'D'].includes(event.key)) return;

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    tryMove(1, 0);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    tryMove(-1, 0);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    tryRotate();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    softDropping = true;
  } else if (event.key === ' ') {
    event.preventDefault();
    hardDrop();
  } else if (event.key === 'a' || event.key === 'A') {
    cameraSpin -= Math.PI / 12;
  } else if (event.key === 'd' || event.key === 'D') {
    cameraSpin += Math.PI / 12;
  } else if (event.key === 'r' || event.key === 'R') {
    resetGame();
  }

  renderBoard();
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowDown') softDropping = false;
});

canvas.addEventListener('pointerdown', (event) => {
  isDragging = true;
  dragStartX = event.clientX;
  dragStartSpin = cameraSpin;
  canvas.setPointerCapture(event.pointerId);
  canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('pointermove', (event) => {
  if (!isDragging) return;
  const deltaX = event.clientX - dragStartX;
  cameraSpin = dragStartSpin + deltaX * 0.012;
});

function stopDragging(pointerId?: number) {
  isDragging = false;
  if (pointerId !== undefined && canvas.hasPointerCapture(pointerId)) {
    canvas.releasePointerCapture(pointerId);
  }
  canvas.style.cursor = 'grab';
}

canvas.addEventListener('pointerup', (event) => {
  stopDragging(event.pointerId);
});

canvas.addEventListener('pointercancel', (event) => {
  stopDragging(event.pointerId);
});

canvas.addEventListener('pointerleave', () => {
  if (!isDragging) canvas.style.cursor = 'grab';
});

canvas.addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey) {
    cameraSpin += (event.deltaX + event.deltaY) * 0.003;
    event.preventDefault();
  }
}, { passive: false });

canvas.style.cursor = 'grab';

autoFocusCanvas();

function autoFocusCanvas() {
  canvas.tabIndex = 0;
  canvas.addEventListener('pointerdown', () => canvas.focus());
}

let previous = performance.now();
function frame(now: number) {
  const delta = now - previous;
  previous = now;

  const levelScale = Math.max(0.28, 1 - clearedRings * 0.035);
  dropAccumulator += delta;
  const interval = softDropping ? SOFT_DROP_INTERVAL : DROP_INTERVAL * levelScale;

  if (!gameOver && activePiece && dropAccumulator >= interval) {
    dropAccumulator = 0;
    const moved = tryMove(0, 1);
    if (!moved) lockPiece();
    renderBoard();
  }

  world.rotation.y += (cameraSpin - world.rotation.y) * 0.08;
  activeGroup.position.y = Math.sin(now * 0.004) * 0.03;
  ghostGroup.rotation.y = Math.sin(now * 0.0013) * 0.03;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

resize();
resetGame();
requestAnimationFrame(frame);
