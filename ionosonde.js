import * as THREE from 'three';
import Wave from './wave';

export default class Ionosonde {
  constructor(scene, earth, ionosphere, lat, long, waves) {
    this.hover = false;

    this.ionosphere = ionosphere;
    this.radius = 1;
    this.earth = earth;
    this.waves = waves;
    this.period = 0;
    this.pos = this.getCoords(this.radius, lat, long);
    this.model = new THREE.BufferGeometry();
    let tr = 0.1;
    let vertices = [
      [-tr, tr * Math.sqrt(3) / 4, 0],
      [tr / 2, tr * Math.sqrt(3) / 4, tr * Math.sqrt(3) / 2],
      [tr / 2, tr * Math.sqrt(3) / 4, -tr * Math.sqrt(3) / 2],
      [0, -tr, 0]
    ];
    let faces = [
      vertices[0], vertices[1], vertices[2],
      vertices[0], vertices[1], vertices[3],
      vertices[0], vertices[2], vertices[3],
      vertices[1], vertices[2], vertices[3]
    ].reduce((last, next) => [...last, ...next], []);
    this.model.addAttribute("position", new THREE.Float32BufferAttribute(faces, 3))
    let material=new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      side: THREE.DoubleSide
    });
    let model=new THREE.Group();
    let stand=new THREE.CubeGeometry(this.radius/8,this.radius,this.radius/8);
    stand=new THREE.Mesh(material,stand);
    let perp=new THREE.CubeGeometry(this.radius/2,this.radius/8,this.radius/8)
    perp.position.set(new THREE.Vector3(0,this.radius,0));
    perp=new THREE.Mesh(perp,material);
    model.add(stand,perp);
    for(let i=0;i<5;i++){
      let newRod=new THREE.CubeGeometry(this.radius/8,this.radius/8,this.radius/3);
      newRod.position.set(new THREE.Vector3(this.radius/4*(i-2),this.radius,0));
      model.add(new THREE.Mesh(newRod,material));
    }
    this.geom = model;
    this.geom.position.x = this.pos.x;
    this.geom.position.y = this.pos.y;
    this.geom.position.z = this.pos.z;
    this.geom.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(this.geom);
    let wave=new Wave(this.earth, this.ionosphere, this.lat, this.long, 10, Math.PI / 4);
    this.waves.push(wave);
    scene.add(wave.geom);
    console.log("Updated first wave");
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
  update(dt) {
    this.period += dt;
    if (this.geom.material.color > 0) {
      this.geom.material.color -= 0x010101;
    }
    if (this.period >= 2000) {
      this.period %= 2000;
      //Sound
    }
      for (let wave of this.waves) {
      if (wave.isTouching(this)) {
        this.geom.material.color.set(0x00FF00);
      }
    }
  }
}
