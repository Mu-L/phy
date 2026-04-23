import {
	Quaternion,
    VectorKeyframeTrack, QuaternionKeyframeTrack, AnimationClip, Skeleton,
} from 'three';



export const AnimPack = {

	convertAnimation: (anim) => {

		const name = anim.name
		const baseTracks = anim.tracks
        const lng = baseTracks.length

        const tracks = [];
        let t, k=0, first, last, v
        let basePosition = [0,0.9167,-0.8]


        let i = lng

        while(i--){
            t = baseTracks[k];
            v = t.values
            first = t.name.substring(0, t.name.lastIndexOf('.') );
            last = t.name.substring(t.name.lastIndexOf('.') );

            if( transpack[first] ){ 
                first = transpack[first]

                if(first === 'hip' && last === '.position'){
                    v = AnimPack.addPosTrack( v, basePosition );
                    tracks.push( new VectorKeyframeTrack( first+last, t.times, v ) );
                }

                if(last === '.quaternion'){
                    if(rotate[first]) v = AnimPack.rotateTrack(v, rotate[first])
                    tracks.push( new QuaternionKeyframeTrack( first+last, t.times, v ) );
                }

            }

            k++;
        }

        const clip = new AnimationClip( name, -1, tracks );
        clip.duration = anim.duration;

        return clip

	},

	rotateTrack:( v, r = [0,0,0] ) => {

		let qt = new Quaternion().fromArray(AnimPack.quatFromEuler(r));
        let q = new Quaternion()
        let rq = []
        let j = v.length / 4, n 
        while(j--){
            n = j * 4
            q.set(v[n], v[n+1], v[n+2], v[n+3]).premultiply( qt );
            //q.set(v[n], v[n+1], v[n+2], v[n+3]).multiply( qt );
            q.toArray( rq, n );
        }
        return rq

	},

	addPosTrack:( v, v2 ) => {

		let p = [], n = 0
        let j = v.length / 3
        while(j--){
            n = j * 3
            p[n] = v[n] + v2[0]
            p[n+1] = v[n+1] + v2[1]
            p[n+2] = v[n+2] + v2[2]
        }
        return p
	},

	quatFromEuler:( r = [0,0,0] ) => {

		const torad = Math.PI / 180
        const cos = Math.cos;
        const sin = Math.sin;
        const n = torad// : 1 
        const x = (r[0]*n) / 2, y = (r[1]*n) / 2, z = (r[2]*n) / 2
        const c1 = cos( x ), c2 = cos( y ), c3 = cos( z );
        const s1 = sin( x ), s2 = sin( y ), s3 = sin( z );
        const order = r[3] || 'XYZ'

        let _x, _y, _z, _w

        switch ( order ) {

            case 'XYZ':
                _x = s1 * c2 * c3 + c1 * s2 * s3;
                _y = c1 * s2 * c3 - s1 * c2 * s3;
                _z = c1 * c2 * s3 + s1 * s2 * c3;
                _w = c1 * c2 * c3 - s1 * s2 * s3;
                break;

            case 'YXZ':
                _x = s1 * c2 * c3 + c1 * s2 * s3;
                _y = c1 * s2 * c3 - s1 * c2 * s3;
                _z = c1 * c2 * s3 - s1 * s2 * c3;
                _w = c1 * c2 * c3 + s1 * s2 * s3;
                break;

            case 'ZXY':
                _x = s1 * c2 * c3 - c1 * s2 * s3;
                _y = c1 * s2 * c3 + s1 * c2 * s3;
                _z = c1 * c2 * s3 + s1 * s2 * c3;
                _w = c1 * c2 * c3 - s1 * s2 * s3;
                break;

            case 'ZYX':
                _x = s1 * c2 * c3 - c1 * s2 * s3;
                _y = c1 * s2 * c3 + s1 * c2 * s3;
                _z = c1 * c2 * s3 - s1 * s2 * c3;
                _w = c1 * c2 * c3 + s1 * s2 * s3;
                break;

            case 'YZX':
                _x = s1 * c2 * c3 + c1 * s2 * s3;
                _y = c1 * s2 * c3 + s1 * c2 * s3;
                _z = c1 * c2 * s3 - s1 * s2 * c3;
                _w = c1 * c2 * c3 - s1 * s2 * s3;
                break;

            case 'XZY':
                _x = s1 * c2 * c3 - c1 * s2 * s3;
                _y = c1 * s2 * c3 - s1 * c2 * s3;
                _z = c1 * c2 * s3 + s1 * s2 * c3;
                _w = c1 * c2 * c3 + s1 * s2 * s3;
                break;

        }

        return [ _x, _y, _z, _w ]

	},
}

const rotate = {
    hip:[-15,0,0],
    rThigh:[180+15,0,0],
    lThigh:[180+15,0,0],

    //rShin:[180,0,0],
    //lShin:[180,0,0],

    rFoot:[55,0,0],
    lFoot:[55,0,0],
    rToes:[-30,180,0],
    lToes:[-30,180,0],

    rCollar:[30,-45,0],
    lCollar:[30,45,0],

    rShldr:[0,90,0],
    lShldr:[0,-90,0],
}

const transpack = {

    pelvis:'hip',
    spine_01 : 'abdomen',
    spine_02 : 'abdomen2',
    spine_03 : 'chest',
    neck_01: 'neck',
    Head : 'head',

    // LEG
    thigh_r:'rThigh',
    calf_r:'rShin',
    foot_r:'rFoot',
    ball_r:'rToes',

    thigh_l:'lThigh',
    calf_l:'lShin',
    foot_l:'rFoot',
    ball_l:'lToes',

    //ARM
    clavicle_r:'rCollar',
    upperarm_r:'rShldr',
    lowerarm_r:'rForeArm',
    hand_r:'rHand',

    clavicle_l:'lCollar',
    upperarm_l:'lShldr',
    lowerarm_l:'lForeArm',
    hand_l:'lHand',

    //HAND

}