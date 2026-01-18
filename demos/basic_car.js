const max = 600;
let saving = []

let N = 0


let testCar = []

demo = () => {

    

    phy.view({ 
        envmap:'small', groundColor:0x505050, background:0x151414, 
        envblur:0.5, d:10, theta:0, phi:25, reflect:0.1 , fog:true, fogExp:0.05,
    })

    let g = phy.getGround()
    g.material.map = phy.texture({ url:'./assets/textures/grid2.png', repeat:[60,60], offset:[0.5,0.5], anisotropy:4 });
    g.material.normalMap = phy.texture({ url:'./assets/textures/grid_n.png', repeat:[60,60], offset:[0.5,0.5], anisotropy:4 });
    g.material.normalScale.set(0.1,-0.1)
    g.material.roughness = 0.8;
    g.material.metalness = 0;

    // config physics setting
    phy.set({ fps:60, substep:1, gravity:[0,-9.806,0], key:true })
    //phy.set({ fps:60, substep:1, gravity:[0,-29,0], key:true })

    // add static ground box
    phy.add({ type:'box', size:[100,4,100], pos:[0, -2, 0], restitution:0.2, visible:false })

    addGui()

    testCar.push(new Car({mass:50, wheelMass:50/4}))
    testCar.push(new Car({pos:[-4,1,0], size:[1,0.4,2], rot:[0,90,0]}))
    testCar.push(new Car({pos:[4,1,0], size:[2,0.3,2], rot:[0,-90,0]}))

    // test attach object
    phy.add({name:'simpleBox', type:'box', size:[1,1,1], pos:[0,1+0.1+0.5,0], mass:50})
    phy.add({name: 'connect', type:'fixe', b1:testCar[0].chassisName, b2:'simpleBox', worldPos:[0,1+0.1,0], limitAreForce:true})

    // update after physic step
    phy.setPostUpdate ( update )

}

const addGui = () => {

    phy.log('Use key to move<br>Only work on PHYSX and HAVOK')

    //gui = phy.gui();
    /*gui.add('grid',{ values:['SAVE', 'RESTOR'], selectable:false, radius:6 }).onChange( (n)=>{
        if(n==='SAVE') save()
        if(n==='RESTOR') begin(saving)
    } );*/

}

update = () => {
    let key = phy.getKey()
    let delta = phy.getDelta()
    let r = phy.getAzimut()

    for(let i in testCar) testCar[i].update(key, delta)

}


class Car {

    constructor ( o = {} ) {

        this.name = 'car'+N;
        N++

        this.w = 0
        this.currentSpeed = 0;
        this.currentSteering = 0;

        this.setting = {
            mass: o.mass || 100,
            w_mass: o.wheelMass || 20,
            w_friction:20,
            w_radius:0.3,
            w_width:0.3,

            s_Length:0.04,
            s_stiffness:20000,
            s_damping:100,
        }

        this.maxSpeed = 300;
        this.maxSteering = 25

        this.drive = ['rx', 10, 100, 1000000, true]
        this.driveSterring = ['ry', 10000, 10, 100000]

        //this.suspension = ['y', -0.02, 0.02, 10000, 100]
        this.steering = ['ry', -this.maxSteering, this.maxSteering, 10000, 100]

        this.pos = o.pos || [0,1,0]
        this.rot = o.rot || [0,0,0]
        this.size = o.size || [2,0.2,4]

        this.quat = math.quatFromEuler(this.rot);

        this.w_sphere = false

        this.group = 1 << 3 // 8

        this.init()

    }

    init(){

        this.chassisName = this.name+'_chassie'

        const s = this.setting
        const r = s.w_radius
        const d = s.w_width
        this.w_x = (this.size[0]*0.5)+(d*0.5)
        this.w_z = (this.size[2]*0.5)-r

        this.suspension = [ 'y', -s.s_Length*0.5, s.s_Length*0.5, s.s_stiffness, s.s_damping ]

        phy.add({ 
            name:this.chassisName, 
            type:'box',
            aggregate:this.name+'_group',// only for physx
            size:this.size, 
            pos:this.pos,
            rot:this.rot, 
            mass:s.mass, 
            massCenter:[0,-r, 0],
            restitution:0.2, friction:0.5, 
            group:this.group, 
            //damping:[10,1],
            //mask:1|2 
        })

        

        let wheelGeo = new THREE.CylinderGeometry( r, r, d, 48, 2 );
        wheelGeo.rotateZ( -Math.PI*0.5 );
        this.wheelMesh = new THREE.Mesh(wheelGeo)

        for(let i = 0; i<4; i++ ){
            this.addWheel(i)
        }

    }

