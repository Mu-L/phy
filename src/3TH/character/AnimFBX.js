import {
	Quaternion, Euler, Vector3, 
    VectorKeyframeTrack, QuaternionKeyframeTrack, AnimationClip, Skeleton,
} from 'three';

const torad = Math.PI / 180
const p = new Vector3();
const q = new Quaternion();
const e = new Euler()

export const AnimFBX = {

	convertAnimation: ( anim, LockPosition ) => {

		const name = anim.name
		const baseTracks = anim.tracks
        const lng = baseTracks.length
        const tracks = [];

        const lockPosition = LockPosition || false;

        let t, first, last, v, j, n

        let adjustment = {}
        for(let h in rotate){
            e.set(rotate[h][0]*torad, rotate[h][1]*torad, rotate[h][2]*torad)
            adjustment[h] = new Quaternion().setFromEuler(e);
        }

        let i = lng, k=0

        while(i--){

            t = baseTracks[k];
            first = t.name.substring(0, t.name.lastIndexOf('.') );
            last = t.name.substring(t.name.lastIndexOf('.') )
            //if( t.name === 'hip.scale' ) console.log(t.values)
            if( t.name === 'hip.position' ){
            //if( last === '.position' && first !== 'Root' ){
                let rp = []
                j = t.values.length / 3;
                while(j--){
                    n = j * 3;
                    if( lockPosition ) p.set( t.values[n], t.values[n+1], 0).multiplyScalar(0.01);
                    else p.set( t.values[n], t.values[n+1], t.values[n+2]).multiplyScalar(0.01)
                    p.toArray( rp, n );
                }
                tracks.push( new VectorKeyframeTrack( t.name, t.times, rp ) );

            } else {

                if( last === '.quaternion' && first !== 'Root' ){
                    let rq = []
                    j = t.values.length / 4 
                    while(j--){
                        n = j * 4
                        q.set(t.values[n], t.values[n+2], -t.values[n+1], t.values[n+3]);
                        if(adjustment[first]) q.premultiply( adjustment[first] )
                        q.toArray( rq, n );
                    }
                    tracks.push( new QuaternionKeyframeTrack( t.name, t.times, rq ) );
                }

            }
            k++;
        }

        const clip = new AnimationClip( name, -1, tracks );
        clip.duration = anim.duration;

        //clip.optimize()

        return clip

	},

    convertAnimation2: ( anim, LockPosition ) => {

        const name = anim.name
        const baseTracks = anim.tracks
        const lng = baseTracks.length
        const tracks = [];

        const lockPosition = LockPosition || false;

        let t, first, last, v, j, n

        let adjustment = {}
        for(let h in rotate2){
            e.set(rotate2[h][0]*torad, rotate2[h][1]*torad, rotate2[h][2]*torad)
            adjustment[h] = new Quaternion().setFromEuler(e);
        }

        let i = lng, k=0

        while(i--){

            t = baseTracks[k];
            first = t.name.substring(0, t.name.lastIndexOf('.') );
            last = t.name.substring(t.name.lastIndexOf('.') )
            //if( t.name === 'hip.scale' ) console.log(t.values)
            if( t.name === 'hip.position' ){
            //if( last === '.position' && first !== 'Root' ){
                let rp = []
                j = t.values.length / 3;
                while(j--){
                    n = j * 3;
                    if( lockPosition ) p.set( t.values[n], t.values[n+1], 0).multiplyScalar(0.01);
                    else p.set( t.values[n], t.values[n+1], t.values[n+2]).multiplyScalar(0.01)
                    p.toArray( rp, n );
                }
                tracks.push( new VectorKeyframeTrack( t.name, t.times, rp ) );

            } else {

                if( last === '.quaternion' && first !== 'Root' ){
                    let rq = []
                    j = t.values.length / 4 
                    while(j--){
                        n = j * 4
                        //q.set(t.values[n], t.values[n+2], -t.values[n+1], t.values[n+3]);
                        //q.set(t.values[n], t.values[n+1], t.values[n+2], t.values[n+3]);
                        q.set(t.values[n+0], t.values[n+1], t.values[n+2], t.values[n+3]);
                        //q.premultiply( adjustment['global'] )
                        //q.set(t.values[n+2], t.values[n+0], t.values[n+1], t.values[n+3]);
                        if(adjustment[first]) q.multiply( adjustment[first] )
                        q.toArray( rq, n );
                    }
                    tracks.push( new QuaternionKeyframeTrack( t.name, t.times, rq ) );
                }

            }
            k++;
        }

        const clip = new AnimationClip( name, -1, tracks );
        clip.duration = anim.duration;

        //clip.optimize()

        return clip

    },


}
let jx = 0.5
let jy = 0.5
let jz = 8
const rotate = {

    hip:[90,0,0],

    abdomen:[-2,0,0],
    abdomen2:[4,0,0],
    //chest:[20,0,0],
    neck:[6,0,0],
    head:[-8,0,0],

    rThigh:[jx,jy,-jz],
    lThigh:[jx,-jy,jz],
    rShin:[-jx,0,0],
    lShin:[-jx,0,0],
    //lFoot:[-20,0,0],
    //rToes:[20,0,0],

    rCollar:[0,5,0],
    lCollar:[0,-5,0],

    /*rFoot:[55,0,0],
    lFoot:[55,0,0],
    rToes:[-30,180,0],
    lToes:[-30,180,0],
    rShldr:[0,90,0],
    lShldr:[0,-90,0],*/
}

const rotate2 = {

    global:[0,0,0],

    pelvis:[0,0,0],
    //pelvis:[0,90,0],

    clavicle_l:[0,0,0],
    clavicle_r:[0,0,0],

    upperarm_l:[0,0,0],
    upperarm_r:[0,0,0],

    //abdomen:[-2,0,0],
    //abdomen2:[4,0,0],
    //chest:[20,0,0],
    //neck:[6,0,0],
    head:[0,0,0],

    thigh_r:[0, 0,0],
    thigh_l:[0,0,0],
    /*rShin:[-jx,0,0],
    lShin:[-jx,0,0],
    //lFoot:[-20,0,0],
    //rToes:[20,0,0],

    rCollar:[0,5,0],
    lCollar:[0,-5,0],*/

    /*rFoot:[55,0,0],
    lFoot:[55,0,0],
    rToes:[-30,180,0],
    lToes:[-30,180,0],
    rShldr:[0,90,0],
    lShldr:[0,-90,0],*/
}