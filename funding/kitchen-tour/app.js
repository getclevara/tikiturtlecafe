/* app.js — the ARC of Hilo culinary incubator kitchen, built to the permit set.
   Room and equipment placement follow sheets A03 (42'-0" x 20'-1"), A04
   (suspended ceiling + lighting) and K101 (foodservice equipment schedule). */

import * as THREE from './vendor/three.module.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import * as K from './kit.js';

const IN = 1 / 12;
const W = 42.0;        // A03: 42'-0"
const D = 20 + 1 / 12; // A03: 20'-1"
const CEIL = 10.0;     // suspended ceiling
const EYE = 5.5;

/* ------------------------------------------------------------------ renderer */

const canvas = document.getElementById('view');
const renderer = new THREE.WebGLRenderer({
  canvas, antialias: true, powerPreference: 'high-performance',
  preserveDrawingBuffer: true, // so a still can be grabbed off the canvas
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.88;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e1418);

const camera = new THREE.PerspectiveCamera(58, 1, 0.05, 300);
camera.position.set(2.5, EYE, 10.5);

// RoomEnvironment gives stainless something real to reflect. This is the single
// biggest contributor to the room not looking like plastic.
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.30; // keep reflections, lose the studio blowout

/* ------------------------------------------------------------ room shell */

const room = new THREE.Group();
scene.add(room);

// floor: quarry tile, subtly reflective from the wet-look sealer
const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), K.M.floor());
floor.rotation.x = -Math.PI / 2;
floor.position.set(W / 2, 0, D / 2);
floor.receiveShadow = true;
room.add(floor);

// grout grid, drawn as thin lines so the floor reads at scale
{
  const pts = [];
  for (let x = 0; x <= W; x += 2) pts.push(x, 0.006, 0, x, 0.006, D);
  for (let z = 0; z <= D; z += 2) pts.push(0, 0.006, z, W, 0.006, z);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  room.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
    color: 0x4c4842, transparent: true, opacity: 0.55,
  })));
}

// walls (inward facing)
function wall(w, h, x, y, z, ry) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), K.M.wall());
  m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true;
  room.add(m); return m;
}
wall(W, CEIL, W / 2, CEIL / 2, 0, 0);              // north (cook line)
wall(W, CEIL, W / 2, CEIL / 2, D, Math.PI);        // south
wall(D, CEIL, 0, CEIL / 2, D / 2, Math.PI / 2);    // west (to outside)
wall(D, CEIL, W, CEIL / 2, D / 2, -Math.PI / 2);   // east (to event center)

// stainless splash wainscot along the cook line wall
room.add(K.slab(W, 4.2, 0.06, K.M.steel(), W / 2, 3.6, 0.04));

// suspended ceiling, 2x4 grid with LED troffers (sheet A04)
{
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), K.M.ceiling());
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(W / 2, CEIL, D / 2);
  room.add(ceil);
  const grid = [];
  for (let x = 0; x <= W; x += 4) grid.push(x, CEIL - 0.01, 0, x, CEIL - 0.01, D);
  for (let z = 0; z <= D; z += 2) grid.push(0, CEIL - 0.01, z, W, CEIL - 0.01, z);
  const gg = new THREE.BufferGeometry();
  gg.setAttribute('position', new THREE.Float32BufferAttribute(grid, 3));
  room.add(new THREE.LineSegments(gg, new THREE.LineBasicMaterial({
    color: 0x9aa5ab, transparent: true, opacity: 0.7,
  })));
  // troffers on a regular field, per the reflected ceiling plan
  for (let x = 4; x < W; x += 6) for (let z = 3; z < D; z += 6) {
    room.add(K.slab(3.6, 0.06, 1.8, K.M.troffer(), x, CEIL - 0.06, z));
  }
}

/* ------------------------------------------------------------------ openings */

