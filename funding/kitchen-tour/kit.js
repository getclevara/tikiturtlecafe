/* kit.js — parametric foodservice equipment builders.
   Units: 1 = 1 foot. Origin of each piece is its footprint center, sitting on y=0.
   Geometry is deliberately low-poly-but-detailed: silhouettes and materials do the
   heavy lifting, which is what reads as "real" in a walkthrough. */

import * as THREE from './vendor/three.module.js';

const IN = 1 / 12; // inches -> feet

/* ---------------------------------------------------------------- materials */

const cache = new Map();
const mat = (key, make) => {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
};

export const M = {
  // brushed stainless: the dominant material in the room
  steel: () => mat('steel', () => new THREE.MeshStandardMaterial({
    color: 0x9aa3ac, metalness: 0.88, roughness: 0.41,
  })),
  // polished trim / handles
  chrome: () => mat('chrome', () => new THREE.MeshStandardMaterial({
    color: 0xb8c0c8, metalness: 1.0, roughness: 0.18,
  })),
  // dark stainless + black glass fronts (the "state of the art" look)
  darkSteel: () => mat('darkSteel', () => new THREE.MeshStandardMaterial({
    color: 0x2f363d, metalness: 0.82, roughness: 0.3,
  })),
  glass: () => mat('glass', () => new THREE.MeshStandardMaterial({
    color: 0x0b0e11, metalness: 0.55, roughness: 0.08,
  })),
  blackMatte: () => mat('blackMatte', () => new THREE.MeshStandardMaterial({
    color: 0x1c2126, metalness: 0.25, roughness: 0.7,
  })),
  castIron: () => mat('castIron', () => new THREE.MeshStandardMaterial({
    color: 0x33393d, metalness: 0.5, roughness: 0.8,
  })),
  // hot surfaces
  griddlePlate: () => mat('griddlePlate', () => new THREE.MeshStandardMaterial({
    color: 0x2e3338, metalness: 0.9, roughness: 0.22,
  })),
  ember: () => mat('ember', () => new THREE.MeshStandardMaterial({
    color: 0x2a0d05, emissive: 0xff5a1f, emissiveIntensity: 1.5, roughness: 0.9,
  })),
  flame: () => mat('flame', () => new THREE.MeshStandardMaterial({
    color: 0x0a1a2a, emissive: 0x2f9bd6, emissiveIntensity: 2.2, roughness: 1,
  })),
  // readouts — brand ocean + sunset
  readoutCyan: () => mat('readoutCyan', () => new THREE.MeshStandardMaterial({
    color: 0x04222a, emissive: 0x12b5c4, emissiveIntensity: 2.6, roughness: 0.5,
  })),
  readoutAmber: () => mat('readoutAmber', () => new THREE.MeshStandardMaterial({
    color: 0x2a1a04, emissive: 0xf59e42, emissiveIntensity: 2.2, roughness: 0.5,
  })),
  // interiors that glow when lit
  ovenGlow: () => mat('ovenGlow', () => new THREE.MeshStandardMaterial({
    color: 0x3a2a12, emissive: 0xffa53d, emissiveIntensity: 0.9, roughness: 0.9,
  })),
  coldGlow: () => mat('coldGlow', () => new THREE.MeshStandardMaterial({
    color: 0x0d2630, emissive: 0x8fe3f2, emissiveIntensity: 0.8, roughness: 0.9,
  })),
  // room surfaces
  floor: () => mat('floor', () => new THREE.MeshStandardMaterial({
    color: 0x55504a, metalness: 0.04, roughness: 0.66,
  })),
  wall: () => mat('wall', () => new THREE.MeshStandardMaterial({
    color: 0xb9c2c7, metalness: 0.02, roughness: 0.62,
  })),
  ceiling: () => mat('ceiling', () => new THREE.MeshStandardMaterial({
    color: 0xc4ccd1, metalness: 0.0, roughness: 0.94,
  })),
  troffer: () => mat('troffer', () => new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xfff4e2, emissiveIntensity: 1.15, roughness: 1,
  })),
  ledStrip: () => mat('ledStrip', () => new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xfff0dc, emissiveIntensity: 1.9, roughness: 1,
  })),
  // dressing
  poly: () => mat('poly', () => new THREE.MeshStandardMaterial({
    color: 0xd8cdb6, metalness: 0.0, roughness: 0.78,
  })),
  binPlastic: () => mat('binPlastic', () => new THREE.MeshStandardMaterial({
    color: 0xcfd8dc, metalness: 0.0, roughness: 0.35, transparent: true, opacity: 0.55,
  })),
  teal: () => mat('teal', () => new THREE.MeshStandardMaterial({
    color: 0x12b5c4, metalness: 0.3, roughness: 0.45,
  })),
  // warm dining-room light on the far side of the cafe pass-through
  fohGlow: () => mat('fohGlow', () => new THREE.MeshStandardMaterial({
    color: 0x2b1d0e, emissive: 0xffbe73, emissiveIntensity: 1.5, roughness: 0.8,
  })),
  portGlow: () => mat('portGlow', () => new THREE.MeshStandardMaterial({
    color: 0x2a1e0c, emissive: 0xffc981, emissiveIntensity: 1.25, roughness: 0.6,
  })),
  panelWhite: () => mat('panelWhite', () => new THREE.MeshStandardMaterial({
    color: 0xaeb7bc, metalness: 0.3, roughness: 0.55,
  })),
};

