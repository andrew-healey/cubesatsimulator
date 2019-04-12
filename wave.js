import * as THREE from 'three';
export default class Wave {
    constructor(earth, ionosphere, lat, long, resolution, directivity) {
        this.resolution = resolution;
        this.earth = earth;
        this.ionosphere = ionosphere;
        this.origin = new THREE.Vector3(...this.getCoords(1, lat, long));
        this.lat = lat;
        this.long = long;
        this.lifetime = 0;
        this.locus = new Array(resolution).fill(0).map((i, rowNum) => new Array(resolution).fill(0).map((e, ptNum) => {
            let ret = {
                lat: lat + directivity * (rowNum / this.resolution - 0.5),
                long: long + directivity * (ptNum / this.resolution / 0.5),
            };
            let coords = new THREE.Vector3(...this.getCoords(1, ret.lat, ret.long));
            //   coords.x=temp[0];coords.y=temp[1];coords.z=temp[2];
            ret = {
                //Makeshift orientation - How do I do directions?
                direction: coords,
                x: coords.x,
                y: coords.y,
                z: coords.z,
                visible: true
            };
            return ret;
        }));
        this.material = new THREE.PointsMaterial({color:0xFFF});
        this.positions = new Float32Array(this.resolution ** 2 * 3);
        this.scales=new Float32Array(this.resolution**2);
        this.geometry = new THREE.BufferGeometry();
        this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions), 3);
        this.geometry.addAttribute("scale",new THREE.BufferAttribute(this.scales,3));
        this.geom = new THREE.Points(this.geometry, this.material);
        this.update(50);
        this.cubeStart = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial({
            color: "gray"
        }));
    }
    update(dt) {
        //Until it stops crashing, use this
        //return;
        //TODO implement hitting ionosondes
        if (this.stop) {
            return;
        } else if (dt > 1000) this.stop = true;
        this.lifetime += dt;
        let caster = new THREE.Raycaster(this.origin, this.origin, 0.1, 10);
        let rowNum = 0;
        //console.log(dt,"is dt");
        let newLocus = this.geom.geometry.attributes.position.array;
        let scales=this.geom.geometry.attributes.scale.array;
        for (let row of this.locus) {
            let ptNum = 0;
            for (let point of row) {
                //console.log((rowNum*this.resolution+ptNum)/this.resolution^2);
                let distanceToTravel = this.lifetime / 10000;
                if (!point.visible) distanceToTravel = 0;
                let timesThrough = 0;
                timesThrough++;
                let tempValues={...point};
                while (distanceToTravel > 0) {
                    let earthHit = caster.intersectObject(this.earth.earth); //Of type mesh
                    let finalVector;
                    let index = (rowNum * this.resolution + ptNum) * 3;
                    let sphereHit = caster.intersectObject(this.ionosphere.ionosphere); //Also of type mesh, but using a buffer
                    if (sphereHit.length > 0 && sphereHit[0].distance <= this.lifetime) {
                        tempValues.origin = sphereHit[0].distance;
                        distanceToTravel -= sphereHit[0].distance;
                        let newDirection = sphereHit[0].point.addScaledVector(tempValues.direction.negate(), 2);
                        caster.set(sphereHit[0].point, newDirection);
                        finalVector = sphereHit[0].point.addScaledVector(newDirection, dt);
                        continue;
                    } else {
                        finalVector=new THREE.Vector3(tempValues.x,tempValues.y,tempValues.z).addScaledVector(point.direction,dt/1000);
                    }
                    newLocus[index] = finalVector.x;
                    newLocus[index + 1] = finalVector.y;
                    newLocus[index + 2] = finalVector.z;
                    scales[index]=finalVector.x;
                    scales[index+1]=finalVector.y;
                    scales[index+2]=finalVector.z;
                    break;
                }
                ptNum++;
            }
            rowNum++;
        }
        console.log(this.geom.geometry.attributes.position);
        this.geom.geometry.attributes.position.needsUpdate = true;
        this.geom.geometry.attributes.scale.needsUpdate=true;
    }
    isTouching() {

    }
    getCoords(radius, lat, long) {
        lat = Math.PI / 2 - Math.PI * lat;
        long = Math.PI * 2 * long;
        return [
            radius * Math.cos(long) * Math.abs(Math.cos(lat)),
            radius * Math.sin(long) * Math.abs(Math.cos(lat)),
            radius * Math.sin(lat)
        ];
    }
}