function doorway(x, z, w, ry, label, glass, doors = false) {
  const o = new THREE.Group();
  o.position.set(x, 0, z); o.rotation.y = ry;
  const h = 7.0, jamb = 0.35;
  o.add(K.slab(jamb, h, 0.5, K.M.steel(), -w / 2 - jamb / 2, h / 2, 0));
  o.add(K.slab(jamb, h, 0.5, K.M.steel(), w / 2 + jamb / 2, h / 2, 0));
  o.add(K.slab(w + jamb * 2, 0.35, 0.5, K.M.steel(), 0, h + 0.17, 0));
  // what lies beyond: daylight (west) or the lit event center (east)
  const glow = new THREE.MeshBasicMaterial({ color: glass, transparent: true, opacity: 0.9 });
  o.add(K.slab(w, h, 0.06, glow, 0, h / 2, -0.16));
  if (doors) o.add(K.swingDoors(w, h, 0.16));
  if (label) o.userData.label = label;
  room.add(o);
  return o;
}
// A03: the NEW DOUBLE SWING DOOR is in the exterior long wall, roughly a third
// of the way along, opening onto a new concrete landing that ties into the
// existing sidewalk. Catering crosses that landing to the event center.
const CATER_X = 13.4;
doorway(CATER_X, 0.28, 7.0, 0, 'Catering Doors', 0xdfeaf5, true);
// A03: the NEW SINGLE 42" DOOR is in the interior long wall at the west corner
doorway(2.5, D - 0.28, 3.5, Math.PI, 'Interior Hall', 0x93a3ad);

// PROPOSED, not permitted: service pass-through in the WEST END wall, the far
// end from the burners. The Cafe POS and front of house sit on the other side
// of this wall, so ready orders hand straight across. Flagged for Andrew Ling.
const PASS_Z = 12.6;
const passWin = K.passThrough(5.2);
passWin.position.set(0.14, 0, PASS_Z);
passWin.rotation.y = Math.PI / 2;
room.add(passWin);

/* ------------------------------------------------------------------- layout */

const tags = [];
function place(obj, x, z, ry = 0, tag = null) {
  obj.position.set(x, 0, z);
  obj.rotation.y = ry;
  room.add(obj);
  if (tag) {
    const b = new THREE.Box3().setFromObject(obj);
    tags.push({ item: tag.item, name: tag.name,
      pos: new THREE.Vector3(x, Math.min(b.max.y + 0.5, CEIL - 0.7), z) });
  }
  return obj;
}
// depth-aware placement against a wall: back face sits `gap` off the wall
const northZ = (depthIn, gap = 0.4) => gap + (depthIn * IN) / 2;
const southZ = (depthIn, gap = 0.4) => D - gap - (depthIn * IN) / 2;

/* -- Zone 1: warewashing + receiving (west end) ---------------------------- */
place(K.compSink(3, 108 * IN, 30 * IN), 5.0, northZ(30), 0, { item: 22, name: '3-Compartment Sink' });
place(K.warewasher(), 1.5, 5.2, Math.PI / 2, { item: 23, name: 'High-Temp Warewasher' });
place(K.workTable(48 * IN, 28 * IN, { backsplash: true }), 1.6, 8.6, Math.PI / 2, { item: 23, name: 'Dishtable' });
place(K.handSink(), 0.95, 17.6, Math.PI / 2, { item: 24, name: 'Hand Sink' });
place(K.shelving(48 * IN, 24 * IN, 4), 21.6, 13.6, Math.PI / 2, { item: 27, name: 'Rack Storage' });

/* -- Zone 2: cold + dry storage ------------------------------------------- */
place(K.walkIn(10.0, 7.6), 14.5, D - 3.8 - 0.2, Math.PI, { item: 7, name: 'Walk-In Cold Storage' });
place(K.potRack(60 * IN, 24 * IN), 17.8, 10.4, Math.PI / 2, { item: null, name: 'Pot & Pan Rack' });

/* -- Zone 3: prep ---------------------------------------------------------- */
place(K.compSink(2, 60 * IN, 30 * IN), 6.9, southZ(30), Math.PI, { item: 25, name: '2-Compartment Prep Sink' });
place(K.shelving(48 * IN, 24 * IN, 4), 18.0, northZ(24), 0, { item: 27, name: 'Louvered Shelving' });
place(K.dryCabinet(48 * IN, 24 * IN), 21.0, northZ(24), 0, { item: null, name: 'Dry Cabinet' });
const runX = 25.0;
place(K.stainlessRun(10.0, 30 * IN), runX, southZ(30), Math.PI, { item: 20, name: 'Custom Stainless Run' });
place(K.ingredientBins(4, 14 * IN), runX, southZ(30) - 0.9, Math.PI, { item: 21, name: 'Ingredient Bins' });
place(K.handSink(), 19.4, southZ(14), Math.PI, { item: 24, name: 'Hand Sink' });

