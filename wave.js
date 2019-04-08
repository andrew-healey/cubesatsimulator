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
    this.positions = new Float32Array(this.resolution ^ 2*3);
    // this.update();
    this.cubeStart=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.1),new THREE.MeshBasicMaterial({color:"gray"}));
  }
  update(dt) {
    //Until it stops crashing, use this
    //return;
    //TODO implement hitting ionosondes
    console.log("Starting update");
    if (this.stop) {
      return;
    } else if (dt > 1000) this.stop = true;
    this.lifetime += dt;
    let caster = new THREE.Raycaster(this.origin, this.origin, 0.1, 10);
    let rowNum = 0;
    for (let row of this.locus) {
      let ptNum = 0;
      for (let point of row) {
        //console.log((rowNum*this.resolution+ptNum)/this.resolution^2);
        let distanceToTravel = this.lifetime / 10000;
        if (!point.visible) distanceToTravel = 0;
        let timesThrough=0;
        timesThrough++;
        while (distanceToTravel > 0) {
          let earthHit = caster.intersectObject(this.earth.earth); //Of type mesh
          let sphereHit = caster.intersectObject(this.ionosphere.ionosphere); //Also of type mesh, but using a buffer
          if (sphereHit.length > 0 && sphereHit[0].distance <= this.lifetime) {
            point.origin = sphereHit[0].distance;
            distanceToTravel -= sphereHit[0].distance;
            let newDirection = sphereHit[0].point.addScaledVector(direction.negate(),2);
            caster.set(sphereHit[0].point, newDirection);
            continue;
          }
          let index=(rowNum*this.resolution+ptNum)*3;
          console.log("sphereHit ",sphereHit);
          this.positions[index]=sphereHit[0].point.addScaledVector(newDirection,dt);
          break;
        }
        ptNum++;
      }
      rowNum++;
    }
    console.log("hey there");
  }
  isTouching() {

  }
  render() {
    let buf = new THREE.BufferGeometry();
    let points = [];
    for (let row of this.locus) {
      for (let point of row) {
        console.log(points.x, points.y, points.z);
        for (let i = 0; i < 3; i++) points.push(points.x, point.y, point.z);
      }
    }
    buf.addAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    this.geom = new THREE.Points(buf, this.material);
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