/* ------------------------------------------------------------------ helpers */

const BOX = new THREE.BoxGeometry(1, 1, 1);
const CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 20);

export function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(BOX, material);
  m.scale.set(w, h, d);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

// box positioned by center (not by base) — for trim, panels, floating parts
export function slab(w, h, d, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(BOX, material);
  m.scale.set(w, h, d);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function cyl(r, h, material, x = 0, y = 0, z = 0, seg = 20) {
  const g = seg === 20 ? CYL : new THREE.CylinderGeometry(0.5, 0.5, 1, seg);
  const m = new THREE.Mesh(g, material);
  m.scale.set(r * 2, h, r * 2);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

const g = (name) => { const o = new THREE.Group(); o.name = name; return o; };

/* Legs + undershelf: the base every piece of stainless sits on. */
function legs(o, w, d, h, inset = 2 * IN) {
  const r = 0.7 * IN;
  const xs = [-w / 2 + inset, w / 2 - inset];
  const zs = [-d / 2 + inset, d / 2 - inset];
  for (const x of xs) for (const z of zs) {
    o.add(cyl(r, h, M.chrome(), x, 0, z, 8));
    o.add(cyl(r * 1.6, 1 * IN, M.blackMatte(), x, 0, z, 8)); // bullet foot
  }
}

/* ------------------------------------------------------------- work surfaces */

export function workTable(w, d = 30 * IN, opts = {}) {
  const o = g('Work Table');
  const H = 34 * IN, top = 1.5 * IN;
  legs(o, w, d, H - top);
  o.add(slab(w, top, d, M.steel(), 0, H - top / 2, 0));
  if (opts.backsplash) {
    const bs = 8 * IN;
    o.add(slab(w, bs, 1 * IN, M.steel(), 0, H + bs / 2, -d / 2 + 0.5 * IN));
  }
  if (opts.undershelf !== false) {
    o.add(slab(w - 4 * IN, 1 * IN, d - 4 * IN, M.steel(), 0, 8 * IN, 0));
  }
  if (opts.cuttingBoard) {
    o.add(slab(opts.cuttingBoard * IN, 0.5 * IN, 10 * IN, M.poly(), 0, H + 0.3 * IN, d / 2 - 7 * IN));
  }
  return o;
}

/* Enclosed cabinet base — used for plate cabinets and custom stainless runs. */
export function cabinetBase(w, d, h, material = M.steel()) {
  const o = g('Cabinet');
  o.add(box(w, h - 4 * IN, d, material, 0, 4 * IN, 0));
  o.add(slab(w, 1.5 * IN, d, M.steel(), 0, h - 0.75 * IN, 0));
  // toe kick shadow gap
  o.add(box(w - 3 * IN, 4 * IN, d - 3 * IN, M.blackMatte(), 0, 0, 0));
  return o;
}

/* ------------------------------------------------------------------ hot line */

export function range6Burner(w = 36 * IN, d = 32 * IN) {
  const o = g('Range');
  const H = 36 * IN;
  o.add(box(w, H - 6 * IN, d, M.steel(), 0, 6 * IN, 0));
  o.add(box(w - 2 * IN, 6 * IN, d - 2 * IN, M.blackMatte(), 0, 0, 0));
  // oven door with window + handle
  o.add(slab(w - 4 * IN, 18 * IN, 1 * IN, M.glass(), 0, 16 * IN, d / 2 + 0.4 * IN));
  o.add(slab(w - 12 * IN, 10 * IN, 0.6 * IN, M.ovenGlow(), 0, 16 * IN, d / 2 + 0.9 * IN));
  o.add(cyl(1 * IN, w - 6 * IN, M.chrome(), 0, 27 * IN, d / 2 + 1.6 * IN, 10)
    .rotateZ(Math.PI / 2));
  // cast iron grates, 3 x 2
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
    const gx = -w / 2 + w / 6 + (i * w) / 3;
    const gz = -d / 4 + (j * d) / 3.2;
    o.add(slab(w / 3 - 1.5 * IN, 1 * IN, d / 3.4, M.castIron(), gx, H + 0.5 * IN, gz));
    o.add(slab(3 * IN, 0.7 * IN, 3 * IN, M.flame(), gx, H - 1.2 * IN, gz));
  }
  // control knobs with amber halo
  for (let i = 0; i < 6; i++) {
    const kx = -w / 2 + 3 * IN + i * ((w - 6 * IN) / 5);
    o.add(cyl(1.1 * IN, 1.2 * IN, M.blackMatte(), kx, 0, 0, 12)
      .translateY(31 * IN).translateZ(d / 2 + 1.2 * IN).rotateX(Math.PI / 2));
    o.add(slab(2.4 * IN, 2.4 * IN, 0.3 * IN, M.readoutAmber(), kx, 31 * IN, d / 2 + 0.6 * IN));
  }
  return o;
}

export function charBroiler(w = 36 * IN, d = 32 * IN) {
  const o = g('Char Broiler');
  const H = 36 * IN;
  o.add(box(w, H - 8 * IN, d, M.steel(), 0, 8 * IN, 0));
  o.add(box(w - 2 * IN, 8 * IN, d - 2 * IN, M.blackMatte(), 0, 0, 0));
  // ember bed
  o.add(slab(w - 4 * IN, 1 * IN, d - 6 * IN, M.ember(), 0, H - 3 * IN, 0));
  // grate bars
  const bars = Math.floor(w / (1.6 * IN));
  for (let i = 0; i < bars; i++) {
    const bx = -w / 2 + 1.2 * IN + i * (1.6 * IN);
    if (bx > w / 2 - 1 * IN) break;
    o.add(slab(0.7 * IN, 0.7 * IN, d - 6 * IN, M.castIron(), bx, H + 0.3 * IN, 0));
  }
  o.add(slab(w, 6 * IN, 1 * IN, M.steel(), 0, H + 3 * IN, -d / 2 + 0.5 * IN));
  return o;
}

export function griddle(w = 24 * IN, d = 32 * IN) {
  const o = g('Griddle');
  const H = 36 * IN;
  o.add(box(w, H - 8 * IN, d, M.steel(), 0, 8 * IN, 0));
  o.add(box(w - 2 * IN, 8 * IN, d - 2 * IN, M.blackMatte(), 0, 0, 0));
  o.add(slab(w, 1.5 * IN, d - 3 * IN, M.griddlePlate(), 0, H, 0));
  // grease trough + splash guards
  o.add(slab(w, 2 * IN, 1.5 * IN, M.steel(), 0, H + 1 * IN, d / 2 - 1 * IN));
  o.add(slab(w, 7 * IN, 0.8 * IN, M.steel(), 0, H + 4 * IN, -d / 2 + 0.4 * IN));
  o.add(slab(w - 4 * IN, 1.6 * IN, 0.4 * IN, M.readoutCyan(), 0, 31 * IN, d / 2 + 0.6 * IN));
  return o;
}

export function fryerBank(vats = 2, w = 16 * IN, d = 32 * IN) {
  const o = g('Fryer');
  const H = 36 * IN;
  for (let i = 0; i < vats; i++) {
    const x = -((vats - 1) * w) / 2 + i * w;
    o.add(box(w - 0.5 * IN, H - 8 * IN, d, M.steel(), x, 8 * IN, 0));
    o.add(box(w - 3 * IN, 8 * IN, d - 3 * IN, M.blackMatte(), x, 0, 0));
    // oil surface
    o.add(slab(w - 5 * IN, 0.6 * IN, d - 8 * IN, M.readoutAmber(), x, H - 3 * IN, 0));
    // basket + handle
    o.add(slab(w - 7 * IN, 5 * IN, d - 12 * IN, M.chrome(), x, H - 1 * IN, -1 * IN));
    o.add(cyl(0.6 * IN, 9 * IN, M.blackMatte(), x, H + 1 * IN, d / 2 - 3 * IN, 8)
      .rotateX(Math.PI / 2.4));
    // digital controller
    o.add(slab(w - 4 * IN, 3 * IN, 0.4 * IN, M.glass(), x, 30 * IN, d / 2 + 0.5 * IN));
    o.add(slab(w - 8 * IN, 1.2 * IN, 0.5 * IN, M.readoutCyan(), x, 30 * IN, d / 2 + 0.8 * IN));
  }
  return o;
}

export function convectionOvenDouble(w = 38 * IN, d = 38 * IN) {
  const o = g('Convection Oven');
  const H = 68 * IN;
  o.add(box(w, H - 8 * IN, d, M.steel(), 0, 8 * IN, 0));
  // legs
  legs(o, w - 4 * IN, d - 4 * IN, 8 * IN);
  for (let i = 0; i < 2; i++) {
    const y = 14 * IN + i * 27 * IN;
    // glass doors, split pair
    for (const s of [-1, 1]) {
      o.add(slab(w / 2 - 2 * IN, 24 * IN, 1 * IN, M.glass(), s * w / 4, y + 12 * IN, d / 2 + 0.5 * IN));
      o.add(slab(w / 2 - 7 * IN, 17 * IN, 0.6 * IN, M.ovenGlow(), s * w / 4, y + 12 * IN, d / 2 + 1.0 * IN));
      o.add(cyl(0.8 * IN, 22 * IN, M.chrome(), s * (w / 2 - 2 * IN), y + 12 * IN, d / 2 + 1.8 * IN, 10));
    }
    o.add(slab(w, 3 * IN, 0.5 * IN, M.blackMatte(), 0, y - 2 * IN, d / 2 + 0.6 * IN));
    o.add(slab(8 * IN, 1.4 * IN, 0.6 * IN, M.readoutCyan(), w / 2 - 7 * IN, y - 2 * IN, d / 2 + 0.9 * IN));
  }
  return o;
}

/* The hood is the single biggest visual anchor in the room. */
export function exhaustHood(w, d = 54 * IN) {
  const o = g('Exhaust Hood');
  const bottom = 78 * IN, top = 96 * IN, h = top - bottom;
  // canopy body, slightly tapered by stacking two slabs
  o.add(slab(w, h * 0.55, d, M.steel(), 0, bottom + h * 0.275, 0));
  o.add(slab(w, h * 0.45, d * 0.55, M.steel(), 0, bottom + h * 0.55 + h * 0.225, -d * 0.1));
  // capture lip
  o.add(slab(w, 2.5 * IN, d, M.steel(), 0, bottom - 1 * IN, 0));
  // baffle filters, angled
  const n = Math.max(3, Math.floor(w / (20 * IN)));
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + (w / n) * (i + 0.5);
    const f = slab((w / n) - 1.5 * IN, 16 * IN, 1 * IN, M.chrome(), x, bottom + 7 * IN, d * 0.16);
    f.rotation.x = -0.45;
    o.add(f);
  }
  // LED task strip under the canopy — this is what lights the cook line
  o.add(slab(w - 6 * IN, 1 * IN, 3 * IN, M.ledStrip(), 0, bottom - 1.5 * IN, -d * 0.22));
  // duct collar to ceiling
  o.add(box(20 * IN, 24 * IN, 20 * IN, M.steel(), 0, top, -d * 0.12));
  return o;
}

