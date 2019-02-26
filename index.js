import THREE from "three";
import OrbitControls from "node_modules/three/examples/js/controls/OrbitControls";

const renderer=new THREE.WebGLRenderer({canvas:document.getElementById("scene")});
const scene=new THREE.Scene();

const camera=new THREE.PerspectiveCamera(window.innerWidth/window.innerHeight,1,2000);

//OrbitControls, but it is possible that we don't use them - look at the low-poly Earth simulation for guidance
const controls=new OrbitControls(camera,document.getElementById("scene"));

const EARTH_RADIUS;//Add something here

//Define the low-poly earth as represented at mdiller/lowpoly-earth

controls.enableKeys=false;

camera.position.set(-EARTH_RADIUS*1.5,0,0);

const CUBESAT_ALTITUDE;//Add something here

//Define Cubesat stuff

