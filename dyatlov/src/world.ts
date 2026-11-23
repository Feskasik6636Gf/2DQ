import * as THREE from 'three';

// ---------- noise ----------
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x: number, y: number, o = 4) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < o; i++) { s += a * vnoise(x * f, y * f); f *= 2; a *= 0.5; }
  return s;
}
const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Ground height. Camp at origin, forest downhill (-z), mountains around/behind.
export function G(x: number, z: number): number {
  const base = 5 * fbm(x * 0.006 + 3, z * 0.006 + 7) + 1.2 * fbm(x * 0.04, z * 0.04);
  const slope = z * 0.1;
  const rise = Math.max(0, Math.abs(x) * 0.55 + Math.max(0, z) * 0.9 - 170);
  const ridge = 1 - Math.abs(fbm(x * 0.004 + 9, z * 0.004 + 2) * 2 - 1);
  const mnt = rise * (0.3 + 0.9 * ridge);
  const flat = 1 - sstep(8, 40, Math.hypot(x, z)); // keep camp calm
  return (base + slope + mnt) * (1 - 0.85 * flat) + 0.0;
}

export const TENT = new THREE.Vector3(0, 0, 0);
export const CEDAR = new THREE.Vector3(34, 0, -330);
export const INT = new THREE.Vector3(1000, 0, 0);   // tent interior
export const DESK = new THREE.Vector3(-1000, 0, 0); // desk with papers

export interface World {
  scene: THREE.Scene;
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  amb: THREE.AmbientLight;
  sky: THREE.Mesh;
  skyMat: THREE.ShaderMaterial;
  snow: THREE.Points;
  snowMat: THREE.ShaderMaterial;
  tentMesh: THREE.Group;
  slit: THREE.Mesh;
  slitI: THREE.Mesh;
  fire: THREE.Group;
  fireLight: THREE.PointLight;
  lantern: THREE.PointLight;
  lanternMesh: THREE.Mesh;
  figs: Figure[];
  chunks: THREE.InstancedMesh;
  intGroup: THREE.Group;
  intItems: { boots: THREE.Group; jacket: THREE.Group; food: THREE.Group; knife: THREE.Group };
  deskGroup: THREE.Group;
  stamp: THREE.Mesh;
  searchLights: THREE.Group;
}

export interface Figure {
  root: THREE.Group;
  body: THREE.Group;
  head: THREE.Group;
  armL: THREE.Group; armR: THREE.Group; legL: THREE.Group; legR: THREE.Group;
  eyes: THREE.Group;
  bootL: THREE.Mesh; bootR: THREE.Mesh; footL: THREE.Mesh; footR: THREE.Mesh;
}

const OUT = new THREE.MeshBasicMaterial({ color: 0x20140a, side: THREE.BackSide });
function outlined(geo: THREE.BufferGeometry, mat: THREE.Material, k = 1.07): THREE.Group {
  const g = new THREE.Group();
  const m = new THREE.Mesh(geo, mat);
  const o = new THREE.Mesh(geo, OUT);
  o.scale.setScalar(k);
  g.add(m, o);
  return g;
}
const stdMat = (c: number, extra: any = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0, flatShading: false, ...extra });

const JACKETS = [0xe0562a, 0x2f7fd0, 0xe8c230, 0x3aa56a, 0xc23b6e, 0x7a4fc4, 0xe07b2a, 0x35b8c8, 0xd9d9d9];