/* ------------------------------------------------------------ refrigeration */

export function reachIn(doors = 1, w = 30 * IN, d = 34 * IN, freezer = false) {
  const o = g(freezer ? 'Reach-In Freezer' : 'Reach-In Refrigerator');
  const H = 78 * IN, W = w * doors;
  o.add(box(W, H - 6 * IN, d, M.steel(), 0, 6 * IN, 0));
  legs(o, W - 4 * IN, d - 4 * IN, 6 * IN);
  for (let i = 0; i < doors; i++) {
    const x = -W / 2 + w / 2 + i * w;
    o.add(slab(w - 1.5 * IN, H - 20 * IN, 1.2 * IN, M.darkSteel(), x, H / 2 + 2 * IN, d / 2 + 0.6 * IN));
    o.add(cyl(0.9 * IN, H - 30 * IN, M.chrome(), x + w / 2 - 3 * IN, H / 2 + 2 * IN, d / 2 + 1.6 * IN, 10));
  }
  // top-mount condenser + readout
  o.add(box(W - 4 * IN, 8 * IN, d - 6 * IN, M.steel(), 0, H, 0));
  o.add(slab(6 * IN, 2 * IN, 0.5 * IN, freezer ? M.readoutCyan() : M.readoutAmber(),
    -W / 2 + 6 * IN, H - 7 * IN, d / 2 + 0.9 * IN));
  return o;
}

