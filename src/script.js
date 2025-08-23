import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// add texture loader
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load("/textures/8k_stars_milky_way.jpg");
//add textures
const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const moonTexture = textureLoader.load("/textures/2k_moon.jpg");
const marsTexture = textureLoader.load("textures/2k_mars.jpg");

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
        distance: -3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
];
//function for creating planets
// setPlanetAtribute function
const setPlanetAttribute = (planetObject, planet) => {
  planet.scale.setScalar(planetObject.radius);
  planet.position.x = planetObject.distance;
  planet.distance = planetObject.distance;
  planet.speed = planetObject.speed;
  planet.name = planetObject.name;
  planet.castShadow = true;
  planet.receiveShadow = true;

  return planet;
};

// setMoonAttributes
const setMoonAttribute = (moonObject, moon) => {
  moon.name = moonObject.name;
  moon.scale.setScalar(moonObject.radius);
  moon.distance = moonObject.distance;
  moon.speed = moonObject.speed;
  moon.position.x = moonObject.distance;
  moon.castShadow = true;
  moon.receiveShadow = true;
};

// createMoon function
const createMoons = (moonList) => {
  if (moonList.length != 0) {
    let moonGroup = new THREE.Group();
    moonList.forEach((moonObject) => {
      const moonGeometry = new THREE.SphereGeometry(moonObject.radius, 32, 32);
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      setMoonAttribute(moonObject, moon);
      moonGroup.add(moon);
    });
    return moonGroup;
  }
};

const createPlanets = () => {
  // initialize Group for planets
  let group = new THREE.Group();
  planets.forEach((planetObject) => {
    const planetGeometry = new THREE.SphereGeometry(
      planetObject.radius,
      32,
      32
    );
    let planet = new THREE.Mesh(planetGeometry, planetObject.material);
    planet = setPlanetAttribute(planetObject, planet);
    group.add(planet);
    if (planetObject.moons.length != 0) {
      const moonGroup = createMoons(planetObject.moons);
      planet.add(moonGroup);
    }
  });
  //return Group of all Planets
  return group;
};
const group = createPlanets();
scene.add(group);

//Queryselectors for each Planet
const earth = group.getObjectByName("Earth");
const mercury = group.getObjectByName("Mercury");
const mars = group.getObjectByName("Mars");
const venus = group.getObjectByName("Venus");
const moon = group.getObjectByName("Moon");
const phobos = group.getObjectByName("Phobos");
const deimos = group.getObjectByName("Deimos");
const planetsArray = [earth, mercury, mars, venus, moon, phobos, deimos];

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

const pointLight = new THREE.PointLight(0xffffff, 100);
scene.add(pointLight);
pointLight.castShadow = true;
// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

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
//initialize a clock
const clock = new THREE.Clock();

// render loop
const renderloop = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
  planetsArray.forEach((planet) => {
    animatePlanet(planet, elapsedTime);
  });
};
const animatePlanet = (planet, elapsedTime) => {
  planet.position.x = Math.sin(elapsedTime * planet.speed) * planet.distance;
  planet.position.z = Math.cos(elapsedTime * planet.speed) * planet.distance;
  planet.rotation.y += planet.speed / 10;
};

renderloop();
