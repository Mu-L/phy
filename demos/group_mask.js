function demo() {

    phy.view({phi:25})

    let gDynamic = 1 << 0 // default dynamic 1
    let gStatic = 1 << 1 // default static 2

    let g1 = 1 << 6 // 64
    let g2 = 1 << 7 // 128
    let g3 = 1 << 8 // 256

    //console.log(1 << -1) // 258

    const def = {
        restitution:0.5, 
        friction:0.5
    }

    // config physics setting
    phy.set( { substep:4, gravity:[0,-9.81,0] });

    // add static ground
    //phy.add({ type:'plane', size:[300,1,300], visible:false });

    let h = 8, w = 0.2, l = 4, d = 6, y = 0.22;

    phy.add({ type:'container', material:'debug', size:[d,h,l], pos:[0,h*0.5,0], friction:0.5, restitution:0, remplace:true, wall:1, intern:true, color:0x000000, alpha:0.05 });


    const mat = 'plexi'
    phy.add({ type:'box', pos:[0,y-w*0.5,0], size:[d,w,l], material:mat, radius:0.02, group:g1, mask:g1, renderOrder:2, ...def });
    phy.add({ type:'box', pos:[0,(y+2)-w*0.5,0], size:[d,w,l], material:mat, radius:0.02, group:g2, mask:g2, renderOrder:3, ...def });
    phy.add({ type:'box', pos:[0,(y+4)-w*0.5,0], size:[d,w,l], material:mat, radius:0.02, group:g3, mask:g3, renderOrder:4, ...def });

    let i = 60, pos, ds;

    while(i--){

        ds = 0.2

    	pos = [math.rand( -d*0.5, d*0.5 ), math.rand( h-2, h-1 ), math.rand( -l*0.5, l*0.5 )]

    	phy.add({ size:[0.2], pos:pos, density:ds, radius:0.03, group:g1, mask:2|g1, ...def })
        phy.add({ type:'sphere', size:[0.1], pos:pos, density:ds, group:g2, mask:2|g2, ...def })
        phy.add({ type:'cylinder', size:[0.1, 0.2], pos:pos, density:ds, group:g3, mask:2|g3, radius:0.03, ...def })

    }

}