/* -- Zone 4: the cook line (north wall, under the hood) -------------------- */
let cx = 22.0;
const run = (obj, wIn, dIn, tag) => {
  const w = wIn * IN;
  place(obj, cx + w / 2, northZ(dIn), 0, tag);
  cx += w;
};
run(K.workTable(36 * IN, 30 * IN, { backsplash: true }), 36, 30, { item: 11, name: 'Work Table' });
run(K.range6Burner(36 * IN, 32 * IN), 36, 32, { item: 1, name: 'Range, 6-Burner + Oven' });
run(K.charBroiler(36 * IN, 32 * IN), 36, 32, { item: 2, name: 'Under-Fired Broiler' });
run(K.griddle(24 * IN, 32 * IN), 24, 32, { item: 3, name: 'Griddle' });
run(K.fryerBank(2, 16 * IN, 32 * IN), 32, 32, { item: 5, name: 'Fryers + Dump Station' });
run(K.workTable(30 * IN, 30 * IN, { backsplash: true }), 30, 30, { item: 10, name: 'Landing Table' });
run(K.convectionOvenDouble(38 * IN, 38 * IN), 38, 38, { item: 6, name: 'Double Convection Oven' });
const lineStart = 22.0, lineEnd = cx;
place(K.exhaustHood(lineEnd - lineStart, 54 * IN), (lineStart + lineEnd) / 2, northZ(54), 0,
  { item: 12, name: 'Type I Exhaust Hood' });

/* -- Zone 5: the pass ------------------------------------------------------ */
place(K.chefIsland(12.0, 48 * IN), 31.5, 9.6, 0, { item: 19, name: "Chef's Island / Pass" });

/* -- Zone 6: reach-ins + shelving (south wall, east) ----------------------- */
place(K.reachIn(1, 30 * IN, 34 * IN, false), 30.6, southZ(34), Math.PI, { item: 9, name: 'Reach-In Refrigerator' });
place(K.reachIn(1, 30 * IN, 34 * IN, true), 33.2, southZ(34), Math.PI, { item: 8, name: 'Reach-In Freezer' });
place(K.reachIn(1, 30 * IN, 34 * IN, false), 35.8, southZ(34), Math.PI, { item: 9, name: 'Reach-In Refrigerator' });
place(K.shelving(60 * IN, 24 * IN, 4), 39.4, southZ(24), Math.PI, { item: 27, name: 'Louvered Shelving' });
place(K.workTable(48 * IN, 30 * IN, { backsplash: true, cuttingBoard: 40 }), 39.0, northZ(30) + 0.2, 0,
  { item: 26, name: 'Work Table' });

tags.push({ item: null, name: 'Proposed: pass-through to Cafe POS',
  pos: new THREE.Vector3(1.2, 7.2, PASS_Z) });
tags.push({ item: null, name: 'Catering doors to event center',
  pos: new THREE.Vector3(CATER_X, 7.6, 0.9) });

/* -- dressing: the 5% of clutter that buys the believability --------------- */
{
  const p1 = K.stockpot(7 * IN, 10 * IN); p1.position.set(23.4, 34 * IN + 0.02, northZ(30)); room.add(p1);
  const p2 = K.stockpot(5 * IN, 7 * IN); p2.position.set(24.1, 34 * IN + 0.02, northZ(30) + 0.5); room.add(p2);
  for (let i = 0; i < 3; i++) {
    const pan = K.sheetPan(); pan.position.set(36.6 + i * 0.06, 34 * IN + 0.05 + i * 0.06, northZ(30) + 0.1);
    room.add(pan);
  }
  const b = K.ingredientBins(3, 13 * IN); b.position.set(17.8, 2.9, 10.4); b.rotation.y = Math.PI / 2; room.add(b);
}

/* ------------------------------------------------------------------ lighting */

scene.add(new THREE.HemisphereLight(0xc8dae6, 0x241f1a, 0.22));

// key light angled through the room, the one that casts real shadows
const key = new THREE.DirectionalLight(0xffe9cf, 0.95);
key.position.set(10, 16, -6);
key.target.position.set(28, 0, 12);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -30; key.shadow.camera.right = 30;
key.shadow.camera.top = 30; key.shadow.camera.bottom = -30;
key.shadow.camera.far = 70;
key.shadow.bias = -0.0012;
key.shadow.normalBias = 0.02;
scene.add(key, key.target);

