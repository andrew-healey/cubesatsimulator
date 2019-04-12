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

let lables = {
    cubesat: document.getElementById('cubesat-indicator'),
    // ionosphere: document.
}


class Thing {
    constructor(name, text = "", title="") {
        this.name = name;
        this.html = text;
        this.title = title;
    }

    init(canvas) {
        // console.log(canvas);
        this.canvas = canvas;
        // this.context = canvas.getContext("2d");
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
        super("cubesat", `
            A CubeSat is a square - shaped miniature satellite(10 cm x 10 cm x 10 cm— roughly the size of a Rubik 's cube), weighing about 1 kg. A CubeSat can be used alone (1 unit) or in groups of multiple units (maximum 24 units)

            CubeSats can carry small science instruments to conduct an experiment or take measurements from space.

            CubeSats can provide students with a unique hands - on experience in developing space missions from design, to launch and operations.

            CubeSats tend to hitch a ride into space using extra space available on rockets. They are packed in a container which, with the push of a button, activates a spring that ejects the CubeSats into space. CubeSats can also be deployed from the International Space Station by using the same technique from the airlock in the Japanese module. Like other satellites, they can be flown alone or in a constellation network.

            CubeSats are revolutionizing access to space: developers and users are eagerly taking advantage of this new platform to increase research and development activities conducted in space.

            CubeSats are even being used
            for interplanetary missions: NASA 's Mars Cube One (MarCO) embarked on a mission to Mars in May 2018.
            MarCO, sh, demonstrated the ability of small satellites to explore deep space and provided real - time information in support of critical landing operations on a distant world.
        `, "The Cubesat");
        this.running = false;
    }

    init(canvas){
        super.init.call(this, canvas);
        if(this.canvas){
            console.log(this.canvas);
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas
            });
            this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);


            this.camera = new THREE.PerspectiveCamera();
            this.scene = new THREE.Scene();
            this.cubesat = new Cubesat(this.scene, null);

            this.camera.position.set(2, 2, 2);
            this.camera.lookAt(this.cubesat.cube.position);            

            // this.renderer.domElement = this.canvas;
        }
    }

    animate(dt) {
        this.renderer.render(this.scene, this.camera);
    }
}
class IonosondeThing extends Thing {
    constructor() {
        super("ionosonde", `
            An ionosonde or ionospheric sounder(colloq.chirpsounder), is a specialized radar system
            for the examination of the ionosphere.An ionosonde is used
            for finding the optimum operation frequencies
            for broadcasts or two - way communications in the high frequency range.(1)

            An ionosonde consists of:

            A high frequency(HF) transmitter, automatically tunable over a wide range.Typically the frequency coverage is 0.5– 23 MHz or 1– 40 MHz, though normally sweeps are confined to approximately 1.6– 12 MHz.
            A tracking HF receiver which can automatically track the frequency of the transmitter.
            An antenna with a suitable radiation pattern, which transmits well vertically upwards and is efficient over the whole frequency range used.
            Digital control and data analysis circuits.
            The transmitter sweeps all or part of the HF frequency range, transmitting short pulses.These pulses are reflected at various layers of the ionosphere, at heights of 100– 400 km, and their echoes are received by the receiver and analyzed by the control system.
            
            The controller measures the time delay between transmitting a pulse and receiving its echo back from the ionosphere.This delay can be converted into a height.
            The final output of the ionosonde is in the form of a graph termed an ionogram, which is a plot of ionospheric echoes as a
            function of height and frequency.An example is shown below.
            An ionogram may then be used to compute a plot of the density of the plasma throughout the ionosphere.
            An ionosonde is not only used in scientific research to measure and monitor the ionosphere.It is also used to support many applications that rely on or are affected by the ionosphere.These include shortwave broadcasting and high frequency communication, over the horizon radar systems and signal location(direction - finding), satellite communication and navigation, and radio astronomy.

            More info/Sources:
            <br><a href="https://www.spaceacademy.net.au/spacelab/tools/ionosonde.htm>https://www.spaceacademy.net.au/spacelab/tools/ionosonde.htm</a>
        `, "An Ionosonde");
        this.running = false;
    }

    animate(dt) {
        // this.context.fillStyle = "#00ff00";
        // this.context.fillRect(0, 0, 100, 100);
    }
}


class IonosphereThing extends Thing {
    constructor() {
        super("ionosphere", `
                Ionosphere

                The Ionosphere is part of Earth’ s upper atmosphere, between 80 and about 600 km where Extreme UltraViolet(EUV) and x - ray solar radiation ionizes the atoms and molecules thus creating a layer of electrons.The ionosphere is important because it reflects and modifies radio waves used
                for communication and navigation.Other phenomena such as energetic charged particles and cosmic rays also have an ionizing effect and can contribute to the ionosphere.

                The atmospheric atoms and molecules are impacted by the high energy the EUV and X - ray photons from the sun.The amount of energy(photon flux) at EUV and x - ray wavelengths varies by nearly a factor of ten over the 11 year solar cycle.The density of the ionosphere changes accordingly.Due to spectral variability of the solar radiation and the density of various constituents in the atmosphere, there are layers are created within the ionosphere, called the D, E, and F - layers.Other solar phenomena, such as flares, and changes in the solar wind and geomagnetic storms also effect the charging of the ionosphere.Since the largest amount of ionization is caused by solar irradiance, the night - side of the earth, and the pole pointed away from the sun(depending on the season) have much less ionization than the day - side of the earth, and the pole pointing towards the sun.
                < br >
                The ionosphere has major importance to us because, among other functions, it influences radio propagation to distant places on the Earth, and between satellites and Earth.For the very low frequency(VLF) waves that the space weather monitors track, the ionosphere and the ground produce a“ waveguide” through which radio signals can bounce and make their way around the curved Earth
                < br >
                Impacts
                Radio Communication
                Radio Navigation(GPS)
                Satellite Communication
                <br>
                More info/Sources:
                <a href = "https://www.swpc.noaa.gov/phenomena/ionosphere">https://www.swpc.noaa.gov/phenomena/ionosphere</a>
                <br>  <a href = "http://solar-center.stanford.edu/SID/activities/ionosphere.html" > http://solar-center.stanford.edu/SID/activities/ionosphere.html</a>
                
`, "The Ionosphere");
        this.running = false;
    }

    animate(dt) {
        // this.context.fillStyle = "#00ff00";
        // this.context.fillRect(0, 0, 100, 100);
    }
}
class WaveThing extends Thing {
    constructor() {
        super("waves", `waves are majestic beasts`);
        this.running = false;
    }

    animate(dt) {
        // this.context.fillStyle = "#00ff00";
        // this.context.fillRect(0, 0, 100, 100);
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

        this.close.addEventListener("click", (evt) => {
            this.reset();
            evt.stopPropagation()
        });
        this.element.addEventListener('click', (evt) => evt.stopPropagation());

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
            this.text.innerHTML = this.currentThing.html
                .replace('\n', '<br>')
                .replace(' ', '&nbsp;');
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

    let vector = cubesat.cube.position.clone().project(camera);
    vector.x = (vector.x + 1) / 2 * window.innerWidth;
    vector.y = -(vector.y - 1) / 2 * window.innerHeight;
    lables.cubesat.style.left = vector.x+50+'px';
    lables.cubesat.style.top = vector.y-lables.cubesat.offsetHeight/2+'px';

    renderer.render(scene, camera);
}

init();
ionosonde.update(2000);
animate();

lables.cubesat.hidden = false;
lables.cubesat.addEventListener('click', (evt) => {
    evt.stopPropagation();
    info.select('cubesat');
})

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