function makeFigure(i: number): Figure {
  const root = new THREE.Group();
  const jacket = stdMat(JACKETS[i % 9]);
  const pants = stdMat(0x2a3050);
  const skin = stdMat(0xf4dcc4, { roughness: 0.6 });
  const dark = stdMat(0x15110c);
  const body = new THREE.Group();
  body.position.y = 0.95;
  root.add(body);
  const torso = outlined(new THREE.CapsuleGeometry(0.24, 0.5, 6, 12), jacket);
  torso.position.y = 0.38;
  body.add(torso);
  const head = new THREE.Group();
  head.position.y = 1.0;
  body.add(head);
  const skull = outlined(new THREE.SphereGeometry(0.3, 20, 16), skin, 1.08);
  skull.scale.set(1, 1.05, 1);
  head.add(skull);
  const hat = new THREE.Mesh(new THREE.SphereGeometry(0.315, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), jacket);
  hat.position.y = 0.02;
  head.add(hat);
  const eyes = new THREE.Group();
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), dark);
    e.position.set(s * 0.1, -0.02, 0.275);
    e.scale.set(1, 1.3, 0.6);
    eyes.add(e);
  }
  head.add(eyes);
  const mkArm = (s: number) => {
    const g = new THREE.Group();
    g.position.set(s * 0.32, 0.62, 0);
    const a = outlined(new THREE.CylinderGeometry(0.075, 0.075, 0.62, 8), jacket, 1.12);
    a.position.y = -0.3;
    g.add(a);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), skin);
    hand.position.y = -0.64;
    g.add(hand);
    body.add(g);
    return g;
  };
  const mkLeg = (s: number) => {
    const g = new THREE.Group();
    g.position.set(s * 0.13, 0.05, 0);
    const l = outlined(new THREE.CylinderGeometry(0.095, 0.085, 0.95, 8), pants, 1.1);
    l.position.y = -0.45;
    g.add(l);
    body.add(g);
    return g;
  };
  const armL = mkArm(-1), armR = mkArm(1), legL = mkLeg(-1), legR = mkLeg(1);
  const bootGeo = new THREE.BoxGeometry(0.17, 0.12, 0.32);
  const footGeo = new THREE.SphereGeometry(0.095, 8, 8);
  const bootL = new THREE.Mesh(bootGeo, dark), bootR = new THREE.Mesh(bootGeo, dark);
  const footL = new THREE.Mesh(footGeo, skin), footR = new THREE.Mesh(footGeo, skin);
  footL.scale.set(1, 0.8, 1.6); footR.scale.set(1, 0.8, 1.6);
  for (const [b, f, leg] of [[bootL, footL, legL], [bootR, footR, legR]] as any) {
    b.position.set(0, -0.93, 0.06); f.position.set(0, -0.93, 0.06); f.visible = false;
    leg.add(b, f);
  }
  return { root, body, head, armL, armR, legL, legR, eyes, bootL, bootR, footL, footR };
}

