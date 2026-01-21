const list = [ 'Collision', 'Bullet' ];
const setting = { gravity:-9.81, auto:false, name:'' };
let n = 0;

demo = () => {

    phy.view({ distance:12, y:4 });

    // config physics setting
    phy.set({ substep:1, gravity:[0,-9.81,0], ccd:true })

    // add simple gui
    let gui = phy.gui();
    gui.add( setting, 'name', { type:'grid', values:list, selectable:true, h:26 } ).listen().onChange( click )
    gui.add( setting, 'gravity', { min:-20, max:20, mode:2 } ).listen().onChange( setGravity )
    gui.add( setting, 'auto' ).listen().onChange( ( b ) => { if(b) next(); } )

    run();

}

click = ( name ) => {

    let i = list.indexOf(name);
    if(i!==-1){
        setting.auto = false;
        phy.cleartimout();
        n = i;
        run();
    }

}

next = () => {

    n ++
    if( n === list.length ) n = 0 
    phy.setTimeout( run, 30000 )

}

run = () => {

    // TODO bug in worker !!!
    phy.clearGarbage();

    // add ground
    //phy.add({ type:'plane', name:'floor', size:[ 300,1,300 ], visible:false });
    phy.add({ type:'box', name:'floor', size:[ 100,1,100 ], pos:[0,-0.5,0], visible:false });

    tmp = [];
    this['test_'+n]();
    if( setting.auto ) next();

}

setGravity= (v) => {

    setting.gravity = v
    phy.setGravity([0,v,0])

}

test_0 = () => {

    setting.name = 'Collision';
    setGravity(-9.81)

    // add box container without up face 
    let h = 8
    phy.add({ type:'container', material:'debug', size:[4,h,4], pos:[0,h*0.5,0], wall:0.2, friction:0, restitution:1, intern:true, remplace:true, face:{up:0} });

    // basic convex geometry
    const bc = new THREE.DodecahedronGeometry(0.25)

    // finally add body soup
    const density = 1
    const gap = 0.02
    let i = 200

    while(i--) {
        phy.add({ instance:'a1', type:'box', size:[0.5,0.5,0.5], rot:[0,0,0], pos:[-1-(gap*2), 5+i, 0], density:density })
        phy.add({ instance:'a2', type:'sphere', size:[0.25], pos:[-0.5-gap, 5+i, 0], density:density })
        phy.add({ instance:'a3', type:'cylinder', size:[0.25,0.5], pos:[0, 5+i, 0], density:density })
        phy.add({ instance:'a4', type:'capsule', size:[0.25,0.25], pos:[0.5+gap, 5+i, 0], density:density })
        phy.add({ instance:'a5', type:'convex', shape:bc, pos:[1+(gap*2), 5+i, 0], density:density })
    }

}

test_1 = () => {

    setting.name = 'Bullet';
    setGravity(0)

    // HAVOK no need extra bullet option
    // all body is allway bullet by default

    // add box container
    phy.add({ type:'container', material:'debug', size:[4,4,4], pos:[0,2.5,0], wall:5, friction:0, restitution:1, intern:true, remplace:true  });

    let i = 400, p = 1, d = 0.4, r;
    let v = 2, tmp = []
    while(i--){
        
        r = math.rand(0.05,0.2)
        tmp.push({ 
            type:'sphere', 
            instance:'sphereBase',
            size:[r], 
            pos:[math.rand(-p,p), 2+math.rand(-p,p) ,math.rand(-p,p)], 
            mass:r, 

            //ccdThreshold:0.001,
            //ccdRadius:0.2,
            //ccdMin:0.0000001,
            //ccdMaxContact:true
            bullet:true,

            restitution:1.0,
            friction:0.0,

            impulse:[math.rand(-v,v),math.rand(-v,v),math.rand(-v,v)],
            material:'carbon',
            maxVelocity:[10,100],
            //penetrationVelocity:3,

        });

        
    }
    phy.add(tmp)

}