/* Walk-in cold storage room, built as an enclosure with a glowing interior. */
export function walkIn(w, d, h = 96 * IN, doorAt = 0) {
  const o = g('Walk-In Cold Storage');
  const t = 4 * IN;
  const P = M.panelWhite();
  // walls (open on +z face except for jambs)
  o.add(slab(t, h, d, P, -w / 2, h / 2, 0));
  o.add(slab(t, h, d, P, w / 2, h / 2, 0));
  o.add(slab(w, h, t, P, 0, h / 2, -d / 2));
  o.add(slab(w, t, d, P, 0, h, 0));
  // front wall with door opening
  const doorW = 42 * IN, dx = doorAt;
  const leftW = (dx - doorW / 2) - (-w / 2);
  const rightW = (w / 2) - (dx + doorW / 2);
  if (leftW > 0) o.add(slab(leftW, h, t, P, -w / 2 + leftW / 2, h / 2, d / 2));
  if (rightW > 0) o.add(slab(rightW, h, t, P, w / 2 - rightW / 2, h / 2, d / 2));
  o.add(slab(doorW, h - 84 * IN, t, P, dx, h - (h - 84 * IN) / 2, d / 2));

  // Without these the box reads as a blank wall. The frame, hinges, latch and
  // temperature readout are what make it legible as a walk-in cooler.
  const fz = d / 2 + t / 2 + 0.4 * IN;
  o.add(slab(3.5 * IN, 88 * IN, 1.6 * IN, M.darkSteel(), dx - doorW / 2 - 1.75 * IN, 44 * IN, fz));
  o.add(slab(3.5 * IN, 88 * IN, 1.6 * IN, M.darkSteel(), dx + doorW / 2 + 1.75 * IN, 44 * IN, fz));
  o.add(slab(doorW + 7 * IN, 3.5 * IN, 1.6 * IN, M.darkSteel(), dx, 86 * IN, fz));
  for (const hy of [14 * IN, 46 * IN, 76 * IN]) {
    o.add(cyl(1.5 * IN, 5 * IN, M.chrome(), dx - doorW / 2 - 1.75 * IN, hy, fz + 1.2 * IN, 10)
      .rotateZ(Math.PI / 2));
  }
  // exterior temperature panel
  o.add(slab(9 * IN, 6 * IN, 1.2 * IN, M.darkSteel(), dx + doorW / 2 + 9 * IN, 58 * IN, fz));
  o.add(slab(6.5 * IN, 2.6 * IN, 0.5 * IN, M.readoutCyan(), dx + doorW / 2 + 9 * IN, 58.5 * IN, fz + 0.8 * IN));

  // door: heavy insulated slab, standing well open so the cold interior reads
  const door = g('door');
  door.add(slab(doorW, 84 * IN, 3.5 * IN, M.panelWhite(), doorW / 2, 42 * IN, 0));
  door.add(slab(doorW - 4 * IN, 80 * IN, 0.6 * IN, M.chrome(), doorW / 2, 42 * IN, -2 * IN));
  // lever latch
  o.add(slab(2.5 * IN, 9 * IN, 2 * IN, M.chrome(), dx + doorW / 2 - 3 * IN, 38 * IN, fz + 1.4 * IN));
  door.add(cyl(1.2 * IN, 13 * IN, M.chrome(), doorW - 5 * IN, 34 * IN, 3.2 * IN, 10));
  door.position.set(dx - doorW / 2, 0, d / 2);
  door.rotation.y = -1.15;
  o.add(door);

  // interior: cold light top and bottom, and enough shelving to look stocked
  o.add(slab(w - 2 * t, 0.5 * IN, d - 2 * t, M.coldGlow(), 0, 0.3 * IN, 0));
  o.add(slab(w - 2 * t, 1 * IN, d - 2 * t, M.coldGlow(), 0, h - 6 * IN, 0));
  o.add(shelving(w - 16 * IN, 22 * IN, 4).translateZ(-d / 2 + 16 * IN));
  const side = shelving(d - 30 * IN, 20 * IN, 4);
  side.rotation.y = Math.PI / 2;
  side.position.set(-w / 2 + 14 * IN, 0, 2 * IN);
  o.add(side);
  return o;
}