// tent prism, local: length along z (depth), door at +z end
function tentGeometry(w: number, h: number, d: number) {
  const g = new THREE.BufferGeometry();
  const hw = w / 2, hd = d / 2;
  const v = [
    -hw, 0, -hd, hw, 0, -hd, 0, h, -hd,
    -hw, 0, hd, hw, 0, hd, 0, h, hd,
  ];
  const idx = [
    0, 2, 1, 3, 4, 5, // ends
    0, 3, 5, 0, 5, 2, // left slope
    1, 2, 5, 1, 5, 4, // right slope
  ];
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function buildWorld(W: number, H: number): World & { renderer: THREE.WebGLRenderer; camera: THREE.PerspectiveCamera } {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x1a2748, 60, 700);
  scene.background = new THREE.Color(0x0b1430);
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 5000);

  const hemi = new THREE.HemisphereLight(0x7f9be0, 0xdfe8ff, 0.9);
  const amb = new THREE.AmbientLight(0xffffff, 0.15);
  const sun = new THREE.DirectionalLight(0xbcd2ff, 2.4);
  sun.position.set(-120, 200, 80);
  scene.add(hemi, amb, sun);

  // sky dome with stars
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x050a1f) }, mid: { value: new THREE.Color(0x1a2f66) }, hor: { value: new THREE.Color(0x4a6cb0) }, stars: { value: 1 } },
    vertexShader: 'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} ',
    fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 hor; uniform float stars; varying vec3 vP;
      float h(vec3 p){ return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453); }
      void main(){ vec3 d=normalize(vP); float y=clamp(d.y,0.0,1.0);
        vec3 c=mix(hor,mid,smoothstep(0.0,0.25,y)); c=mix(c,top,smoothstep(0.2,0.85,y));
        vec3 q=floor(d*220.0); float s=step(0.9972,h(q))*stars*smoothstep(0.05,0.3,y);
        c+=vec3(s);
        float m=smoothstep(0.9985,0.9995,dot(d,normalize(vec3(-0.5,0.5,0.7)))); c=mix(c,vec3(1.0,0.98,0.9),m*stars);
        gl_FragColor=vec4(c,1.0);} `,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(3000, 32, 16), skyMat);
  scene.add(sky);

  // terrain near + far
  const mkTerrain = (size: number, seg: number, cz: number, drop: number, flat: boolean) => {
    const geo = new THREE.PlaneGeometry(size, size, seg, seg);
    geo.rotateX(-Math.PI / 2);
    const p = geo.attributes.position as THREE.BufferAttribute;
    const col = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i) + cz;
      const y = G(x, z);
      p.setXYZ(i, x, y - drop, z - cz);
      const n = fbm(x * 0.05, z * 0.05);
      const rock = sstep(55, 140, y) * (0.5 + 0.5 * fbm(x * 0.02 + 5, z * 0.02));
      const c = new THREE.Color().setRGB(0.74 + 0.12 * n, 0.82 + 0.1 * n, 0.98);
      c.lerp(new THREE.Color(0x5a6070), rock * 0.75);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: flat }));
    m.position.z = cz;
    return m;
  };
  scene.add(mkTerrain(560, 240, -120, 0, false));
  scene.add(mkTerrain(3600, 260, 300, 0.6, true));

  // pines (instanced)
  const pineGeo = new THREE.ConeGeometry(2.2, 7, 7);
  pineGeo.translate(0, 4.5, 0);
  const pine = new THREE.InstancedMesh(pineGeo, stdMat(0x1f4a3a), 700);
  const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.35, 0.45, 2, 6).translate(0, 1, 0), stdMat(0x4a3220), 700);
  const dummy = new THREE.Object3D();
  let n = 0;
  const put = (x: number, z: number, s: number) => {
    if (n >= 700) return;
    dummy.position.set(x, G(x, z), z);
    dummy.scale.setScalar(s);
    dummy.rotation.y = hash(x, z) * 6;
    dummy.updateMatrix();
    pine.setMatrixAt(n, dummy.matrix);
    trunk.setMatrixAt(n, dummy.matrix);
    n++;
  };
  for (let k = 0; k < 420; k++) {
    const x = (hash(k, 1) - 0.5) * 360 + CEDAR.x, z = CEDAR.z - 5 - hash(k, 2) * 160;
    put(x, z, 0.8 + hash(k, 3) * 1.1);
  }
  for (let k = 0; k < 160; k++) { // scattered on the slope
    const x = (hash(k, 7) - 0.5) * 420, z = -60 - hash(k, 8) * 240;
    if (Math.hypot(x - 0, z + 20) < 25) continue;
    if (Math.abs(x - CEDAR.x) < 60 && z < CEDAR.z + 30) continue;
    put(x, z, 0.7 + hash(k, 9) * 0.9);
  }
  pine.count = n; trunk.count = n;
  pine.instanceMatrix.needsUpdate = true; trunk.instanceMatrix.needsUpdate = true;
  scene.add(pine, trunk);

  // snow dusting on pines not needed; cedar (big lone tree with fire)
  const cedar = new THREE.Group();
  cedar.position.set(CEDAR.x, G(CEDAR.x, CEDAR.z), CEDAR.z);
  cedar.add(outlined(new THREE.CylinderGeometry(0.7, 1.1, 9, 8).translate(0, 4.5, 0), stdMat(0x5a3d26), 1.05));
  for (let k = 0; k < 4; k++) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(4.2 - k * 0.8, 5, 8), stdMat(0x1c4a38));
    c.position.y = 6 + k * 3.2; cedar.add(c);
  }
  scene.add(cedar);
  const fire = new THREE.Group();
  fire.position.set(CEDAR.x + 2.2, G(CEDAR.x + 2.2, CEDAR.z + 3) + 0.1, CEDAR.z + 3);
  const fmat = new THREE.MeshBasicMaterial({ color: 0xffa020, fog: false });
  for (let k = 0; k < 5; k++) {
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.35 - k * 0.04, 1.2 + k * 0.1, 6), k % 2 ? fmat : new THREE.MeshBasicMaterial({ color: 0xffe060, fog: false }));
    f.position.set((k - 2) * 0.18, 0.6, (k % 2) * 0.15);
    fire.add(f);
  }
  const fireLight = new THREE.PointLight(0xff8a2a, 0, 60, 1.6);
  fireLight.position.y = 1.2;
  fire.add(fireLight);
  fire.visible = false;
  scene.add(fire);

  // tent at camp
  const tentMesh = new THREE.Group();
  const tg = tentGeometry(3.4, 2.3, 5.2);
  const tent = outlined(tg, new THREE.MeshStandardMaterial({ color: 0xf08a34, roughness: 0.9, side: THREE.DoubleSide, emissive: 0x6a2a08, emissiveIntensity: 0.35 }), 1.0);
  // outline: tweak to be bigger
  (tent.children[1] as THREE.Mesh).scale.set(1.04, 1.04, 1.02);
  tentMesh.add(tent);
  tentMesh.position.set(0, G(0, 0), 0);
  scene.add(tentMesh);
  // slit on right slope (lies on the surface, runs along tent length)
  const slitGeo = new THREE.PlaneGeometry(1, 2.6);
  slitGeo.rotateX(-Math.PI / 2);
  const slit = new THREE.Mesh(slitGeo, new THREE.MeshBasicMaterial({ color: 0x07050a, side: THREE.DoubleSide }));
  const th = Math.atan2(2.3, 1.7);
  slit.rotation.z = -th;
  slit.position.set(0.85 + Math.sin(th) * 0.03, 1.15 + Math.cos(th) * 0.03, 0.3);
  slit.scale.set(0.01, 1, 1);
  tentMesh.add(slit);
  // snow ground ring around tent: skis and gear
  for (let k = 0; k < 9; k++) {
    const sk = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 1.9), stdMat(0x8a5a2a));
    sk.position.set(-3 + (k % 3) * 0.5 + k * 0.1, 0.5, 3.6);
    sk.rotation.set(-1.0, 0.4 + k * 0.05, 0.1);
    sk.position.y = 0.9 + G(0, 3.5);
    sk.position.x += k * 0.15 - 2; sk.position.z = 3.4 + hash(k, 3) * 0.6;
    scene.add(sk);
  }

  // figures
  const figs: Figure[] = [];
  for (let i = 0; i < 9; i++) { const f = makeFigure(i); scene.add(f.root); figs.push(f); }

  // falling snow
  const SN = 4500;
  const sg = new THREE.BufferGeometry();
  const sp = new Float32Array(SN * 3);
  for (let i = 0; i < SN; i++) { sp[i * 3] = Math.random(); sp[i * 3 + 1] = Math.random(); sp[i * 3 + 2] = Math.random(); }
  // deterministic pseudo-random instead of Math.random
  for (let i = 0; i < SN * 3; i++) sp[i] = hash(i * 0.37, i * 0.91);
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const snowMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, fog: false,
    uniforms: { uT: { value: 0 }, uCam: { value: new THREE.Vector3() }, uWind: { value: 1 }, uFall: { value: 3 }, uSize: { value: 1 }, uAlpha: { value: 0.8 }, uBox: { value: 60 } },
    vertexShader: `uniform float uT; uniform vec3 uCam; uniform float uWind; uniform float uFall; uniform float uSize; uniform float uBox;
      varying float vA;
      void main(){ vec3 b=position; float B=uBox;
        vec3 p=b*B*2.0; p.x-=uWind*uT*9.0; p.y-=uFall*uT; p.z-=uWind*0.3*uT*9.0;
        p=mod(p-uCam+vec3(B), vec3(B*2.0))-vec3(B)+uCam;
        p.x+=sin(uT*1.3+b.y*40.0)*0.6;
        vec4 mv=viewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv;
        gl_PointSize=uSize*(260.0/(-mv.z))*(0.5+b.x); vA=smoothstep(B,B*0.6,length(p-uCam)); }`,
    fragmentShader: `uniform float uAlpha; varying float vA; void main(){ vec2 c=gl_PointCoord-0.5; float d=length(c); if(d>0.5) discard; gl_FragColor=vec4(1.0,1.0,1.0,uAlpha*vA*smoothstep(0.5,0.2,d)); }`,
  });
  const snow = new THREE.Points(sg, snowMat);
  snow.frustumCulled = false;
  scene.add(snow);

  // avalanche chunks
  const chunks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1.4, 0), stdMat(0xf2f6ff, { flatShading: true }), 420);
  chunks.frustumCulled = false;
  chunks.visible = false;
  scene.add(chunks);

  // search lights (rescuers)
  const searchLights = new THREE.Group();
  for (let k = 0; k < 6; k++) {
    const l = new THREE.PointLight(0xfff2c0, 40, 40, 1.6);
    l.position.set(0, 0, 0); searchLights.add(l);
  }
  searchLights.visible = false;
  scene.add(searchLights);

  // ---------- interior ----------
  const intGroup = new THREE.Group();
  intGroup.position.copy(INT);
  const intMat = new THREE.MeshStandardMaterial({ color: 0xe8802e, roughness: 0.95, side: THREE.BackSide, emissive: 0x7a3a10, emissiveIntensity: 0.55 });
  const intTent = new THREE.Mesh(tentGeometry(5.6, 3.4, 7.6), intMat);
  intGroup.add(intTent);
  const slitIGeo = new THREE.PlaneGeometry(1, 3.2);
  slitIGeo.rotateX(-Math.PI / 2);
  const slitI = new THREE.Mesh(slitIGeo, new THREE.MeshBasicMaterial({ color: 0xcfe0ff, side: THREE.DoubleSide, fog: false }));
  const thI = Math.atan2(3.4, 2.8);
  slitI.rotation.z = -thI;
  slitI.position.set(1.4 - Math.sin(thI) * 0.03, 1.7 - Math.cos(thI) * 0.03, 0.4);
  slitI.scale.set(0.01, 1, 1);
  intGroup.add(slitI);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 7.6), stdMat(0x3a5a78));
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.02;
  intGroup.add(floor);
  // sleeping bags
  const bagMat = stdMat(0x2f6a9a);
  for (let k = 0; k < 9; k++) {
    const bag = outlined(new THREE.CapsuleGeometry(0.34, 1.7, 6, 12), stdMat([0x2f6a9a, 0x8a3a3a, 0x3a7a4a, 0x7a5a2a][k % 4]), 1.05);
    bag.rotation.x = Math.PI / 2;
    bag.position.set(-2.1 + (k % 3) * 0.0 + (k % 9) * 0.5, 0.4, -0.2);
    bag.position.x = -2.1 + (k) * 0.52;
    bag.position.z = 0.6;
    intGroup.add(bag);
  }
  const lanternMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffd890, fog: false }));
  lanternMesh.position.set(0, 2.2, 0);
  const lantern = new THREE.PointLight(0xffc070, 18, 14, 1.4);
  lantern.position.set(0, 2.1, 0);
  intGroup.add(lanternMesh, lantern);
  const intAmb = new THREE.AmbientLight(0xffd8b0, 0.0);
  intGroup.add(intAmb);
  // items
  const boots = new THREE.Group();
  for (let k = 0; k < 6; k++) {
    const b = outlined(new THREE.BoxGeometry(0.28, 0.3, 0.62), stdMat(0x2a1a10), 1.08);
    b.position.set(-1.6 + k * 0.5, 0.18, 2.6 + (k % 2) * 0.3); b.rotation.y = hash(k, 5) * 1.5;
    boots.add(b);
  }
  const jackets = new THREE.Group();
  for (let k = 0; k < 5; k++) {
    const j = outlined(new THREE.BoxGeometry(0.8, 0.14, 0.9), stdMat(JACKETS[k]), 1.07);
    j.position.set(-1.7 + k * 0.85, 0.12, -2.4); j.rotation.y = hash(k, 8) * 1.6;
    jackets.add(j);
  }
  const food = new THREE.Group();
  for (let k = 0; k < 7; k++) {
    const c = outlined(new THREE.CylinderGeometry(0.17, 0.17, 0.3, 14), stdMat(0xd4d8dc, { metalness: 0.5, roughness: 0.4 }), 1.1);
    c.position.set(-1.0 + k * 0.4, 0.2, -3.0 + (k % 2) * 0.3);
    food.add(c);
  }
  const knife = new THREE.Group();
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.7), new THREE.MeshStandardMaterial({ color: 0xdfe6ef, metalness: 0.9, roughness: 0.25 }));
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.32), stdMat(0x3a2a1a));
  handle.position.z = -0.5;
  knife.add(blade, handle); knife.position.set(1.4, 0.3, 2.0);
  intGroup.add(boots, jackets, food, knife);
  intGroup.visible = false;
  scene.add(intGroup);

  // ---------- desk ----------
  const deskGroup = new THREE.Group();
  deskGroup.position.copy(DESK);
  const table = outlined(new THREE.BoxGeometry(6, 0.3, 4), stdMat(0x6b4a2a), 1.03);
  table.position.y = 1.0;
  deskGroup.add(table);
  const floorD = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), stdMat(0x1c2230));
  floorD.rotation.x = -Math.PI / 2;
  deskGroup.add(floorD);
  const wallD = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), stdMat(0x232c40));
  wallD.position.set(0, 15, -8);
  deskGroup.add(wallD);
  const lampD = new THREE.SpotLight(0xffe2b0, 220, 30, 0.8, 0.6, 1.2);
  lampD.position.set(1.5, 6, 2);
  lampD.target.position.set(0, 1, 0);
  deskGroup.add(lampD, lampD.target);
  const stamp = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
  stamp.rotation.x = -Math.PI / 2; stamp.position.set(0.6, 1.2, 0.4);
  deskGroup.add(stamp);
  deskGroup.visible = false;
  scene.add(deskGroup);

  return {
    renderer, camera, scene, sun, hemi, amb, sky, skyMat, snow, snowMat, tentMesh, slit, slitI, fire, fireLight, lantern, lanternMesh,
    figs, chunks, intGroup, intItems: { boots, jacket: jackets, food, knife }, deskGroup, stamp, searchLights,
  } as any;
}

export function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
