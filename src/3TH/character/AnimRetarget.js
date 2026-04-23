import {
	Vector3, Quaternion, Matrix4, Euler, Color,
    VectorKeyframeTrack, QuaternionKeyframeTrack, AnimationClip, Skeleton, AnimationMixer, SkeletonHelper
} from 'three';

import { Pool } from '../Pool.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

export const AnimRetarget = {

	sceneRef:null,
	skinRef:null,
	//clipRef:null,
	avatar:null,
	options:null,

	importPack: ( url, debug, avatar ) => {

		AnimRetarget.avatar = avatar;

		AnimRetarget.options = {
            preserveBoneMatrix:true,
            preserveBonePositions:true,
            useTargetMatrix:false,
		 	// specify the name of the source's hip bone.
            hip: 'pelvis',
            // preserve the scale of the target model
            scale: 1,
            //hipPosition:new Vector3( 0, 0.05053, 0.0501 ),
            hipPosition:new Vector3( 0, 0, 0 ),
            hipInfluence: new Vector3( 1, 1, 1 ),
            localOffsets:AnimRetarget.getLocalOffsets(),
            fps:30,
            // Map of target's bone names to source's bone names -> { targetBoneName: sourceBoneName }
            getBoneName: ( bone ) => ( boneMap[bone.name] ),
            

		}

		// console.log( AnimRetarget.options )

		AnimRetarget.avatar.stop()
		let name = url.substring( url.lastIndexOf('/')+1, url.lastIndexOf('.') );

        Pool.loaderGLTF().load( url, function ( glb ) {

            console.log(name, "is loaded")


            AnimRetarget.sceneRef = glb.scene
            //AnimRetarget.clipRef = glb.animations

            glb.scene.traverse( ( child ) => {
            	if( child.isSkinnedMesh && AnimRetarget.skinRef === null ) AnimRetarget.skinRef = child; 
            })

            for(let i in glb.animations){

            	AnimRetarget.convertClip( glb.animations[i] )

            }

            if(debug) AnimRetarget.addDebugSkeleton(glb)

            //console.log("skin:", AnimRetarget.skinRef)
            //console.log("clip:", AnimRetarget.clipRef)

        })

	},

	addDebugSkeleton:( m )=>{

		const avatar = AnimRetarget.avatar;

		const animations = m.animations
        const mixer = new AnimationMixer( m.scene )
        //model.mixer = mixer
        const actions = new Map()
        let acc
        for ( let i = 0; i < animations.length; i ++ ) {
            let anim = animations[ i ];
            acc = mixer.clipAction( anim );
            acc.play()
            acc.setEffectiveWeight( 0 );
            actions.set( anim.name, acc )
        }

        let helper = new SkeletonHelper( m.scene );
        helper.setColors(new Color( 0xff00ff ), new Color( 0xff9000 ))
        avatar.add(helper)
        avatar.add(m.scene)
        m.scene.visible = false

        avatar.extraAction = actions
        avatar.extraMixer = mixer
	},

	getLocalOffsets:()=>{

		const armL = ['lShldr', 'lForeArm', 'lHand']
		const armR = ['rShldr', 'rForeArm', 'rHand']
		const torad = Math.PI / 180
		const loc = {}
		let f 

		for(let b in boneMap){
			if( rotate[b] ) loc[b] = new Matrix4().makeRotationFromEuler( new Euler( rotate[b][0]*torad, rotate[b][1]*torad, rotate[b][2]*torad ) );
			else{
				if(armL.indexOf(b)!==-1) loc[b] = new Matrix4().makeRotationFromEuler( new Euler( rotate.lArm[0]*torad, rotate.lArm[1]*torad, rotate.lArm[2]*torad ) );
				else if(armR.indexOf(b)!==-1) loc[b] = new Matrix4().makeRotationFromEuler( new Euler( rotate.rArm[0]*torad, rotate.rArm[1]*torad, rotate.rArm[2]*torad ) );
				else {
					f = b.substring(0,1)
					if(f==='r') loc[b] = new Matrix4().makeRotationFromEuler( new Euler( rotate.rFinger[0]*torad, rotate.rFinger[1]*torad, rotate.rFinger[2]*torad ) );
					else loc[b] = new Matrix4().makeRotationFromEuler( new Euler( rotate.lFinger[0]*torad, rotate.lFinger[1]*torad, rotate.lFinger[2]*torad ) );
				}
			} 
		}
		return loc

	},

	convertClip: ( Clip ) => {

		const name = Clip.name;

		if(name === 'A_TPose') console.log(Clip)

		const autoplay = false;
		const avatar = AnimRetarget.avatar
		const targetSkin = avatar.mesh[avatar.ref.skeletonRef];
		const sourceSkin = AnimRetarget.skinRef
		const options = AnimRetarget.options

		const clip = SkeletonUtils.retargetClip( targetSkin, sourceSkin, Clip, options );
		//clip.duration = Clip.duration;

		const tracks = clip.tracks
        let i = tracks.length
        let t, n, last 

        // lighter
        while(i--){
        	t = tracks[i].name 
        	n = t.substring( t.lastIndexOf('[')+1, t.lastIndexOf(']') );
        	last = t.substring(t.lastIndexOf('.') );
        	tracks[i].name = n + last
        }

        clip.optimize();

		avatar.addClip( clip );
        avatar.addAction( clip, autoplay )

	}

}