// ceiling fill so the far end never goes muddy
for (const [x, z] of [[7, 10], [19, 10], [31, 10], [39, 10]]) {
  const l = new THREE.PointLight(0xfff1dd, 15, 22, 2);
  l.position.set(x, CEIL - 0.6, z);
  scene.add(l);
}
// warm spill from the cook line + the doors to the event center
for (const lx of [25.5, 31.0, 37.0]) {
  const hl = new THREE.PointLight(0xffe2bc, 13, 13, 2);
  hl.position.set(lx, 6.1, 2.9); scene.add(hl);
}
// warmth from the event center, set back far enough that it spills across the
// room instead of scorching the door leaves it sits next to
const eventLight = new THREE.PointLight(0xffcf93, 10, 17, 2);
eventLight.position.set(W - 3.4, 5.2, 9.6); scene.add(eventLight);
const dayLight = new THREE.PointLight(0xbfdcff, 11, 15, 2);
dayLight.position.set(2.6, 5.2, 10.6); scene.add(dayLight);

/* --------------------------------------------------------------- the tour */

const SHOTS = [
  { id: 'arrive', title: 'Arrive',
    pos: [13.4, EYE, 3.4], look: [37, 4.4, 6.4],
    caption: 'In through the new double-acting doors off the concrete landing. Forty-two feet of working kitchen opens to your right, in a building the ARC of Hilo already operates.' },
  { id: 'store', title: 'Receive & store',
    pos: [8.2, EYE, 5.6], look: [16.4, 4.2, 12.6],
    caption: 'Cold storage and dry goods. The walk-in and the louvered shelving are what let a trainee cohort and a catering order share one kitchen without colliding.' },
  { id: 'prep', title: 'Prep',
    pos: [21.4, EYE, 14.0], look: [26.0, 3.9, 18.8],
    caption: 'The custom stainless run: ingredient bins below, double over-shelf above, power routed through the counter. This is where most of the teaching happens.' },
  { id: 'line', title: 'The line',
    pos: [19.4, 5.4, 5.6], look: [41, 4.0, 3.1],
    caption: 'Range, broiler, griddle, fryers, double convection oven, all under one Type I hood. A commercial line a student can be certified on, and a caterer can run a 300-plate event on.' },
  { id: 'pass', title: 'Pass & plate',
    pos: [36.8, 5.2, 13.8], look: [27.6, 3.6, 6.8],
    caption: "The chef's island is the pass. Cold rails and plate storage below, heat lamps above, pick-up at both ends, and the cook line three steps behind it." },
  { id: 'cafe', title: 'Straight to the cafe',
    pos: [8.6, 5.3, 15.4], look: [0.2, 4.3, 12.3],
    caption: 'Proposed, not yet permitted: a service pass-through in the west end wall, with the Cafe POS and front of house directly on the other side. Ready orders hand straight across instead of being carried around. Note for Andrew Ling.' },
  { id: 'out', title: 'Out to the event center',
    pos: [21.8, 5.5, 9.6], look: [12.6, 4.7, 0.3],
    caption: 'The double-acting doors open onto the new landing and the existing sidewalk, and the event center is a short push across it. That adjacency is the whole business case: catering revenue that funds the training.' },
  { id: 'wash', title: 'Wash & reset',
    pos: [11.0, EYE, 6.2], look: [1.5, 4.0, 4.4],
    caption: 'Three-compartment sink and a high-temp warewasher. Unglamorous, and the reason the kitchen can turn around twice in a day.' },
  { id: 'room', title: 'The whole room',
    pos: [40.3, 6.7, 6.3], look: [5, 3.0, 8.8],
    caption: '42\u2032-0\u2033 \u00d7 20\u2032-1\u2033. One certified commercial kitchen, one culinary incubator, one workforce pipeline on Hawai\u02bbi Island.' },
];

const state = {
  mode: 'tour', shot: 0, t: 0, playing: true,
  from: { pos: new THREE.Vector3(), look: new THREE.Vector3() },
  look: new THREE.Vector3(24, 4.8, 8.4),
  yaw: 0, pitch: 0, keys: new Set(),
};
const HOLD = 5.2, MOVE = 3.4; // seconds per shot: glide, then hold

const v = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const smooth = (t) => t * t * (3 - 2 * t);

function beginShot(i, instant = false) {
  state.shot = (i + SHOTS.length) % SHOTS.length;
  state.from.pos.copy(camera.position);
  state.from.look.copy(state.look);
  state.t = instant ? MOVE : 0;
  const s = SHOTS[state.shot];
  document.getElementById('shot-title').textContent = s.title;
  document.getElementById('shot-caption').textContent = s.caption;
  document.querySelectorAll('.chip').forEach((c, n) =>
    c.setAttribute('aria-current', n === state.shot ? 'true' : 'false'));
  if (instant) {
    camera.position.copy(v(s.pos));
    state.look.copy(v(s.look));
  }
}

