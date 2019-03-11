/**
 * A full-fledged, interactive mission simulator to help familiarize users with the blair3sat mission.
 * @author Andrew Healey
 * @author Aaron Chyatte
 */

import THREE from "three/examples/js/controls/OrbitControls";

import planet from './planet/planet.js';
import {
  Interaction
} from 'three.interaction';

import Cubesat from './cubesat.js';

/**
 * Describes the Earth class, which renders the earth, rotates it, changes resolution based on processing speeds, controls ionosonde location and sounding and utilizes the github repo at mdiller/lowpoly-earth
 * @constructor
 * @param period {Number} - the period, in seconds, of the Earth's rotation - aka day length
 * @param radius {Number} - the radius of the earth, in Threejs units
 */
function Earth(period, radius) {
  let ret = {};
  let time = 0;

  /**
   * Sets the time, both time-travelling and passing seconds automatically. Meant to be used with a slider or something similar.
   * @param t {Number} The time, in seconds, to which to set the Cubesat's timeline.
   */
  function setTime(t) {
    if (t === undefined) t = time + 1;
    //TODO Set rotation based on time
    time = t % period;
  }

  /**
   * Gets the current time of the Earth - just a getter
   */
  function getTime() {
    return time;
  }

  function init(scene, camera, renderer) {
    this.earth = planet(scene, camera, renderer);
    return this.earth;
  }

  //TODO Make ionosonde control, rendering methods

  Object.assign(ret, {
    setTime,
    getTime
  }); //All public methods
  return ret;
}


/**
 * Describes the Cubesat class, which renders the cubesat, moves it around the sky, and allows for inspection.
 * @constructor
 * @param period {Number} - describes the period, in seconds, of the Cubesat's orbit around the Earth
 * @param altitude {Number} - describes the Cubesat's altitude from the center of the Earth, in Threejs units
 */
function Cubesat(period, altitude) {
  let model;

  /**
   * Initializes the cubesat, setting its time to 0, returning its model and position, etc.
   * @param 

  /**
   * Gets the current time of the Cubesat - just a getter
   */
  function init(simScene) {
    //Just kinda some pseudocode
    //model=new THREE.LoadModel("cubesatModel.");
    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(25, 25, 25),
      new THREE.MeshBasicMaterial({
        color: 0x888888
      }),
    );
    this.cube.cursor = 'pointer';
    this.cube.on('mouseover', () => {
      this.cube.material.color.setHex(0xffffff);
    });
    this.cube.on('mouseout', () => {
      this.cube.material.color.setHex(0x888888);
    });
    this.cube.position.y = 150;

    setTime(0);

    return model;

  }

  /**
   * Toggles inspection/action modes.
   */
  function toggleInspection() {
    //...
  }

  /*
   * Sets the time, both time-travelling and passing seconds automatically. Meant to be used with a slider or something similar.
   * @param t {Number} The time, in seconds, to which to set the Cubesat's timeline.
   */
  function setTime(t) {
    if (t === undefined) t = time + 1;
    //TODO Set the spot in the orbit, maybe based on some params - customization comes later

    let coords, angle;
    angle = Math.PI * 2 * (t % period / period);
    coords = {
      z: 0,
      y: altitude * Math.SIN(angle),
      x: altitude * Math.COS(angle)
    };

    model.position.set(coords.x, coords.y, coords.z);

    time = t % period;
  }


  //TODO Add rendering methods, toggling between inspection and action mode, receiving ionosonde soundings, handling logs and sending analyzed logs to the Setting class

  Object.assign(ret, {
    getTime,
    setTime,
    toggleInspection,
    init
  }); //All public methods
  return ret;

}

/**
 * Describes the Setting class, which handles Threejs canvas render methods and generally directs the objects in the scene
 * @constructor
 * @param Three {Object} - The Threejs object, just here for functionality
 */
function Setting(Three) {
  let ret = {};
  let canvases = {}; //Shape {2,3}
  let scenes = {}; //Shape {sim,inspect}
  let cubesat, earth, ionosphere;
  let camera, controls, renderer, interaction, start=performance.now();
  const SPACE_COLOR = 0x0f0f0f;
  const SUN_COLOR = 0xffffff;
  const AMBIENT_COLOR = 0xffffff;

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  /**
   * Initializes a Threejs environment without rendering.
   * @param canvas3d {Object} - A Canvas element into which to draw the 3D scene
   * @param context2d {Object} - A Canvas element into which to draw the 2D logs and info
   */
  function init(canvas3d, canvas2d) {
    if (canvas3d) canvases[3] = canvas3d;
    if (canvas2d) canvases[2] = canvas2d;
    start = performance.now();
    renderer = new THREE.WebGLRenderer({
      canvas: canvas3d,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(SPACE_COLOR, 1);
    let loader = new THREE.TextureLoader();
    scenes.sim = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, canvas3d.width / canvas3d.height, 1, 2000);
    controls = new THREE.OrbitControls(camera, canvas3d); //Maybe use something different later, without panning and with strict limits
    let pointLight = new THREE.PointLight(0xCCCCCC);
    let hemLight = new THREE.HemisphereLight(0x888888, 0x555555, 1);
    hemLight.position.set(0, 0, 0).normalize();
    earth = (Earth(60 * 60 * 24, 100));
    let earthObject = earth.init();
    scenes.sim.add(earthObject);
    cubesat = Cubesat(scene, earthObject);
    addStars();
    scenes.sim.add(cubesat.init(scene));
  }

  function animate() {
    requestAnimationFrame(animate);

    cubesat.update(performance.now() - start);

    renderer.render(scene, camera);
  }

  function addStars() {
    let starsGeometry = new THREE.Geometry();

    for (let i = 0; i < 10000; i++) {

      var star = new THREE.Vector3();
      star.x = THREE.Math.randFloatSpread(1500);
      star.y = THREE.Math.randFloatSpread(1500);
      star.z = THREE.Math.randFloatSpread(1500);

      starsGeometry.vertices.push(star);
    }

    let starsMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa
    });

    let starField = new THREE.Points(starsGeometry, starsMaterial);

  }

  /**
   * Renders the scene once.
   */
  function render() {
    renderer.render(scenes.sim, camera);
  }

  //TODO Add Threejs stuff, init stuff, control stuff, etc.

  Object.assign(ret, {
    init,
    render,
    animate
  }); //All public methods
  return ret;
}