/* ------------------------------------------------------- sinks & warewashing */

function bowl(o, w, d, x, y) {
  o.add(box(w, 12 * IN, d, M.steel(), x, y - 12 * IN, 0));
  o.add(slab(w - 2 * IN, 0.4 * IN, d - 2 * IN, M.darkSteel(), x, y - 11.5 * IN, 0));
}

export function compSink(comps = 3, w = 108 * IN, d = 30 * IN) {
  const o = g(`${comps}-Compartment Sink`);
  const H = 36 * IN;
  legs(o, w, d, H - 1.5 * IN);
  o.add(slab(w, 1.5 * IN, d, M.steel(), 0, H - 0.75 * IN, 0));
  o.add(slab(w, 9 * IN, 1 * IN, M.steel(), 0, H + 4.5 * IN, -d / 2 + 0.5 * IN));
  const bw = Math.min(20 * IN, (w - 24 * IN) / comps);
  const pitch = bw + 2 * IN;
  for (let i = 0; i < comps; i++) {
    const x = (i - (comps - 1) / 2) * pitch;
    bowl(o, bw, d - 6 * IN, x, H);
    // gooseneck faucet per bowl
    o.add(cyl(0.7 * IN, 14 * IN, M.chrome(), x, H, -d / 2 + 3 * IN, 10));
    o.add(cyl(0.6 * IN, 7 * IN, M.chrome(), x, H + 13 * IN, -d / 2 + 6 * IN, 10).rotateX(Math.PI / 2));
  }
  // drainboard
  o.add(slab(18 * IN, 0.6 * IN, d - 8 * IN, M.steel(), w / 2 - 11 * IN, H + 1 * IN, 0));
  return o;
}