function updateTour(dt) {
  const s = SHOTS[state.shot];
  if (state.playing) state.t += dt;
  const k = smooth(Math.min(state.t / MOVE, 1));
  camera.position.lerpVectors(state.from.pos, v(s.pos), k);
  state.look.lerpVectors(state.from.look, v(s.look), k);
  camera.lookAt(state.look);
  const prog = Math.min(state.t / (MOVE + HOLD), 1);
  document.getElementById('bar').style.transform = `scaleX(${prog})`;
  if (state.playing && state.t >= MOVE + HOLD) beginShot(state.shot + 1);
}

/* ---------------------------------------------------------------- free roam */

function enterFree() {
  state.mode = 'free';
  const dir = new THREE.Vector3().subVectors(state.look, camera.position).normalize();
  state.yaw = Math.atan2(-dir.x, -dir.z);
  state.pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
  document.body.dataset.mode = 'free';
}
function enterTour() {
  state.mode = 'tour'; state.playing = true;
  document.body.dataset.mode = 'tour';
  beginShot(state.shot);
}

function updateFree(dt) {
  const speed = (state.keys.has('shift') ? 11 : 5.4) * dt;
  const fwd = new THREE.Vector3(-Math.sin(state.yaw), 0, -Math.cos(state.yaw));
  const right = new THREE.Vector3(Math.cos(state.yaw), 0, -Math.sin(state.yaw));
  const move = new THREE.Vector3();
  if (state.keys.has('w') || state.keys.has('arrowup')) move.add(fwd);
  if (state.keys.has('s') || state.keys.has('arrowdown')) move.sub(fwd);
  if (state.keys.has('d') || state.keys.has('arrowright')) move.add(right);
  if (state.keys.has('a') || state.keys.has('arrowleft')) move.sub(right);
  if (move.lengthSq()) camera.position.addScaledVector(move.normalize(), speed);
  // keep the visitor inside the room
  camera.position.x = THREE.MathUtils.clamp(camera.position.x, 0.9, W - 0.9);
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, 0.9, D - 0.9);
  camera.position.y = EYE;
  const dir = new THREE.Vector3(
    -Math.sin(state.yaw) * Math.cos(state.pitch),
    Math.sin(state.pitch),
    -Math.cos(state.yaw) * Math.cos(state.pitch));
  state.look.copy(camera.position).add(dir);
  camera.lookAt(state.look);
}

/* -------------------------------------------------------------- equipment tags */

// grout/ceiling grid lines must not count as occluders for the tag raycasts
room.traverse((o) => { if (o.isLine || o.isPoints) o.raycast = () => {}; });

const tagLayer = document.getElementById('tags');
const tagEls = tags.map((t) => {
  const el = document.createElement('div');
  el.className = 'tag';
  el.innerHTML = t.item
    ? `<b>${t.item}</b><span>${t.name}</span>`
    : `<span>${t.name}</span>`;
  tagLayer.appendChild(el);
  return el;
});
let tagsOn = false;
const proj = new THREE.Vector3();
const ray = new THREE.Raycaster();
const blocked = new Array(tags.length).fill(false);
let occTick = 0;

function updateTags() {
  if (!tagsOn) return;
  const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
  const camDir = new THREE.Vector3(); camera.getWorldDirection(camDir);
  const dir = new THREE.Vector3();
  // occlusion is the difference between "labelled" and "x-ray vision"; only the
  // handful of tags actually on screen get raycast, and only every few frames
  const doOcclusion = (occTick++ % 6) === 0;
  tags.forEach((t, i) => {
    const toTag = new THREE.Vector3().subVectors(t.pos, camera.position);
    const dist = toTag.length();
    dir.copy(toTag).normalize();
    const el = tagEls[i];
    if (dir.dot(camDir) < 0.25 || dist > 34) { el.style.opacity = '0'; return; }
    if (doOcclusion) {
      ray.set(camera.position, dir);
      ray.far = dist - 0.75;
      blocked[i] = ray.intersectObject(room, true).length > 0;
    }
    if (blocked[i]) { el.style.opacity = '0'; return; }
    proj.copy(t.pos).project(camera);
    el.style.opacity = String(THREE.MathUtils.clamp(1.35 - dist / 30, 0.2, 1));
    el.style.transform =
      `translate(-50%,-50%) translate(${(proj.x * 0.5 + 0.5) * w}px, ${(-proj.y * 0.5 + 0.5) * h}px)`;
  });
}

/* ------------------------------------------------------------------ controls */

