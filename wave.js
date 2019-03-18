import * as THREE from 'three';
export default class Wave {
    constructor(earth, ionosphere, lat, long, resolution, directivity) {
        this.resolution = resolution;
        this.earth = earth;
        this.ionosphere = ionosphere;
        this.origin = this.getCoords(1, lat, long);
        this.lat = lat;
        this.long = long;
        this.lifetime = 0;
        this.startLocus = new Array(resolution).fill(0).map((i, rowNum) => new Array(resolution).fill(0).map((e, ptNum) => {
            let ret = {
                lat: lat + directivity * (rowNum / this.resolution - 0.5),
                long: long + directivity * (ptNum / this.resolution / 0.5),
            };
            let coords = this.getCoords(1, ret.lat, ret.long);
            ret = {
                //Makeshift orientation - How do I do directions?
                direction: coords,
                ...coords,
                visible: true
            };
            return ret;
        }));
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                color: {
                    value: new THREE.Color(0xffffff)
                },
            },
            vertexShader: document.getElementById('pointvertexshader').textContent,
            fragmentShader: document.getElementById('pointfragmentshader').textContent
        });
        this.update();
    }
    update(dt) {
        //TODO implement hitting ionosondes
        this.lifetime += dt;
        let caster = new THREE.Raycaster(this.origin, this.origin, 0.1, 10);
        this.locus = [];
        for (row of this.locus) {
            let row = [];
            for (point of row) {
                let distanceToTravel = this.lifetime / 10000;
                if (!point.visible) distanceToTravel = 0;
                while (distanceToTravel > 0) {
                    caster.set(point.origin, point.direction);
                    let earthHit = caster.intersectObject(this.earth);
                    if (earthHit.length > 0) {
                        //Destroy point
                        point.visible = false;
                        break;
                    }
                    let sphereHit = caster.intersectObject(this.ionosphere);
                    if (sphereHit.length > 0 && sphereHit[0].distance <= this.lifetime) {
                        point.origin = sphereHit[0].distance;
                        distanceToTravel -= sphereHit[0].distance;
                        //How to do this? This code is just a placeholder
                        let newDirection = direction.addScaledVector(sphereHit[0].point.negate(),2);
                        caster.set(sphereHit[0].point, newDirection);
                    }
                    distanceToTravel = 0;
                }
                locus.push(point);
            }
            locus.push(row);
        }
    }
    isTouching() {

    }
    render() {
        let buf = new THREE.BufferGeometry();
        let points = [];
        for (row of locus) {
            for (point of row) {
              for(let i=0;i<3;i++) points.push(...point.position)
            }
        }
        buf.addAttribute(new THREE.Float32BufferAttribute(points, 3));
        this.geom = new THREE.Points(buf, this.material);
    }
    getCoords(radius, lat, long) {
        lat = Math.PI / 2 - Math.PI * lat;
        long = Math.PI * 2 * long;
        return ({
            x: radius * Math.cos(long) * Math.abs(Math.cos(lat)),
            z: radius * Math.sin(long) * Math.abs(Math.cos(lat)),
            y: radius * Math.sin(lat)
        });
    }
}