export const threeCompSink = (w, d) => compSink(3, w, d);

export function handSink() {
  const o = g('Hand Sink');
  const H = 34 * IN, w = 16 * IN, d = 14 * IN;
  o.add(box(w, 9 * IN, d, M.steel(), 0, H - 9 * IN, 0));
  o.add(slab(w - 2 * IN, 0.4 * IN, d - 2 * IN, M.darkSteel(), 0, H - 8.6 * IN, 0));
  o.add(slab(w, 8 * IN, 0.8 * IN, M.steel(), 0, H + 4 * IN, -d / 2 + 0.4 * IN));
  o.add(cyl(0.5 * IN, 8 * IN, M.chrome(), 0, H, -d / 2 + 2 * IN, 10));
  o.add(cyl(0.45 * IN, 5 * IN, M.chrome(), 0, H + 7 * IN, -d / 2 + 4 * IN, 10).rotateX(Math.PI / 2));
  return o;
}

export function warewasher(w = 26 * IN, d = 28 * IN) {
  const o = g('High-Temp Warewasher');
  const H = 76 * IN;
  o.add(box(w, 20 * IN, d, M.steel(), 0, 0, 0));
  o.add(box(w, 22 * IN, d, M.steel(), 0, H - 22 * IN, 0));
  // hood door, raised
  o.add(box(w - 1 * IN, 30 * IN, d - 1 * IN, M.steel(), 0, 24 * IN, 0));
  o.add(slab(w - 6 * IN, 20 * IN, 0.6 * IN, M.darkSteel(), 0, 38 * IN, d / 2 + 0.5 * IN));
  o.add(cyl(1 * IN, w - 8 * IN, M.chrome(), 0, 52 * IN, d / 2 + 1.5 * IN, 10).rotateZ(Math.PI / 2));
  o.add(slab(7 * IN, 3 * IN, 0.5 * IN, M.readoutCyan(), 0, 62 * IN, d / 2 + 0.6 * IN));
  // steam vent
  o.add(cyl(3 * IN, 10 * IN, M.steel(), 0, H, -d / 4, 12));
  return o;
}

/* -------------------------------------------------------- storage & shelving */

export function shelving(w, d = 24 * IN, levels = 4, h = 72 * IN) {
  const o = g('Shelving');
  const post = 1 * IN;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    o.add(cyl(post / 2, h, M.chrome(), sx * (w / 2 - post), 0, sz * (d / 2 - post), 8));
  }
  for (let i = 0; i < levels; i++) {
    const y = 6 * IN + i * ((h - 10 * IN) / (levels - 1));
    o.add(slab(w - post, 0.45 * IN, d - post, M.chrome(), 0, y, 0));
    // louvered ribs
    const ribs = Math.max(2, Math.floor(w / (7 * IN)));
    for (let r = 0; r < ribs; r++) {
      o.add(slab(0.28 * IN, 0.7 * IN, d - post, M.chrome(),
        -w / 2 + (w / ribs) * (r + 0.5), y + 0.6 * IN, 0));
    }
  }
  return o;
}

export function dryCabinet(w = 48 * IN, d = 24 * IN) {
  const o = g('Dry Cabinet');
  const H = 78 * IN;
  o.add(box(w, H - 6 * IN, d, M.steel(), 0, 6 * IN, 0));
  legs(o, w - 4 * IN, d - 4 * IN, 6 * IN);
  for (const s of [-1, 1]) {
    o.add(slab(w / 2 - 1.5 * IN, H - 18 * IN, 1 * IN, M.darkSteel(), s * w / 4, H / 2 + 2 * IN, d / 2 + 0.5 * IN));
    o.add(cyl(0.8 * IN, 20 * IN, M.chrome(), s * (w / 2 - 4 * IN), H / 2 + 2 * IN, d / 2 + 1.4 * IN, 10));
  }
  return o;
}

