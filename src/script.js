import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// add texture loader
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

//add textures
const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const moonTexture = textureLoader.load("/textures/2k_moon.jpg");
const marsTexture = textureLoader.load("textures/2k_mars.jpg");
const backgroundTexture = textureLoader.load(
  "/textures/2k_stars_milky_way.jpg"
);
cubeTextureLoader.setPath("textures/cubeMap/");
const cubeMapBackground = cubeTextureLoader.load([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
]);
scene.background = cubeMapBackground;
// add materials
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
// create sun

const sun = new THREE.Mesh(sphereGeometry, sunMaterial);

sun.scale.setScalar(5);
scene.add(sun);

const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.4,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 28,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.3,
        distance: 2,
        speed: 0.015,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
];

const createPlanet = (planet) => {
  //create the mesh and add it to the scene
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  //set the scale
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;
  planetMesh.speed = planet.speed;
  planetMesh.distance = planet.distance;
  return planetMesh;
};
const createMoon = (moon) => {
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;
  moonMesh.speed = moon.speed;
  moonMesh.distance = moon.distance;
  return moonMesh;
};

//function for creating planets
const planetMeshes = planets.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);

  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon);
    planetMesh.add(moonMesh);
  });
  return planetMesh;
});
// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

// initialize
const pointLight = new THREE.PointLight(0xffffff, 200);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
sun.add(pointLight);
sun.add(ambientLight);

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

// Animating parent planets
const animateParentPlanets = (planet) => {
  planet.rotation.y += planet.speed;
  planet.position.x = Math.sin(planet.rotation.y) * planet.distance;
  planet.position.z = Math.cos(planet.rotation.y) * planet.distance;
};
// Animating moons
const animateMoons = (moon) => {
  moon.rotation.y += moon.speed;
  moon.position.x = Math.sin(moon.rotation.y) * moon.distance;
  moon.position.z = Math.cos(moon.rotation.y) * moon.distance;
};

// Animating planets
const animatePlanets = () => {
  sun.rotation.y += 0.001;
  planetMeshes.forEach((planet) => {
    animateParentPlanets(planet);
    planet.children.forEach((moon) => {
      animateMoons(moon);
    });
  });
};

// render loop
const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
  animatePlanets();
};

renderloop();
