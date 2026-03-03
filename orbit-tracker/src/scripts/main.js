import '../styles/global.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { conicCartesianFormula } from './math_stuff.js'

import satelliteURL from '../../assets/models/satellite/scene.gltf?url'
import skyURL from '../../assets/textures/milkway_skybox.png?url'
import moonTextureURL from '../../assets/textures/moon_texture.jpg?url'

import { ParametricCurve3D } from "./parametric_curve.js"

// ==================== CONSTANTS ====================
const EARTH_ANGULAR_VELOCITY = (2 * Math.PI) / (24 * 3600);
const EARTH_RADIUS = 1;
const MOON_RADIUS = 0.2728; // approx 1740 / 6378
const MOON_DISTANCE = 60.2 * 0.1; // approx 384400 / 6378
const SATELLITE_SCALE = 0.05;
const EQUATOR_PLANE_SIZE = 10;
const AXES_LENGTH = 5;
const ZOOM_MIN_DISTANCE = 1;
const ZOOM_MAX_DISTANCE = 30;

// ==================== MAIN CLASS ====================
class SatelliteScene {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();
    this.textureLoader = new THREE.TextureLoader();

    // Orbital state
    this.eccentricity = 0.5;
    this.inclination = 30;
    this.ascendingNodeLongitude = 0;
    this.periapsisArgument = 0;
    this.semiMajorAxis = 2;
    this.timeScale = 3600;

    this.orbitAngle = 0;

    this.earth = null;
    this.moon = null;
    this.satellite = null;
    this.orbitCurve = null;
    this.equatorPlane = null;
    this.axes = null;

    // Flags
    this.showEquator = false;
    this.showAxes = false;

    this.initScene();
    this.initLights();
    this.initEarth();
    this.initMoon();
    this.initSkybox();
    this.initHelpers();
    this.initOrbit();
    this.initSatellite();
    this.initControls();
    this.initUI();

