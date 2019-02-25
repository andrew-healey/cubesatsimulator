import THREE from "three";
import OrbitControls from "node_modules/three/examples/js/controls/OrbitControls";

const renderer=new THREE.WebGLRenderer({canvas:document.getElementById("scene")});
const scene=new THREE.Scene();

const camera=new THREE.PerspectiveCamera(window.innerWidth/window.innerHeight,1,2000);


