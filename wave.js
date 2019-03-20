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
        this.locus = new Array(resolution).fill(0).map((i, rowNum) => new Array(resolution).fill(0).map((e, ptNum) => {
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
        // this.update();
    }
    update(dt) {
        //Until it stops crashing, use this
        return;
        //TODO implement hitting ionosondes
        if(this.stop){
            return;
        }
        else if(dt<1000) this.stop=true;
        this.lifetime += dt;
        let caster = new THREE.Raycaster(this.origin, this.origin, 0.1, 10);
        for (let row of this.locus) {
            for (let point of row) {
                let distanceToTravel = this.lifetime / 10000;
                if (!point.visible) distanceToTravel = 0;
                while (distanceToTravel > 0) {
                    let earthHit = caster.intersectObject(this.earth.earth);
                    console.log(earthHit);
                    let sphereHit = caster.intersectObject(this.ionosphere.ionosphere);
                    if (sphereHit.length > 0 && sphereHit[0].distance <= this.lifetime) {
                        point.origin = sphereHit[0].distance;
                        distanceToTravel -= sphereHit[0].distance;
                        //How to do this? This code is just a placeholder
                        let newDirection = direction.addScaledVector(sphereHit[0].point.negate(),2);
                        caster.set(sphereHit[0].point, newDirection);
                        continue;
                    }
                    break;
                }
                row.push(point);
            }
            this.locus.push(row);
        }
        // this.render();
    }
    isTouching() {

    }
    render() {
        let buf = new THREE.BufferGeometry();
        let points = [];
        for (let row of this.locus) {
            for (let point of row) {
                console.log(points.x,points.y,points.z);
              for(let i=0;i<3;i++) points.push(points.x,point.y,point.z);
            }
        }
        buf.addAttribute("position",new THREE.Float32BufferAttribute(points, 3));
        this.geom = new THREE.Points(buf, this.material);
        console.log(this.geom);
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
