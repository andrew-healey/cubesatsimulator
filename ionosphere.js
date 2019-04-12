import * as THREE from "three";
import hsv from "hsv2rgb";
import SimplexNoise from "open-simplex-noise";
//TODO Make this fetch information from blair3sat.com or something.
export default class Ionosphere {
    randomNumArr(l, bottom, top) {
        return new Array(l).fill().map(i => Math.floor(Math.random() * (top - bottom)) - bottom);
    }
    getRadius(lat, long) {
        lat = Math.PI / 2 - Math.PI * 2 * lat;
        long = Math.PI * 2 * long;
        let r = (this.b * Math.cos(this.d * lat) + this.a * Math.sin(this.c * long))*this.altitude/100;
        let ret=(this.perlin.noise3D(...this.getCoords(this.altitude,lat/5,long/3))+1)/10+0.25;
        return ret;
        //return r/ this.altitude;
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
    constructor(scene,res, altitude) {
        [this.a, this.b] = this.randomNumArr(2, -2, 2);
        [this.c, this.d] = this.randomNumArr(2, -10, 10);

        this.perlin=new SimplexNoise(this.a+this.b+this.c+this.d);

        let physical = new THREE.BufferGeometry();
        let color=new THREE.Color();
        this.altitude=altitude;
        this.vectors = [];
        this.colors = [];
        let lastRow, newRow, r;
        //Res is the number of divisions into which the ionosphere is divided in terms of latitude
        const meshRows = () => {
            for (let colNum = 0; colNum < res; colNum++) {
                let oldPoints=lastRow.slice(colNum, colNum+2);
                let newPoints=newRow.slice(colNum, colNum+2);
                let oldCoords = oldPoints.reduce((last,next)=>[...last,...next.position],[]);
                let newCoords = newPoints.reduce((last,next)=>[...last,...next.position],[]);
                let oldColors=oldPoints.reduce((last,next)=>[...last,...next.color],[]);
                let newColors=newPoints.reduce((last,next)=>[...last,...next.color],[]);
                let toAdd = [...oldCoords, ...newCoords.slice(0, 3), ...newCoords, ...oldCoords.slice(3, 6)];
                let colorsToAdd=[...oldColors,...newColors.slice(0,4),...newColors,...oldColors.slice(4,8)];
                this.vectors.push(...toAdd);
                this.colors.push(...colorsToAdd);
            }
        }
        for (let rowNum = 0; rowNum <= res; rowNum++) {
            lastRow = newRow;
            newRow = [];
            for (let colNum = 0; colNum < res; colNum++) {
                let lat = rowNum / res;
                let long = colNum / res;
                let r = this.getRadius(lat, long,5)*2 + this.altitude;
                let c = this.getCoords(r, lat, long);
                let heat=255/(1+10*Math.pow(Math.E,-160*(r-this.altitude)));
                let color=hsv(heat,127.5,127.5,[0,0,0,25.5])
                newRow.push({position:c,color});
            }
            newRow.push(...newRow.slice(0, 1));
            if (lastRow === undefined) {
                continue;
            }
            meshRows();
        }
        // newRow=(i=>new Array(res).fill(...i))(getCoords())
        // meshRows();
        let colorAttribute = new THREE.Uint8BufferAttribute(this.colors, 4);
        colorAttribute.normalized = true;
        physical.addAttribute("position", new THREE.Float32BufferAttribute(this.vectors, 3));
        physical.addAttribute("color", colorAttribute);
        /*var material = new THREE.RawShaderMaterial( {
                        uniforms: {
                            time: { value: 1.0 }
                        },
                        side: THREE.DoubleSide,
                        transparent: true
                    } );*/
        let material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 1.0
                }
            },
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent,
            side: THREE.DoubleSide,
            transparent: true
        });
        this.ionosphere= new THREE.Mesh(physical, material);
        /*
        const meshRows = () => {
            for (let colNum = 0; colNum < res; colNum++) {
                let oldPoints = lastRow.slice(colNum, colNum + 2);
                let newPoints = newRow.slice(colNum, colNum + 2);
                let oldCoords = oldPoints.reduce((last, next) => [...last, ...["x", "y", "z"].map(e => next.position[e])], []);
                let newCoords = newPoints.reduce((last, next) => [...last, ...["x", "y", "z"].map(e => next.position[e])], []);
                let oldColors = oldPoints.reduce((last, next) => [...last, ...next.color], []);
                let newColors = newPoints.reduce((last, next) => [...last, ...next.color], []);
                let toAdd = [...oldCoords, ...newCoords.slice(0, 3), ...newCoords, ...oldCoords.slice(3, 6)];
                let colorsToAdd = [...oldColors, ...newColors.slice(0, 4), ...newColors, ...oldColors.slice(4, 8)];
                this.vectors.push(...toAdd);
              //for (let i = 0; i < 6; i++)
                this.colors.push(...colorsToAdd);
            }
        }
        for (let rowNum = 0; rowNum <= res; rowNum++) {
            lastRow = newRow;
            newRow = [];
            for (let colNum = 0; colNum < res; colNum++) {
                let lat = rowNum / res;
                let long = colNum / res;
                let r = this.getRadius(lat, long) + this.altitude;
                let c = this.getCoords(r, lat, long);
                //r=255/(1+Math.e^(-r/4));
                let heat=155/(1+100*Math.pow(Math.E,-4*r))+100;
                newRow.push({
                    position: c,
                  color: [heat, heat, heat, 10]
                });
            }
            newRow.push(...newRow.slice(0, 1));
            if (lastRow === undefined) {
                continue;
            }
            meshRows();
        }
        let colorAttribute = new THREE.Uint8BufferAttribute(this.colors, 4);
        colorAttribute.normalized = true;
        physical.addAttribute("position", new THREE.Float32BufferAttribute(this.vectors, 3));
        physical.addAttribute("color", colorAttribute);
        this.material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 1.0
                }
            },
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent,
            side: THREE.DoubleSide,
            transparent: true
        });
        this.ionosonde = new THREE.Mesh(physical, this.material);
        */
        this.scene=scene;
        scene.add(this.ionosphere);
    }

}
