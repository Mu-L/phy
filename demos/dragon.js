let dragon, head;
const nodes = [];
var tt = 0, r = 0;
const debug = false;
const headLook = new THREE.Vector3();
let gate = null;

demo = () => {

    // config environement
    phy.view({ envmap:'pendora', envblur: 0.5, groundPos:[0,-10,0], groundSize:[200,200], groundReflect:0.4, y:0, fov:60, distance:12, fogexp:0.03 })

    // config physics setting
    phy.set( {substep:1, gravity:[0,0,0]})

    //phy.lightIntensity( 6, 0, 0.7 );

    phy.useRealLight( {aoColor:0xff9000} );

    // add static ground
    //phy.add({ type:'plane', size:[300,1,300], pos:[0,-8,0], visible:false })

    phy.add({ type:'container', material:debug ? 'debug' : 'hide', size:[10,10,50], pos:[0,0,-20], friction:0, wall:1.0, remplace:true, color:0x000000, intern:true, face:{front:0, back:0} })// material:'glassX'
//phy.add({ type:'container', material:'debug', size:[5.8, 14, 6.6,10.0], pos:[0,7,0], friction:0.5, restitution:0, intern:true, remplace:true, color:0x000000 });
    // preLoad
    const maps = [
    'textures/dragon/dragon_d.jpg', 'textures/dragon/dragon_a.jpg', 'textures/dragon/dragon_n.jpg', 'textures/dragon/dragon_ao.jpg',
    'textures/dragon/torii_d.jpg', 'textures/dragon/torii_ao.jpg', 'textures/dragon/torii_r.jpg',
    ]

    phy.load( ['models/dragon.glb', 'models/gate.glb', ...maps], onComplete, './assets/' );

}

onComplete = () => {

    //phy.changeShadow( {range:60, far:100} );

    const models = phy.getMesh('dragon');

    // make material
    let material = phy.material({ 
        name:'dragon', 
        roughness: 0.02, 
        metalness: 0.3, 
        map: phy.texture({ url:'textures/dragon/dragon_d.jpg' }), 
        aoMap: phy.texture({ url:'textures/dragon/dragon_ao.jpg' }),
        alphaMap: phy.texture({ url:'textures/dragon/dragon_a.jpg' }),
        normalMap: phy.texture({ url:'textures/dragon/dragon_n.jpg' }),
        normalScale:[1,-1],
        alphaTest:0.9,
        //alphaToCoverage:true,
        transparent:true,
        sheen:1.0,
        sheenColor:0xe6c278,
        sheenRoughness: 0.25,
        clearcoat:0.5,
        clearcoatRoughness:0.25,
        clearcoatNormalScale:[2,-2],
        clearcoatNormalMap: phy.texture({ url:'textures/dragon/dragon_n.jpg' }),
        wireframe:debug
    })

    let eye = new Diamond({ color:  0xffffff, name: 'diams_eye', },{ geometry:models.diam_1.geometry })
    phy.addMaterial( eye, true )

    models.diam_1.material = eye
    models.diam_2.material = eye

    dragon = phy.getGlb('dragon');

    models.dragon.material = phy.getMat('dragon');
    models.dragon.castShadow = true;
    models.dragon.receiveShadow = false;
    let skeleton = models.dragon.skeleton
    // see why ? 
    skeleton.scalled = true;
    head = skeleton.getBoneByName('b_head');
    //head.rotation.y = 45 * math.torad

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

    addEffect()
    addGate()

    phy.setPostUpdate ( update )

}

addGate = () => {

    // make material
    let material = phy.material({ 
        name:'gate', 
        roughness: 1.0, 
        metalness: 0.0, 
        map: phy.texture({ url:'textures/dragon/torii_d.jpg' }), 
        aoMap: phy.texture({ url:'textures/dragon/torii_ao.jpg' }),
        roughnessMap: phy.texture({ url:'textures/dragon/torii_r.jpg' }),  
        //normalMap: phy.texture({ url:'textures/dragon/torii_n.jpg' }),
        //transparent:true,
        opacity:1.0
    })

    let m = phy.getMesh('gate').gate;
    m.position.y = -10
    m.position.z = 20
    m.material = material;
    m.castShadow = true;
    m.receiveShadow = true;
    m.scale.set(2,2,2)
    phy.add( m );

    gate = m;

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

    const v = phy.getMouse() || {x:0, y:0};
    headLook.lerp({ x:0, y:-v.y*20, z:-v.x*20 }, delta*10 );
    head.rotation.set(0, headLook.y*math.torad, (headLook.z+180)*math.torad, 'XYZ' )

    updateBone();

    tt += delta * 1;
    if(r<2) r+=0.01;

    if( gate ){
        gate.position.z -= delta*4
        if(gate.position.z < -70){ 
            if(!gate.material.transparent) gate.material.transparent = true;
            gate.material.opacity-= delta; 
        }
        if( gate.material.opacity < 0 ){ 
            gate.position.z = 20;
            gate.material.opacity = 1.0;
            gate.material.transparent = false;
        }
    }

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

addEffect = () => {

    phy.addParticle({
        "type":"octo",
        "position":[0,-8,-10],
        "colors":[ 
        0.87, 0.87, 0.80, 0,
        0.87, 0.87, 0.80, 1,
        0.87, 0.87, 0.80, 0 ],
        "numParticles": 400,
        "lifeTime": 6,
        "timeRange": 6,
        "startSize": 0.1,
        "endSize": 0.1,
        "sizeRange": 0.1,
        
        "positionRange": [ 30, 0, 30 ],
        "velocity": [ 0.5, 2.0, 0.5 ],
        "velocityRange": [ 0.2, 1, 0.2 ],
        "blending":"normal",
        "spinSpeedRange": 1
    })

}