document.getElementById('chips').innerHTML = SHOTS
  .map((s, i) => `<button class="chip" data-i="${i}">${i + 1}. ${s.title}</button>`).join('');
document.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => {
  if (state.mode === 'free') enterTour();
  state.playing = true;
  beginShot(Number(c.dataset.i));
}));

const playBtn = document.getElementById('play');
playBtn.addEventListener('click', () => {
  if (state.mode === 'free') { enterTour(); return; }
  state.playing = !state.playing;
  playBtn.textContent = state.playing ? 'Pause' : 'Play tour';
});
document.getElementById('roam').addEventListener('click', () => {
  state.mode === 'free' ? enterTour() : enterFree();
});
/* Print-resolution still of the current view, for the deck. Renders the frame
   at 3x and hands back a PNG; the HTML equipment tags are deliberately not
   baked in, so the image stays clean. */
document.getElementById('shot-still').addEventListener('click', (e) => {
  const btn = e.currentTarget, w = canvas.clientWidth, h = canvas.clientHeight;
  const prev = renderer.getPixelRatio();
  btn.disabled = true; btn.textContent = 'Rendering…';
  renderer.setPixelRatio(3);
  renderer.setSize(w, h, false);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  canvas.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `arc-hilo-kitchen-${SHOTS[state.shot].id}-${w * 3}x${h * 3}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
    renderer.setPixelRatio(prev);
    renderer.setSize(w, h, false);
    camera.updateProjectionMatrix();
    btn.disabled = false; btn.textContent = 'Save still';
  }, 'image/png');
});

document.getElementById('tagbtn').addEventListener('click', (e) => {
  tagsOn = !tagsOn;
  tagLayer.style.display = tagsOn ? 'block' : 'none';
  e.currentTarget.setAttribute('aria-pressed', String(tagsOn));
});

addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  state.keys.add(k === 'shift' ? 'shift' : k);
  if (k === 'f') document.getElementById('roam').click();
  if (state.mode === 'free' && ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
});
addEventListener('keyup', (e) => state.keys.delete(e.key.toLowerCase()));

// drag to look — works in both modes, and dragging during the tour takes over
let dragging = false, px = 0, py = 0;
canvas.addEventListener('pointerdown', (e) => {
  dragging = true; px = e.clientX; py = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointerup', (e) => {
  dragging = false; canvas.releasePointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  if (state.mode !== 'free') enterFree();
  state.yaw -= (e.clientX - px) * 0.0032;
  state.pitch = THREE.MathUtils.clamp(state.pitch - (e.clientY - py) * 0.0028, -0.85, 0.85);
  px = e.clientX; py = e.clientY;
});

/* --------------------------------------------------------------------- loop */

// Shots are framed for a wide viewport. three.js fov is vertical, so on a phone
// in portrait a fixed fov would crop the room to a slot; hold the horizontal
// field constant instead and let the vertical open up.
const BASE_FOV = 58, BASE_ASPECT = 16 / 9;
const H_FOV = 2 * Math.atan(Math.tan((BASE_FOV * Math.PI) / 360) * BASE_ASPECT);

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  const dpr = renderer.getPixelRatio();
  if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    camera.fov = aspect >= BASE_ASPECT
      ? BASE_FOV
      : Math.min(86, (2 * Math.atan(Math.tan(H_FOV / 2) / aspect) * 180) / Math.PI);
    camera.updateProjectionMatrix();
  }
}

const clock = new THREE.Clock();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) { state.playing = false; playBtn.textContent = 'Play tour'; }

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  resize();
  state.mode === 'free' ? updateFree(dt) : updateTour(dt);
  updateTags();
  renderer.render(scene, camera);
}

/* Deep links: ?shot=line (or an index) opens on that view, &still=1 holds it.
   Handy for dropping a specific frame into a deck or an email. */
const params = new URLSearchParams(location.search);
const want = params.get('shot');
let startShot = 0;
if (want !== null) {
  const byId = SHOTS.findIndex((s) => s.id === want.toLowerCase());
  startShot = byId >= 0 ? byId : THREE.MathUtils.clamp(parseInt(want, 10) - 1 || 0, 0, SHOTS.length - 1);
}
if (params.get('still') === '1') { state.playing = false; playBtn.textContent = 'Play tour'; }

// handle for inspecting/debugging the scene from the console
window.__tour = { scene, camera, room, renderer, SHOTS, state };

beginShot(startShot, true);
document.body.dataset.mode = 'tour';
tick();
document.getElementById('loading').classList.add('gone');
