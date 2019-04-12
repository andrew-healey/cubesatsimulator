import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
// import {
//     Interaction
// } from 'three.interaction';

import Earth from './earth.js';
import Cubesat from './cubesat.js';
import Ionosphere from './ionosphere.js';
import Ionosonde from './ionosonde.js';
import Wave from './wave.js';

class Thing {
    constructor(name, text = "", title="") {
        this.name = name;
        this.html = text;
        this.title = title;
    }

    init(canvas) {
        // console.log(canvas);
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    $animate(ot) {
        let nt = +new Date();
        let dt = nt - ot;
        if (this.running) requestAnimationFrame(() => this.$animate(nt));
        this.animate(dt);
    }

    animate() {}

    start() {
        this.running = true;
        this.animate(+new Date());
    }
    stop() {
        this.running = false;
    }
}

class CubesatThingy extends Thing {
    constructor() {
        super("cubesat", `the cubesat is a majestic beast`, "The Cubesat");
        this.running = false;
    }

    animate(dt) {
        this.context.fillStyle = "#ff0000";
        this.context.fillRect(0, 0, 100, 100);
    }
}
class IonosondeThing extends Thing {
    constructor() {
        super("ionosonde", `the ionosonde is a majestic beast`, "An Ionosonde");
        this.running = false;
    }

    animate(dt) {
        this.context.fillStyle = "#00ff00";
        this.context.fillRect(0, 0, 100, 100);
    }
}


class IonosphereThing extends Thing {
    constructor() {
        super("ionosphere", `
                The ionosphere is the layer of the earth 's atmosphere that contains a high concentration of ions and free electrons and is able to reflect radio waves. It lies above the mesosphere and extends from about 50 to 600 miles (80 to 1,000 km) above the earth's surface.
        `, "The Ionosphere");
        this.running = false;
    }

    animate(dt) {
        this.context.fillStyle = "#00ff00";
        this.context.fillRect(0, 0, 100, 100);
    }
}
class WaveThing extends Thing {
    constructor() {
        super("waves", `waves are majestic beasts`);
        this.running = false;
    }

    animate(dt) {
        this.context.fillStyle = "#00ff00";
        this.context.fillRect(0, 0, 100, 100);
    }
}

class InfoDropdown {
    constructor(element) {
        this.element = element;
        this.text = element.querySelector("#text");
        this.canvas = element.querySelector("#canvas");
        this.title = element.querySelector("#title");
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.close = element.querySelector("#close");

        this.close.addEventListener("click", () => this.reset());

        this.things = {};
        this.currentThing = null;
    }

    add(thing) {
        this.things[thing.name] = thing;
        thing.init(this.canvas);
    }

    select(thing) {
        if (this.things[thing]) {
            this.reset();
            this.currentThing = this.things[thing];
            this.currentThing.start();
            this.text.innerHTML = this.currentThing.html;
            this.title.innerHTML = this.currentThing.title;

            this.element.classList.add("visible");
        }
    }
    reset() {
        if (this.currentThing) {
            this.element.classList.remove("visible");
            this.currentThing.stop();
            this.currentThing = null;
            this.text.innerHTML = "";
        }
    }
}

let info = new InfoDropdown(document.getElementById("info"));
info.add(new CubesatThingy());
info.add(new IonosondeThing());
info.add(new IonosphereThing());
info.add(new WaveThing());


let renderer, scene, camera, controls, interaction, clock, start =+ new Date(); 
let earth, cubesat, ionosphere, ionosonde;
let container = document.getElementById('container');

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}
window.addEventListener('mousemove', onMouseMove, false);


let waves=[];

const SPACE_COLOR = 0x0f0f0f;
const SUN_COLOR = 0xffffff;
const AMBIENT_COLOR = 0xffffff;

const IONOSPHERE_RESOLUTION = 100;

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function init() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(SPACE_COLOR, 1);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    // interaction = new Interaction(renderer, scene, camera);
    // clock = new THREE.Clock();
    // clock.start()


    // let sun = new THREE.PointLight(SUN_COLOR, 1, 4000);
    // sun.position.set(50, 0, 0);
    // let lightAmbient = new THREE.AmbientLight(AMBIENT_COLOR);
    // scene.add(sun, lightAmbient);

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

    var starField = new THREE.Points(starsGeometry, starsMaterial);

    scene.add(starField);
    earth = new Earth(scene, camera, renderer);
    cubesat = new Cubesat(scene, earth.earth);
    ionosphere = new Ionosphere(scene, IONOSPHERE_RESOLUTION, 1.5); //1.5 stands for altitude of the ionosphere in general.
    console.log(waves instanceof Array);
    ionosonde = new Ionosonde(scene, earth,ionosphere,1/4,0,waves);
    let earthCore=new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE.MeshBasicMaterial({color:0x00BB00}));
    waves.push(new Wave(earth,ionosphere,1/2,0,5,1/2));
    renderer.render(scene, camera);
}

function animate() {
    setTimeout(()=>requestAnimationFrame(animate, 2));
    let dt=new Date() - start;
    
    cubesat.update(dt);
    ionosonde.update(dt);
    for(let wave of waves){
        wave.update(dt);
    }

    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children);

    let match = false;
    let ionos = false;
    cubesat.hover = false;
    ionosphere.hover = false;
    ionosonde.hover = false
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object === cubesat.cube) {
            cubesat.hover = match = true;
            break;
        } else if (intersects[i].object === ionosonde.geom) {
            ionosonde.hover = match = true;
            break;
        } else if(intersects[i].object === ionosphere.ionosphere){
            ionos = true;
        }
    }
    if(!match && ionos) ionosphere.hover = true;
    renderer.render(scene, camera);
}

init();
ionosonde.update(2000);
animate();
window.addEventListener('resize', onWindowResize, false);

let dragged = false;
let mouseDown = false
document.addEventListener('mousedown', evt => mouseDown = true);
document.addEventListener('mousemove', evt => dragged = mouseDown);
document.addEventListener('click', function(evt){
    if(!dragged){
        if(ionosonde.hover){
            info.select('ionosonde');
        } else if(cubesat.hover){
            info.select('cubesat');
        } else if (ionosphere.hover){
            info.select('ionosphere');
        }
    }
    mouseDown = dragged = false;
})
console.log('scene', scene);
import "./styles.css";

// document.getElementById("cubesat").addEventListener("click", () => {
//     info.select("cubesat");
// });