/**
 * Describes the Ionosonde class, which handles sending and receiving of soundings
 * @constructor
 * @param long {Number} - An angle--multiple of PI--which determines the longitude of the ionosonde
 * @param lat {Number} - An angle--multiple of PI--which determines the latitude of the ionosonde
 */
function Ionosonde(long, lat) {
  let ret = {};

  /**
   * Sets the time, both time-travelling and passing seconds automatically. Meant to be used with a slider or something similar.
   * @param t {Number} - The time, in seconds, to which to set the Ionosonde's timeline.
   */
  function setTime(t) {
    if (t === undefined) t = time + 1;

    time = t;
  }

  /**
   * Just a simple getter function.
   */
  function getTime() {
    return time;
  }

  /**
   * Receives soundings.
   * @param signals {Array} - The array of signals sent, where each signal is an object of shape {transmitTime {Number},coords {Array[Number]},altitude {Number},direction {Number},frequency {Number}}
   */
  function receiveSounding(signals) {
    for (i in signals) {
      let signal = signals[i];

      if (direction === -1) {
        //Check to see with ray-tracing (possibly) if should receive the signal
        logSignal(signal.frequency, time - signal.transmitTime);
      }
    }
  }

  Object.assign(ret, {
    setTime,
    getTime
  });
  return ret;
}

/**
 * Describes the Wave class which simulates a radio wave sent up from an ionosonde and its interactions
 * @constructor
 * @param origin {Object} - An object of shape {longitude {Number},latitude {Number}} that represents the source of the wave.
 */
function Wave(origin) {
  let ret = {};
  let locus = [];
  let time = 0;

  /**
   * Calculates the locus of the wave's current location after refraction in the ionosphere
   * @param t {Number} - The time to which to set the wave.
   */
  function setTime(t) {
    if (t === undefined) t = time + 1;

    //Calculate from the beginning of time
    let newLocus = new Array(RESOLUTION).fill(origin);

    for (point of newLocus) {}


    time = t;
    return t;

  }

  /**
   * Gets the time of the wave.
   */
  function getTime() {
    return time;
  }

  Object.assign(ret, {
    setTime,
    getTime
  });
  return ret;
}

/**
 * Describes the Ionosphere class which renders and provides collision detection for the ionosphere.
 * @constructor
 * @param radius {Number} - The altitude of the ionosphere in general
 */
function Ionosphere(radius) {
  let ret = {};
  let physical, locus;
  const RESOLUTION = 1000;
  //Init params for the ionosonde's polar graph to random values
  let [a, b, c, d] = Array(4).fill(0).map(i => Math.floor(Math.random() * 30 - 15));

  /**
   * Calculates the radius of a certain point in the atmosphere based on the equation r=bcos(dθ)+asin(cθ)
   * @param long {Number} - The longitude of the point to render.
   * @param lat {Number} - The latitude of the point to render.
   */
  function getCoords(long, lat) {
    let r = (theta) => b * cos(d * theta) + a * sin(c * theta);
    return radius + r(long) + r(lat);
  }

  /**
   * Initializes the rendered and mathematical manifestation of the ionosphere.
   * @param scene {Object} - The scene object made by Threejs.
   */
  function init(scene) {
    physical = new THREE.SphereGeometry(175, 100, 100);
    let material = new THREE.MeshBasicMaterial({
      alphaMap: "darkgray",
      color: 0x898989
    });
    physical = new THREE.Mesh(physical, material);
    let ptsPerDim = Math.floor(Math.sqrt(RESOLUTION));
    for (long = 0; long < ptsPerDim; long++) {
      for (lat = 0; lat < ptsPerDim; lat++) {
        locus[long * ptsPerDim][lat] = getCoords(long, lat);
      }
    }

    //Set actual bounds

    return physical;
  }

}


const element = document.getElementById("scene");
const scene = new Setting(element);
scene.init(element, null);
scene.animate();