    update( key, delta ){

        if(key[1]!==0){
            this.currentSpeed += -key[1]*40*delta
            this.currentSpeed = math.clamp(this.currentSpeed, -this.maxSpeed*0.5, this.maxSpeed)
        } else {
            this.currentSpeed *= 0.1
        }

        if(key[0]!==0){
            this.currentSteering += key[0]
            this.currentSteering = math.clamp(this.currentSteering, -this.maxSteering, this.maxSteering)
        } else {
            this.currentSteering *= 0.99
        }

        let name = this.name

        let c = []
        //c.push({ name:name+'_JW0', driveVelocity:{rot:[this.currentSpeed,0,0]} })
        //c.push({ name:name+'_JW1', driveVelocity:{rot:[this.currentSpeed,0,0]} })
        c.push({ name:name+'_JW2', driveVelocity:{rot:[this.currentSpeed,0,0]} })
        c.push({ name:name+'_JW3', driveVelocity:{rot:[this.currentSpeed,0,0]} })


        const [innerAngle, outerAngle] = this.wheelAngles(-this.currentSteering);

        c.push({ name:name+'_JA0', drivePosition:{rot:[0,innerAngle,0]} })
        c.push({ name:name+'_JA1', drivePosition:{rot:[0,outerAngle,0]} })

        if(c.length) phy.change( c )

    }

    wheelAngles( a ){

        // https://en.wikipedia.org/wiki/Ackermann_steering_geometry

        const wheelbase = this.w_z*2;//wheel z space
        const trackWidth = this.w_x*2 //wheel x space

        const avgRadius = wheelbase / Math.tan(a*math.torad);
        const innerRadius = avgRadius - trackWidth / 2;
        const outerRadius = avgRadius + trackWidth / 2;
        const innerAngle = Math.atan(wheelbase / innerRadius);
        const outerAngle = Math.atan(wheelbase / outerRadius);

        return [innerAngle*math.todeg, outerAngle*math.todeg];

    }

    addWheel(i){

        const s = this.setting

        let isSphere = this.w_sphere

        let isLeft = i===1 || i===3
        let isBack = i>1
        let name = this.name
        let mesh = this.wheelMesh


        let m = s.w_mass
        let f = s.w_friction

        let x = this.w_x
        let z = this.w_z
        let r = s.w_radius
        let d = s.w_width

        let pos = [(isLeft?x:-x), 0, (isBack?z:-z)]
        pos = math.applyQuaternion(pos, this.quat)
        pos = math.addArray(pos, this.pos)

        phy.add({ 
            name:name+'_A'+i, type:'box', 
            aggregate:this.name+'_group',// only for physx
            size:[d,r*1.3,r*1.3], pos:pos,
            mask:1|2,
            material:'debug2',
            mass:m*0.5, restitution:0, 
            friction:0.5,
            staticFriction:1,


        })

        phy.add({ 
            name:name+'_W'+i, type:isSphere?'sphere':'cylinder', mesh:mesh,
            aggregate:this.name+'_group',// only for physx
            mask:1|2,

            material:'debug', 
            size:[r,d], 
            localRot:[0,0,isSphere?0:-90],
            pos:pos, seg:48, real:true,
            //rot:this.rot,
            mass:m*0.5, restitution:0.1, 
            friction:f, // Dynamic Friction
            staticFriction:0.5, // Static Friction
            //damping:[0.8,0.5]
        })

        let lm = [[...this.suspension]]
        if(!isBack) lm.push([...this.steering])

        // joint

        phy.add({ 
            type:'generic', 
            name: name+'_JA'+i, 
            b1: name+'_chassie', b2:name+'_A'+i,
            worldPos:pos,
            //worldAxis:[1,0,0],
            limit:lm,
            drive: isBack ? [] : [[...this.driveSterring]],
            friction:0, // only for havok
            collision:false, 
            visible:true 
        })

        phy.add({ 
            type:'generic', 
            name: name+'_JW'+i, 
            b1:name+'_A'+i, b2:name+'_W'+i, 
            worldPos:pos,
            //worldAxis:[1,0,0],
            motion:[['rx','free']],
            drive:isBack? [[...this.drive]]:[],
            friction:0, // only for havok
            collision:false, 
            visible:true 
        });

    }

}