export function ingredientBins(count = 4, w = 14 * IN) {
  const o = g('Ingredient Bins');
  for (let i = 0; i < count; i++) {
    const x = -((count - 1) * w) / 2 + i * w;
    const b = slab(w - 1.5 * IN, 16 * IN, 22 * IN, M.binPlastic(), x, 8 * IN, 0);
    b.rotation.x = -0.14;
    o.add(b);
    o.add(slab(w - 3 * IN, 1 * IN, 8 * IN, M.chrome(), x, 16 * IN, -7 * IN));
  }
  return o;
}

/* --------------------------------------------------------------- chef island */

export function chefIsland(w, d = 48 * IN) {
  const o = g("Chef's Island");
  const H = 36 * IN;
  o.add(cabinetBase(w, d, H));
  // poly cutting boards inset along the working face
  o.add(slab(w * 0.34, 0.6 * IN, 12 * IN, M.poly(), -w * 0.26, H + 0.9 * IN, d / 2 - 8 * IN));
  o.add(slab(w * 0.28, 0.6 * IN, 12 * IN, M.poly(), w * 0.28, H + 0.9 * IN, d / 2 - 8 * IN));
  // drop-in cold rails: recessed pans, chilled
  for (const cx of [-w * 0.30, w * 0.24]) {
    o.add(slab(w * 0.22, 3 * IN, 16 * IN, M.darkSteel(), cx, H - 0.5 * IN, -d / 4));
    for (let i = 0; i < 4; i++) {
      o.add(slab(w * 0.048, 1 * IN, 6.5 * IN, M.chrome(),
        cx - w * 0.082 + i * w * 0.055, H + 0.9 * IN, -d / 4 - 3.4 * IN));
      o.add(slab(w * 0.048, 1 * IN, 6.5 * IN, M.chrome(),
        cx - w * 0.082 + i * w * 0.055, H + 0.9 * IN, -d / 4 + 3.4 * IN));
    }
    o.add(slab(w * 0.22, 0.4 * IN, 16 * IN, M.coldGlow(), cx, H - 2.2 * IN, -d / 4));
  }
  // hand sink dropped into the centre
  const hs = handSink(); hs.position.set(0, 0, -d / 4); o.add(hs);
  // double over-shelf on posts — the pass
  const sh = 20 * IN;
  for (const sx of [-w / 2 + 4 * IN, 0, w / 2 - 4 * IN]) {
    o.add(cyl(0.9 * IN, sh + 14 * IN, M.chrome(), sx, H + 1.5 * IN, 0, 10));
  }
  o.add(slab(w, 1 * IN, 16 * IN, M.steel(), 0, H + sh, 0));
  o.add(slab(w, 1 * IN, 16 * IN, M.steel(), 0, H + sh + 13 * IN, 0));
  // heat lamps on the pass
  for (let i = 0; i < 4; i++) {
    o.add(slab(w * 0.14, 1.2 * IN, 2.5 * IN, M.readoutAmber(),
      -w * 0.34 + i * w * 0.226, H + sh - 1.4 * IN, 0));
  }
  return o;
}

/* ----------------------------------------------------------- custom stainless */

export function stainlessRun(w, d = 30 * IN) {
  const o = g('Custom Stainless Run');
  const H = 36 * IN;
  o.add(cabinetBase(w, d, H));
  o.add(slab(w, 9 * IN, 1 * IN, M.steel(), 0, H + 4.5 * IN, -d / 2 + 0.5 * IN));
  // convenience outlets routed through the counter (called out on K101)
  for (let i = 0; i < 3; i++) {
    o.add(slab(3.5 * IN, 4 * IN, 0.6 * IN, M.blackMatte(),
      -w / 3 + i * (w / 3), H + 4.5 * IN, -d / 2 + 0.1 * IN));
  }
  // double over-shelf
  const sh = 19 * IN;
  for (const sx of [-w / 2 + 5 * IN, w / 2 - 5 * IN]) {
    o.add(cyl(0.9 * IN, sh + 13 * IN, M.chrome(), sx, H + 1.5 * IN, -d / 2 + 6 * IN, 10));
  }
  o.add(slab(w, 1 * IN, 14 * IN, M.steel(), 0, H + sh, -d / 2 + 6 * IN));
  o.add(slab(w, 1 * IN, 14 * IN, M.steel(), 0, H + sh + 12 * IN, -d / 2 + 6 * IN));
  return o;
}

