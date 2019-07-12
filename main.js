var data=require('./initialize');     //data.box  //data.crate   //data.layers.dim   //data.totalBoxVol
console.log(data.crate.length);


//////////////////////////////////
///////////Variables//////////////
//////////////////////////////////
var crateIndex=0;
var currPri=5;
var currBoxList=[];











//////////////////////////////////
///////////FUNCTIONS//////////////
//////////////////////////////////

var findCrate = function(){
    if(data.totalBoxVol >= data.crate[crateIndex].vol)
    return;
    else
    {
        for(var i=0;i<data.crate.length;i++) {
            var element=data.crate[i];
            if(element.vol >= data.totalBoxVol && element.vol < data.crate[crateIndex].vol)
            crateIndex=i;
        };
    }
}
//console.log(data.box[2300]);

var boxSubset= function(){
    
data.box.forEach(element => {
    if(element.priority==currPri)
    currBoxList.push(element);
    
});
}
boxSubset();
console.log(currBoxList)

var layer= function(){
    var xStart=0,
         xEnd=data.crate[crateIndex].x,
         zStart=0;
         zEnd=data.crate[crateIndex].z,
        yEnd=data.crate[crateIndex].y;
        var best=0;
        var palArea=xEnd*zEnd;
    currBoxList.forEach(element=>{
        var or1=0,or2=0,or3=0;
        if(element.z<=yEnd)
         or1=Math.floor(palArea/(element.x*element.y));
        if(element.y<=yEnd)
         or2=Math.floor(palArea/(element.x*element.z));
         if(element.x<=yEnd)
         or3=Math.floor(palArea/(element.z*element.y));
        var best=max(or1,or2,or3);
        if(best>0)
        {var packx,packy;
            var final
            if(best==or1)
                {
                    final=or1;
                    packx=element.x;
                    paxky=element.z;
                    packz=element.y;
                }
            else if(best==or2)
             {
                final=or2;  
                packx=element.x;
                paxky=element.y;
                paxkz=element.z;
                
             } 
            else
                {
                    final=or3;
                    packx=element.z;
                    paxky=element.x;
                    paxkz=element.y;
                }
        ///////////////////////////
            if(final > n)
            {
                console.log("SKU: "+element.SKU+" Place all "+n+" packets from x= "+xStart+" z= "+zStart );
                console.log("In orientation x= "+packx+" y= "+packy);
                console.log(".");
                xStart=n*packx;
                zStart=n*packz;
                yEnd-=packy;
            }

        }

    })
}

