let dragon
const nodes = []
var tt = 0, r = 0;
const debug = false

demo = () => {

    // config environement
    phy.view({ envmap:'bridge', envblur: 0.5, groundPos:[0,-8,0], groundSize:[200,200], y:0, fov:60, distance:10 })

    // config physics setting
    phy.set( {substep:1, gravity:[0,0,0]})

    // add static ground
    //phy.add({ type:'plane', size:[300,1,300], pos:[0,-8,0], visible:false })

    phy.add({ type:'container', material:debug ? 'debug' : 'hide', size:[10,10,50], pos:[0,0,-20], friction:0, restitution:1 })// material:'glassX'


    phy.load( './assets/models/dragon.glb', onComplete )

}

onComplete = () => {

    const models = phy.getMesh('dragon');

    // make material
    let material = phy.material({ 
        name:'dragon', 
        roughness: 0.0, 
        metalness: 0.8, 
        aoMap: phy.texture({ url:'./assets/textures/dragon/dragon_ao.jpg' }), 
        normalMap: phy.texture({ url:'./assets/textures/dragon/dragon_n.jpg' }),
        alphaMap: phy.texture({ url:'./assets/textures/dragon/dragon_a.jpg' }),
        normalScale:[1,1],
        //alphaTest:0.9,
        transparent:true,
        clearcoat:1.0,
        wireframe:debug
    })

    let eye = new Diamond({ color:  0xffffff, name: 'diams_eye', },{ geometry:models.diam_1.geometry })
    phy.addMaterial( eye, true )

    models.diam_1.material = eye
    models.diam_2.material = eye




    dragon = phy.get('dragon', 'O');

    models.dragon.material = phy.getMat('dragon')
    models.dragon.castShadow = true;
    models.dragon.receiveShadow = false;
    let skeleton = models.dragon.skeleton

    console.log( dragon.actions.mouth )

    phy.add( dragon )


    // SPINE

    let num = 20, s = 1,  bone, node;
    
    let mtx = new THREE.Matrix4();
    let p = new THREE.Vector3();
    let sv = new THREE.Vector3();
    let q = new THREE.Quaternion();
    let transform = new THREE.Matrix4().makeTranslation( 1, 0, 0 );

    // add node

    for ( let i = 0; i < num; i++) {

        bone = skeleton.getBoneByName('b_spine_' + i);
        bone.isPhysics = false;
        bone.phyMtx = new THREE.Matrix4();

        bone.updateMatrixWorld( true )

        mtx.multiplyMatrices( bone.matrixWorld, transform );
        mtx.decompose( p, q, sv );

        if(i>10) s *= 0.9

        node = phy.add({ 
            type:'sphere', name:'b_spine_' + i,

            mass: 1, 
            pos:p.toArray(), quat:q.toArray(), 
            size:[1],
            kinematic: i === 0 ? true : false,
            material:debug ? 'debug' : 'hide',
            //material: debug ? undefined : 'hide',
            //neverSleep:true,
            shadow:false,

        });

        node.userData.bone = bone;
        node.userData.inverse = transform.clone().invert()
        nodes.push( node );

    }

    // add joint

    for ( let i = 0; i < num-1; i++) {
        phy.add({ 
            type:'joint', 
            mode:'d6',
            name:'joint'+i, b1:'b_spine_'+i, b2:'b_spine_'+(i+1),
            pos1:[1,0,0], pos2:[-1,0,0], 
            lm:[['ry', -30, 30 ],['rz', -30, 30 ],['rx', -5, 5 ] ],
            collision:true,
            visible:debug
        })

        
    }

    dragon.actions.mouth.loop = THREE.LoopOnce
    dragon.actions.mouth.clampWhenFinished = true
    //dragon.actions.mouth.zeroSlopeAtEnd = false
    //dragon.actions.mouth.zeroSlopeAtStart = false 


    dragon.play( 'move' )
    dragon.play( 'mouth' )
    dragon.pause( 'mouth' )

    phy.setPostUpdate ( update )

}

update = ( delta ) => {

    dragon.mixer.update( delta*0.5 );

    let m = math.rand(0,10)
    if(m<0.02 && dragon.actions.mouth.paused){
        //dragon.actions.mouth.paused = false
        //dragon.actions.mouth.time = 0;
        //dragon.actions.mouth.setEffectiveWeight( 0.5 );
        dragon.play('mouth')
    }

    var x = r * Math.cos( tt );
    var y = r * Math.sin( tt );

    phy.change( [{ name:'b_spine_0', pos:[ x, y, -1 ] }] );

    updateBone()

    tt += delta * 1;
    if(r<2) r+=0.01

}

updateBone = () => {

    var lng = nodes.length, node, bone, e , te = new THREE.Euler();
    var mtx = new THREE.Matrix4();

    for ( var i = 0; i < lng; i++) {

        node = nodes[i];
        bone = node.userData.bone;

        mtx.copy( node.matrixWorld ).multiply( node.userData.inverse );
        //bone.userData.phyMtx.copy( mtx );

        bone.phyMtx.copy(mtx)
        bone.isPhysics = true

    }


}