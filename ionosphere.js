import * as THREE from "three";
export default class Ionosonde {
    randomNumArr(l, bottom, top) {
        return new Array(l).fill().map(i => Math.floor(Math.random() * (top - bottom)) - bottom);
    }
    getRadius(lat, long) {
        lat = Math.PI / 2 - Math.PI * 2 * lat;
        long = Math.PI * 2 * long;
        let r = theta => (this.b * Math.cos(this.d * theta) + this.a * Math.sin(this.c * theta))*this.altitude/40;
        return r(long) * r(lat)/ this.altitude;
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
    constructor(scene,res, altitude) {
        [this.a, this.b] = this.randomNumArr(2, -2, 2);
        [this.c, this.d] = this.randomNumArr(2, -5, 5);
        let physical = new THREE.BufferGeometry();
        this.altitude=altitude;
        this.vectors = [];
        this.colors = [];
        let lastRow, newRow, r;
        //Res is the number of divisions into which the ionosphere is divided in terms of latitude
        const meshRows = () => {
            for (let colNum = 0; colNum < res; colNum++) {
                let oldPoints=lastRow.slice(colNum, colNum+2);
                let newPoints=newRow.slice(colNum, colNum+2);
                let oldCoords = oldPoints.reduce((last,next)=>[...last,...["x","y","z"].map(e=>next.position[e])],[]);
                let newCoords = newPoints.reduce((last,next)=>[...last,...["x","y","z"].map(e=>next.position[e])],[]);
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
                let r = this.getRadius(lat, long,5) + this.altitude;
                let c = this.getCoords(r, lat, long);
                let heat=255/(1+10*Math.pow(Math.E,-160*(r-this.altitude)));
                newRow.push({position:c,color:[heat,0,255-heat,51]});
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
        this.ionosonde= new THREE.Mesh(physical, material);
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
        scene.add(this.ionosonde);
    }

}
