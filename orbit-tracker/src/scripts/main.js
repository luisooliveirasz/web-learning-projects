import '../styles/global.css'
import { ParametricCurve3D } from './parametric_curve.js'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { conicCartesianFormula } from './math_stuff.js';

const EARTH_ANGULAR_VELOCITY = (2 * Math.PI / (24 * 3600));

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const clock = new THREE.Clock();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 2;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Skybox
const skyTexture = textureLoader.load(
  './assets/milkway_skybox.png'
);
skyTexture.mapping = THREE.EquirectangularReflectionMapping;
skyTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = skyTexture;

// Earth sphere
const earthTexture = textureLoader.load(
  'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
);
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({ map: earthTexture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Sun light
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(2, 0, 0);
scene.add(light);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Equator plane
const equatorGeometry = new THREE.RingGeometry(1.01, 1.02, 64);
const equatorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const equator = new THREE.Mesh(equatorGeometry, equatorMaterial);
equator.rotation.x = Math.PI / 2;
scene.add(equator);

// Axes helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

let eccentricity = 0.5;
let inclination = 30;

const func = t => conicCartesianFormula(eccentricity, 2, t);

const elipse = new ParametricCurve3D(
    func,
    0,
    2 * Math.PI,
    1000
);
elipse.rotateYDeg(90);
elipse.setRotationXDeg(90 + inclination);

scene.add(elipse.getObject());

// Data
const eccentricitySlider = document.getElementById("eccentricity-slider");
const eccentricityValue = document.getElementById("eccentricity-slider-value");

const inclinationSlider = document.getElementById("inclination-slider");
const inclinationValue = document.getElementById("inclination-slider-value");

const timeScaleInput = document.getElementById("time-scale-input");
let timeScale = 3600;

eccentricitySlider.addEventListener("input", (event) => {
    eccentricity = parseFloat(event.target.value);
    eccentricityValue.textContent = eccentricity.toFixed(2);
    elipse.createCurve();
});

inclinationSlider.addEventListener("input", (event) => {
    inclination = parseFloat(event.target.value);
    inclinationValue.textContent = Math.round(inclination) + "°";
    elipse.setRotationXDeg(90 + inclination);
});

timeScaleInput.addEventListener("input", (event) => {
  timeScale = parseFloat(event.target.value);
});

// loop
function animate() {
  requestAnimationFrame(animate);

  var earthRotationDelta = EARTH_ANGULAR_VELOCITY * timeScale * clock.getDelta();

  sphere.rotation.y += earthRotationDelta;
  renderer.render(scene, camera);
  controls.update();
}
animate();