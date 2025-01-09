demo = () => {

    phy.view({ envmap:'clear' })

    // config physics setting
    phy.set({ substep:1, gravity:[0,-9.81,0],  })

    // add static plane 
    //phy.add({ type:'plane', visible:false })
    phy.add({ type:'box', size:[300,10,300], pos:[0, -5, 0], visible:false })

    // add dynamic sphere
    phy.add({ type:'highSphere', name:'sphere', size:[0.4], pos:[0,6,0], density:5, restitution:0.2, friction:0.2, sleep:true, startSleep:true, })

    // creat building
    building({ block:0.3, height:10, length:6, deep:6 })
    //building({ block:0.3, height:10, length:10, deep:10 })


    // intern timeout
    phy.setTimeout( run, 2000 );

}

run = () => {
    // phy.up is use for direct outside update
    phy.change({ name:'sphere', wake:true, force:[0,-0.0001,0] })
}

building = ( o ) => {

    let tmp = [];
    let gg = 0
    let num = 0
    let i, j, k, pos;
    let s = o.block || 1;
    let space = o.space || 0//0.06;
    let d = s + space;
    let x = o.length || 6, y = o.height || 10, z = o.deep || 6;

    let dx = - ((x*0.5) * d) + (d*0.5);
    let dz = - ((z*0.5) * d) + (d*0.5);

    for(k = 0; k<y; k++){
    for(j = 0; j<z; j++){
    for(i = 0; i<x; i++){
        pos = [ i*d + dx, (k*d + d)-(s*0.5), j*d + dz ]
        
        tmp.push({
            instance:'boxbase',
            type:'box',
            radius:0.01,// box chanfer
            size:[s,s,s],
            pos:pos,
            density:0.3,
            friction:0.4,
            restitution:0.1,
            //sleep:true,
            //startSleep:true,

            //aggregate:'boxGroup'+gg,
            //groupCollisions:true,
        })
        num++
        if(num>127){
            gg++; num=0
        }
    }}}

    //tmp[0].groupMax = num
 
    phy.add(tmp);

    // test remmove intance
    /*setTimeout( function(){
        phy.change({ name:'sphere', reset:true, pos:[0,6,0], sleep:true })
        phy.remove('boxbase');
    }, 5000);
    setTimeout( function(){
        let h = math.randInt(5,15)
        console.log(h)
        phy.change({ name:'sphere', wake:true, force:[0,-0.0001,0] })
        building({ block:0.3, height:h, length:6, deep:6 })
    }, 10000);*/

}