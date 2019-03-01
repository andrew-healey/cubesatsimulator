/**
 * A full-fledged, interactive mission simulator to help familiarize users with the blair3sat mission.
 * @author Andrew Healey
 * @author Aaron Chyatte
 */

import THREE from "three";
import OrbitControls from "node_modules/three/examples/js/controls/OrbitControls";

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
  let contexts={};//Shape {2,3}
  let camera,controls,scene,renderer;

  /**
   * Initializes a Threejs environment without rendering.
   * @param canvas3d {Object} - A Canvas element into which to draw the 3D scene
   * @param context2d {Object} - A Canvas element into which to draw the 2D logs and info
   */
  function init(canvas3d,canvas2d){
    if(context3d) contexts[3]=context3d;
    if(context2d) contexts[2]=context2d;
    renderer=new THREE.WebGLRenderer({
      canvas:canvas3d
    });
    //...
  }

  //TODO Add Threejs stuff, init stuff, control stuff, etc.

  Object.assign(ret, {}); //All public methods
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
  let locations=[];
  let time=0;

  /**
   * Calculates the locus of the wave's current location after refraction in the ionosphere
   * @param t {Number} - The time to which to set the wave.
   */
  function setTime(t) {
    if(t===undefined) t=time+1;

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
