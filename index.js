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
    if (typeof(t) === "undefined") t = time + 1;
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

  ret = Object.assign(ret, {
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
    if (typeof(t) === "undefined") t = time + 1;
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

  ret = Object.assign(ret, {
    getTime,
    setTime,
    toggleInspection
  }); //All public methods
  return ret;

}

/**
 * Describes the Setting class, which handles Threejs canvas render methods and generally directs the objects in the scene
 */
function Setting(Three) {
  let ret = {};

  //TODO Add Threejs stuff, init stuff, control stuff, etc.

  ret = Object.assign(ret, {});//All public methods
  return ret;
}
