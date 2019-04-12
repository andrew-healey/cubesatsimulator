import * as THREE from 'three';
import {
    Interaction
} from 'three.interaction';

export default class Cubesat {
    constructor(scene, earth) {
        this.earth = earth;
        this.cube = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.25, 0.25),
            new THREE.MeshBasicMaterial({
                color: 0x888888
            }),
        );
        this.cube.position.y = 1.5;

        scene.add(this.cube);
        console.log(scene);
    }

    update(t) {
        this.cube.position.z = -Math.sin(t / 10000) * 1.5;
        this.cube.position.y = -Math.cos(t / 10000) * 1.5;
        this.cube.lookAt(this.earth.position);
    }
}