    this.animate();
  }

  // ==================== SCENE ====================
  initScene() {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    document.body.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ==================== LIGHT ====================
  initLights() {
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(5, 0, 0);
    this.scene.add(sun);

    const ambient = new THREE.AmbientLight(0x404060);
    this.scene.add(ambient);
  }

  // ==================== EARTH ====================
  initEarth() {
    if (this.textureLoader == null) this.textureLoader = new THREE.TextureLoader();

    const earthTexture = this.textureLoader.load(
      'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
    );

    const geometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: earthTexture });

    this.earth = new THREE.Mesh(geometry, material);
    this.scene.add(this.earth);
  }

  // ==================== MOON ====================
  initMoon() {
    if (this.textureLoader == null) this.textureLoader = new THREE.TextureLoader();

    const moonTexture = this.textureLoader.load(moonTextureURL);
    const geometry = new THREE.SphereGeometry(MOON_RADIUS, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: moonTexture });

    this.moon = new THREE.Mesh(geometry, material);
    this.scene.add(this.moon);

    this.moon.position.set(MOON_DISTANCE, 0, 0);
  }

  // ==================== BACKGROUND ====================
  initSkybox() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(skyURL);

    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    this.scene.background = texture;
  }

  initHelpers() {
    this.axes = new THREE.AxesHelper(AXES_LENGTH);
    this.scene.add(this.axes);
    this.axes.visible = this.showAxes;

    this.equatorPlane = new THREE.GridHelper(EQUATOR_PLANE_SIZE, EQUATOR_PLANE_SIZE);
    this.scene.add(this.equatorPlane);
    this.equatorPlane.visible = this.showEquator;
  }

  // ==================== ORBIT ====================
  createOrbitPoints() {
    const points = [];
    const segments = 1000;

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * 2 * Math.PI;
      const p = conicCartesianFormula(
        this.eccentricity,
        this.semiMajorAxis,
        t
      );

      p.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        THREE.MathUtils.degToRad(90)
      );

      p.applyAxisAngle(
        new THREE.Vector3(1, 0, 0),
        THREE.MathUtils.degToRad(90 + this.inclination)
      );

      points.push(p);
    }

    return points;
  }

  initOrbit()
  {
    const func = t => conicCartesianFormula(this.eccentricity, this.semiMajorAxis, t);
    this.orbitCurve = new ParametricCurve3D(
        func,
        0,
        2 * Math.PI,
        1000
    );
    this.orbitCurve.rotateYDeg(90);
    this.orbitCurve.setRotationXDeg(90 + this.inclination);
    this.scene.add(this.orbitCurve.getObject());
  }

  updateOrbit() {
    if (this.orbitCurve) {
      this.scene.remove(this.orbitCurve.getObject());
    }
    this.initOrbit();
  }

  // ==================== SATELLITE ====================
  initSatellite() {
    const loader = new GLTFLoader();

    loader.load(
      satelliteURL,
      (gltf) => {
        this.satellite = gltf.scene
        this.satellite.scale.set(
          SATELLITE_SCALE,
          SATELLITE_SCALE,
          SATELLITE_SCALE
        )
        this.scene.add(this.satellite)
      },
      undefined,
      (error) => console.error(error)
    );
  }

  updateSatellite(delta) {
    if (!this.satellite) return;

    const orbitalPeriod = 24 * 3600;
    const angularSpeed = (2 * Math.PI) / orbitalPeriod;

    this.orbitAngle += angularSpeed * this.timeScale * delta;

    const t = this.orbitAngle % (2 * Math.PI);

    const p = conicCartesianFormula(
      this.eccentricity,
      this.semiMajorAxis,
      t
    );

    // p.applyAxisAngle(
    //   new THREE.Vector3(0, 1, 0),;
    //   THREE.MathUtils.degToRad(90);
    // );

    p.applyAxisAngle(
      new THREE.Vector3(1, 0, 0),
      THREE.MathUtils.degToRad(90 + this.inclination)
    );

    this.satellite.position.copy(p);
  }

  // ==================== CONTROLS ====================
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = ZOOM_MIN_DISTANCE;
    this.controls.maxDistance = ZOOM_MAX_DISTANCE;
  }

  // ==================== UI ====================
  initUI() {
    const smaSlider = document.getElementById('semi-major-axis-input');
    const eccSlider = document.getElementById('eccentricity-slider');
    const incSlider = document.getElementById('inclination-slider');
    const anlSlider = document.getElementById('ascending-node-longitude-slider');
    const aopSlider = document.getElementById('periapsis-argument-slider');
    const timeInput = document.getElementById('time-scale-input');

    const eccText = document.getElementById('eccentricity-slider-text');
    const incText = document.getElementById('inclination-slider-text');
    const anlText = document.getElementById('ascending-node-longitude-slider-text');
    const aopText = document.getElementById('periapsis-argument-slider-text');

    const showAxesCheckbox = document.getElementById('show-axes-checkbox');
    const showEquatorCheckbox = document.getElementById('show-equator-checkbox');

    smaSlider.addEventListener('input', (e) => {
      this.semiMajorAxis = parseFloat(e.target.value);
      this.updateOrbit();
    });

    eccSlider.addEventListener('input', (e) => {
      this.eccentricity = parseFloat(e.target.value);
      this.updateOrbit();
      eccText.innerHTML = this.eccentricity;
    });

    incSlider.addEventListener('input', (e) => {
      this.inclination = parseFloat(e.target.value);
      this.updateOrbit();
      incText.innerHTML = this.inclination + '°';
    });

    anlSlider.addEventListener('input', (e) => {
      this.ascendingNodeLongitude = parseFloat(e.target.value);
      this.updateOrbit();
      anlText.innerHTML = this.ascendingNodeLongitude + '°';
    });

    aopSlider.addEventListener('input', (e) => {
      this.periapsisArgument = parseFloat(e.target.value);
      this.updateOrbit();
      aopText.innerHTML = this.periapsisArgument + '°';
    });

    timeInput.addEventListener('input', (e) => {
      this.timeScale = parseFloat(e.target.value);
    });

    showAxesCheckbox.addEventListener('input', (e) => {
      this.showAxes = e.target.checked;
      this.axes.visible = this.showAxes;
    });

    showEquatorCheckbox.addEventListener('input', (e) => {
      this.showEquator = e.target.checked;
      this.equatorPlane.visible = this.showEquator;
    });
  }

  // ==================== ANIMATION ====================
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    if (this.earth) {
      this.earth.rotation.y +=
        EARTH_ANGULAR_VELOCITY * this.timeScale * delta;
    }

    this.updateSatellite(delta);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// ==================== START ====================
document.addEventListener('DOMContentLoaded', () => {
  new SatelliteScene();
});