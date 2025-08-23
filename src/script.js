import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
//import css
import "./style.css";
// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// add stuff here

// TODO
// 1. Orbit für jeden Planeten erstellen
// 2. jeder Orbit von einem Planeten bekommt den nächtskleineren Planeten als child
// 3. Wenn kein kleinerer Planet existiert -> return
//Sonne – absolut riesig, fast 10× größer als Jupiter, extrem dominant.
//Milchstraße – eigentlich riesig im Vergleich zu allem, aber in deinem Modell nur als Hintergrund-Sphere, also visuell nicht direkt vergleichbar.
//Mars – kleiner als Erde, etwa halb so groß.
//Erde – etwas größer als Mars.
//Venus – fast Erde-Größe, minimal kleiner.
//Merkur – sehr klein, etwa ein Drittel der Erde.
//Mond – kleiner als Merkur, ca. ein Viertel der Erde.
/*
Reihenfolge: 
Merkur
Venus
Erde (+ Mond als Begleiter der Erde)
Mars

Milchstraße
   
 */

//Funktion für Orbit erstellung

const createOrbit = () => {
  const geometry = new THREE.BoxGeometry(0, 0, 0);
  const material = new THREE.MeshBasicMaterial();
  return new THREE.Mesh(geometry, material);
};

// Licht initialisieren
const pointLight = new THREE.PointLight(0xffffff, 450);
scene.add(pointLight);

// Texture Loader initialisieren
const textureLoader = new THREE.TextureLoader();

//Sonne initialisieren
const sphereGeometry = new THREE.SphereGeometry();
const sunMateiral = new THREE.MeshBasicMaterial({
  color: 0xfff700,
});

sunMateiral.map = textureLoader.load("/textures/2k_sun.jpg");

const sun = new THREE.Mesh(sphereGeometry, sunMateiral);
sun.name = "sonne";

//Sonne und Zenterpunkt der Szene hinzufügen
scene.add(sun);

//Sonne Größe Setzen
sun.scale.setScalar(5);

//Merkur initialisieren
const mercuryMaterial = new THREE.MeshStandardMaterial();
mercuryMaterial.map = textureLoader.load("/textures/2k_mercury.jpg");
const mercury = new THREE.Mesh(sphereGeometry, mercuryMaterial);
const mercurySunOrbit = createOrbit();
scene.add(mercurySunOrbit);
mercurySunOrbit.add(mercury);
mercury.name = "mercury";
mercury.position.x = sun.position.x - 15;
mercury.scale.setScalar(1.2);

//Erde auf Sonnenzenterpunkt erstellen
const earthMaterial = new THREE.MeshStandardMaterial();
earthMaterial.map = textureLoader.load("/textures/2k_earth_daymap.jpg");
const earth = new THREE.Mesh(sphereGeometry, earthMaterial);
earth.name = "earth";

const venusMaterial = new THREE.MeshStandardMaterial();
venusMaterial.map = textureLoader.load("textures/2k_venus_surface.jpg");
const venus = new THREE.Mesh(sphereGeometry, venusMaterial);
const venusSunOrbit = createOrbit();
scene.add(venusSunOrbit);
venusSunOrbit.add(venus);
venus.position.x = mercury.position.x - 10;

venus.scale.setScalar(1.48);
venus.name = "venus";

const earthSunOrbit = createOrbit();
//earthSunOrbit.add(new THREE.AxesHelper(10));
scene.add(earthSunOrbit);
earthSunOrbit.add(earth);
earth.position.x = venus.position.x - 7.5;
earth.scale.setScalar(1.5);

const moonMaterial = new THREE.MeshStandardMaterial();
moonMaterial.map = textureLoader.load("textures/2k_moon.jpg");

const moon = new THREE.Mesh(sphereGeometry, moonMaterial);
const moonEarthOrbit = createOrbit();
earthSunOrbit.add(moonEarthOrbit);
moonEarthOrbit.position.copy(earth.position);
moon.scale.setScalar(1);
moon.position.copy(earth.position);
moon.position.x = -3.5;
moonEarthOrbit.add(moon);

moon.name = "moon";

const marsMaterial = new THREE.MeshStandardMaterial();
marsMaterial.map = textureLoader.load("/textures/2k_mars.jpg");
const mars = new THREE.Mesh(sphereGeometry, marsMaterial);
const marsSunOrbit = createOrbit();
scene.add(marsSunOrbit);
marsSunOrbit.add(mars);
mars.scale.setScalar(1.27);
mars.position.x = earth.position.x - 2.5 - 5;

scene.background = textureLoader.load("/textures/8k_stars_milky_way.jpg");

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
pointLight.castShadow = true;

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20;

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Schatten
earth.castShadow = true;
earth.receiveShadow = true;
moon.castShadow = true;
moon.receiveShadow = true;
mercury.castShadow = true;
mercury.receiveShadow = true;
venus.castShadow = true;
venus.receiveShadow = true;
mars.castShadow = true;
venus.castShadow = true;

// render loop
const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};
const animatePlanets = () => {
  window.requestAnimationFrame(animatePlanets);
  mercurySunOrbit.rotation.y += 0.001;
  venusSunOrbit.rotation.y += 0.000392;
  earthSunOrbit.rotation.y += 0.000241;
  marsSunOrbit.rotation.y += 0.000128;
  moonEarthOrbit.rotation.y += 0.00328;

  earth.rotation.y += 0.003;
  mars.rotation.y += 0.00272;
  sun.rotation.y += 0.000208;
  moon.rotation.y += 0.000165;
  mercury.rotation.y += 0.00017;
  venus.rotation.y += 0.00041;
};
animatePlanets();

renderloop();
