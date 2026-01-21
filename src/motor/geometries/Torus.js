import { TorusGeometry, Mesh } from 'three';

import { MathTool, torad, todeg } from '../../core/MathTool.js';
import { ChamferBox } from '../../3TH/Geometry.js';
import { BoxHelper } from '../../3TH/helpers/BoxHelper.js'

let Nb = 0

export class Torus {

	constructor ( o = {}, motor ) {

		this.motor = motor;

		this.isCompound = true;
		this.remplace = o.remplace || false;


		this.radius = o.r1 || 5
		this.tube = o.r2 || 0.5
		
		this.seg = o.s1 || 24
		this.tubeSeg = o.s2 || 16

		this.init(o);

	}

	init ( o = {} ) {

		const data = [];

		if(!o.material) o.material = o.mass ? 'body' : 'solid'

		let isDebug = o.material === 'debug'

		let r = this.radius
		let r2 = this.tube
		let d = (2*(r+r2)*Math.PI)/this.seg
		let size = [r2, d]
		
		let angle = 360 / this.seg
		let midAngle = angle*0.5 

		
		
		let geometry = new TorusGeometry( r, r2, this.tubeSeg, this.seg );
		geometry.rotateX(90*torad)
		//geometry.rotateY(midAngle*torad)
		let mesh = new Mesh( geometry );

		let i = this.seg 
		let a = angle*0.5
		let a2 = a+angle

		// find good distance
		let p1 = { x:r * Math.sin(a*torad), y:0, z:r * Math.cos(a*torad) }
		let p2 = { x:r * Math.sin(a2*torad), y:0, z:r * Math.cos(a2*torad) }
		let middle = {x:(p1.x+p2.x)/2, y:0, z:(p1.z+p2.z)/2}
		let dd = Math.sqrt( middle.x * middle.x + middle.z * middle.z );


		while(i--){

			data.push({ type:'cylinder', pos:[ dd * Math.sin(a*torad), 0, dd * Math.cos(a*torad)], size:size, rot:[0,a,-90], seg:this.tubeSeg });
			a += angle

		}


		this.m = this.motor.add({
			...o,
			mesh:isDebug? null:mesh,
			shapes:data,
	        type:'compound',
	        //ray:false,
	    });
		

		
	}

}