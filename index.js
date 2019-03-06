/**
 * A full-fledged, interactive mission simulator to help familiarize users with the blair3sat mission.
 * @author Andrew Healey
 * @author Aaron Chyatte
 */

import THREE from "three/examples/js/controls/OrbitControls";

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
  let ret = {};
  let time = 0;
  let model;

  function init(THREE,simScene){
    //Just kinda some pseudocode
    model=new THREE.LoadModel("cubesatModel.");

    setTime(0);

    scene.add(model);
    
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

    let coords,angle;
    angle=Math.PI*2*(t%period/period);
    coords={z:0,y:altitude*Math.SIN(angle),x:altitude*Math.COS(angle)};

    model.position.set(coords.x,coords.y,coords.z);

    time = t % period;
  }

  /**
   * Gets the current time of the Cubesat - just a getter
   */
  function getTime() {
    return time;
  }

  //TODO Add rendering methods, toggling between inspection and action mode, receiving ionosonde soundings, handling logs and sending analyzed logs to the Setting class

  Object.assign(ret, {
    getTime,
    setTime,
    toggleInspection
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
  let canvases={};//Shape {2,3}
  let scenes={};//Shape {sim,inspect}
  let camera,controls,renderer;

  /**
   * Initializes a Threejs environment without rendering.
   * @param canvas3d {Object} - A Canvas element into which to draw the 3D scene
   * @param context2d {Object} - A Canvas element into which to draw the 2D logs and info
   */
  function init(canvas3d,canvas2d){
    if(canvas3d) canvases[3]=canvas3d;
    if(canvas2d) canvases[2]=canvas2d;
    renderer=new THREE.WebGLRenderer({
      canvas:canvas3d
    });
    let loader=new THREE.TextureLoader();
    scenes.sim=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(45,canvas3d.width/canvas3d.height,1,2000);
    controls=new THREE.OrbitControls(camera,canvas3d);//Maybe use something different later, without panning and with strict limits
    let pointLight=new THREE.PointLight(0xCCCCCC);
    Object.assign(pointLight.position,{x:0,y:0,z:0});
    let hemLight=new THREE.HemisphereLight(0x888888,0x555555,1);
    hemLight.position.set(0,0,0).normalize();
    //Stars.jpg is from https://4.bp.blogspot.com/-t4nMV8Q9KpE/T8SNLkNyAiI/AAAAAAAAADM/gTAU2ovZm7Q/s1600/01.jpg
    let background=loader.load("../public/stars.jpg",function ( texture ) {
        var img = texture.image;
        bgWidth= img.width;
        bgHeight = img.height;
        resize();
    });
    background.wrapS=THREE.MirroredRepeatWrapping;
    background.wrapT=THREE.MirroredRepeatWrapping;
    scenes.sim.background=background;
  }

  /**
   * Renders the scene once.
   */
  function render(){
    renderer.render(scenes.sim,camera);
  }

  //TODO Add Threejs stuff, init stuff, control stuff, etc.

  Object.assign(ret, {init,render}); //All public methods
  return ret;
}

/**
 * Describes the Ionosonde class, which handles sending and receiving of soundings
 * @constructor
 * @param long {Number} - A multiple of PI which determines the longitude of the ionosonde
 * @param lat {Number} - A multiple of PI which determines the latitude of the ionosonde
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
  function getTime(){
    return time;
  }

  /**
   * Receives soundings.
   * @param signals {Array} - The array of signals sent, where each signal is an object of shape {transmitTime {Number},coords {Array[Number]},altitude {Number},direction {Number},frequency {Number}}
   */
  function receiveSounding(signals){
    for(i in signals){
      let signal=signals[i];

      if(direction===-1){
        //Check to see with ray-tracing (possibly) if should receive the signal
        logSignal(signal.frequency,time-signal.transmitTime);
      }
    }
  }

  Object.assign(ret, {setTime,getTime});
  return ret;
}

/**
 * Describes the Wave class which simulates a radio wave sent up from an ionosonde and its interactions
 * @constructor
 * @param origin {Object} - An object of shape {longitude {Number},latitude {Number}} that represents the source of the wave.
 */
function Wave(origin){
  let ret={};
  let locus=[];
  let time=0;

  /**
   * Calculates the locus of the wave's current location after refraction in the ionosphere
   * @param t {Number} - The time to which to set the wave.
   */
  function setTime(t) {
    if(t===undefined) t=time+1;

    //Calculate from the beginning of time
    let newLocus=new Array(RESOLUTION).fill(origin);

    for(point of newLocus){
    }


    time=t;
    return t;

  }

  /**
   * Gets the time of the wave.
   */
  function getTime(){
    return time;
  }

  Object.assign(ret,{setTime,getTime});
  return ret;
}

/**
 * Describes the Ionosphere class which renders and provides collision detection for the ionosphere.
 * @param radius {Number} - The altitude of the ionosphere in general
 */
function Ionosphere(){
  let ret={};
  let physical;
  const RESOLUTION=1000;
  let [a,b,c,d]=Array(4).fill(0).map(i=>Math.round(Math.random()*50));
  function init(scene,THREE){
    physical=new THREE.SphereGeometry(175,100,100);
    let material=new THREE.MeshBasicMaterial({alphaMap:"darkgray",color:0x898989});
    physical=new THREE.Mesh(physical,material);
    return physical;
  }
}


const element=document.getElementById("scene");
const scene=new Setting(THREE,element);
scene.init(element,null);
scene.render();