const rotate = {

    hip:[90,0,0],
    abdomen:[90-7,0,0],
    abdomen2:[90,0,0],
    //chest:[90-7,0,0],
    chest:[90,0,0],
    //neck:[90+20,0,0],
    neck:[90+15,0,0],
    head:[90+10,0,0],

    // leg
    rThigh:[-90,0,0],
    lThigh:[-90,0,0],
    rShin:[-90,0,0],
    lShin:[-90,0,0],
    /*rThigh:[-90+5,0,0],
    lThigh:[-90+5,0,0],
    rShin:[-90+5,0,0],
    lShin:[-90+5,0,0],*/
    rFoot:[-30,0,0],
    lFoot:[-30,0,0],
    rToes:[0,180,0],
    lToes:[0,180,0],

    // arm
    //rCollar:[90,-90+22,9],
    //lCollar:[90,90-22,-9],
    //rCollar:[90,-90+23,2],
    ///lCollar:[90,90-23,-2],
    rCollar:[90,-90+27, 0],
    lCollar:[90,90-27, 0],

    // generic
    rArm:[90,-90-4,2],
    lArm:[90,90+4,2],
    //rArm:[90,-90,0],
    //lArm:[90,90,0],
    rHand:[90,-90+10,-4],
    lHand:[90,90-10,4],
    rFinger:[0,0,-90],
    lFinger:[0,0,90],

}

const boneMap = {

    hip:'pelvis',
    abdomen:'spine_01',
    abdomen2:'spine_02',
    chest:'spine_03',
    neck:'neck_01',
    head:'Head',
    // leg
    rThigh:'thigh_r',
    rShin:'calf_r',
    rFoot:'foot_r',
    rToes:'ball_r',
    lThigh:'thigh_l',
    lShin:'calf_l',
    lFoot:'foot_l',
    lToes:'ball_l',
    // arm
    rCollar:'clavicle_r',
    rShldr:'upperarm_r',
    rForeArm:'lowerarm_r',
    rHand:'hand_r',
    lCollar:'clavicle_l',
    lShldr:'upperarm_l',
    lForeArm:'lowerarm_l',
    lHand:'hand_l',
    // hand r
    rThumb1:'thumb_01_r', rThumb2:'thumb_02_r', rThumb3:'thumb_03_r',
    rIndex1:'index_01_r', rIndex2:'index_02_r', rIndex3:'index_03_r',
    rMid1:'middle_01_r', rMid2:'middle_02_r', rMid3:'middle_03_r',
    rRing1:'ring_01_r', rRing2:'ring_02_r', rRing3:'ring_03_r',
    rPinky1:'pinky_01_r', rPinky2:'pinky_02_r', rPinky3:'pinky_03_r',
    // hand l
    lThumb1:'thumb_01_l', lThumb2:'thumb_02_l', lThumb3:'thumb_03_l',
    lIndex1:'index_01_l', lIndex2:'index_02_l', lIndex3:'index_03_l',
    lMid1:'middle_01_l', lMid2:'middle_02_l', lMid3:'middle_03_l',
    lRing1:'ring_01_l', lRing2:'ring_02_l', lRing3:'ring_03_l',
    lPinky1:'pinky_01_l', lPinky2:'pinky_02_l', lPinky3:'pinky_03_l',

}