/* Double-acting doors to the event center — the connection the whole project
   is built around, so they get real leaves, ports and kick plates. */
export function swingDoors(w, h = 7.0, open = 0.5) {
  const o = g('Double Swing Doors');
  const leaf = w / 2;
  for (const s of [-1, 1]) {
    const d = g('leaf');
    // each leaf hinges at its jamb and reaches back toward the centre of the opening
    const off = -(s * leaf) / 2;
    d.add(slab(leaf, h, 1.8 * IN, M.steel(), off, h / 2, 0));
    // round vision port
    d.add(cyl(5.6 * IN, 1.4 * IN, M.chrome(), off, h * 0.66, 0, 22).rotateX(Math.PI / 2));
    d.add(cyl(4.6 * IN, 2.2 * IN, M.portGlow(), off, h * 0.66, 0, 22).rotateX(Math.PI / 2));
    // scuff plate along the bottom, where the carts hit
    d.add(slab(leaf - 1.5 * IN, 13 * IN, 0.5 * IN, M.chrome(), off, 9 * IN, 1.3 * IN));
    d.position.x = (s * w) / 2;
    d.rotation.y = s * open; // ajar into the room, not back through the wall
    o.add(d);
  }
  return o;
}

/* PROPOSED (not in the permit set): service pass-through from the kitchen to
   the cafe front of house, on the wall opposite the cook line. Marked with a
   teal reveal so it never gets mistaken for permitted work. */
export function passThrough(w = 6.0, sill = 40 * IN, head = 78 * IN) {
  const o = g('Pass-Through to Cafe');
  const h = head - sill, mid = (sill + head) / 2;
  // stainless surround
  o.add(slab(w + 8 * IN, 4 * IN, 7 * IN, M.steel(), 0, head + 2 * IN, 0));
  o.add(slab(w + 8 * IN, 5 * IN, 7 * IN, M.steel(), 0, sill - 2.5 * IN, 0));
  for (const s of [-1, 1]) {
    o.add(slab(4 * IN, h + 9 * IN, 7 * IN, M.steel(), (s * (w + 4 * IN)) / 2, mid, 0));
  }
  // the dining room beyond
  o.add(slab(w, h, 0.5 * IN, M.fohGlow(), 0, mid, -0.05));
  // plating ledge on the kitchen side, where tickets land
  o.add(slab(w, 1.6 * IN, 15 * IN, M.steel(), 0, sill, 0.42));
  for (const sx of [-w / 2 + 4 * IN, 0, w / 2 - 4 * IN]) {
    o.add(cyl(0.8 * IN, 9 * IN, M.chrome(), sx, sill, 0.72, 10));
  }
  o.add(slab(w, 1 * IN, 11 * IN, M.steel(), 0, sill + 10 * IN, 0.7));
  // heat lamps over the ledge
  for (let i = 0; i < 3; i++) {
    o.add(slab(w * 0.22, 1.1 * IN, 2.2 * IN, M.readoutAmber(), -w * 0.3 + i * w * 0.3, sill + 9 * IN, 0.7));
  }
  // "proposed" marker
  o.add(slab(w + 12 * IN, 1.2 * IN, 1.2 * IN, M.teal(), 0, head + 5.5 * IN, 0.06));
  return o;
}

/* ------------------------------------------------------------------ dressing */

export function stockpot(r = 6 * IN, h = 9 * IN) {
  const o = g('pot');
  o.add(cyl(r, h, M.chrome(), 0, 0, 0, 18));
  o.add(cyl(r * 1.02, 0.8 * IN, M.steel(), 0, h, 0, 18));
  for (const s of [-1, 1]) o.add(slab(1.6 * IN, 0.7 * IN, 0.7 * IN, M.chrome(), s * (r + 0.7 * IN), h - 2 * IN, 0));
  return o;
}

export function sheetPan(w = 18 * IN, d = 13 * IN) {
  const o = g('pan');
  o.add(slab(w, 0.7 * IN, d, M.chrome(), 0, 0, 0));
  return o;
}

export function potRack(w, d = 24 * IN) {
  const o = g('Pot & Pan Rack');
  o.add(shelving(w, d, 4));
  const pots = [5, 6, 7, 5.5];
  pots.forEach((r, i) => {
    const p = stockpot(r * IN, (r + 3) * IN);
    p.position.set(-w / 2 + 9 * IN + i * (w - 16 * IN) / 3, 6 * IN + 2 * ((72 - 10) / 3) * IN, 0);
    o.add(p);
  });
  return o;
}

export const UNIT = IN;
