let time = 300;
let tween = null;
let out = null;

function demo() {

    phy.view({
        envmap:'lobe',
        ground:true,
        phi:30,
        distance:12
    })

    phy.set({ substep:1, ccd:true })

    //phy.add({ type:'plane', visible:false })

    /*phy.add({ name:'test1', type:'box', size:[1,3,1],  pos:[0,1.5,0], kinematic:true })
    phy.add({ type:'container', material:'debug', size:[10,3,10], pos:[0,1.5,0], friction:1, restitution:0, remplace:true, wall:1, radius:0, intern:true });

    let i = 400;
    while(i--) phy.add({ instance:'ball', type:'sphere', size:[math.rand(0.1,0.2)], pos:[math.rand(-4.5,4.5), 0.25, math.rand(-4.5,4.5) ], mass:1, material:'silver' })

    pause()*/


    phy.load(['models/test/cylinder_v1.glb', 'models/test/cylinder_v2.glb'], onComplete, './assets/' )

}

onComplete = () => {

    let a = phy.getGlb('cylinder_v1')
    phy.add(a)

    let b = phy.getGlb('cylinder_v2')
    phy.add(b)

    let data = {}

    a.traverse( ( child ) => {
        if(child.name === 'Cylinder001') data['c1_a'] = child.geometry.attributes.position.count
        if(child.name === 'Cylinder002') data['c2_a'] = child.geometry.attributes.position.count
    })

    b.traverse( ( child ) => {
        if(child.name === 'Cylinder001') data['c1_b'] = child.geometry.attributes.position.count
        if(child.name === 'Cylinder002') data['c2_b'] = child.geometry.attributes.position.count
    })

    console.log(data)

}


onReset = () => {
    if(out) clearTimeout(out);
    out = null;
}

function goto(){

    let x = math.rand(-4.5,4.5);
    let z = math.rand(-4.5,4.5);
    let p = phy.byName('test1').position.clone();

    tween = new TWEEN.Tween( p )
    .to({ x:x, z:z }, time)
    .easing( TWEEN.Easing.Quadratic.Out )
    .onUpdate( ()=>{ phy.change({ name:'test1', pos:p.toArray() }) } )
    .onComplete( ()=>{ pause() })
    .start()

}

function pause(){
    out = setTimeout( goto, time*2);
}