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

var layerEval= function(){
    data.layers.dim.forEach(element => {
        var diff=0;
        for(var i=0 ;i<data.box.length;i++)
        {
            diff=diff+ Math.min(Math.abs(element -data.box[i].height),Math.abs(element -data.box[i].height),Math.abs(element -data.box[i].length))
        }
        data.layers.val.push(diff);
    });
}

var addLayer=function(){
    var index=data.layers.val.indexOf(Math.min(...data.layers.val));
    var layerThickness=data.layers.dim[index];
    

}





//////////////////////////////////
///////////EXECUTION//////////////
//////////////////////////////////
layerEval();

var setPriority=function(pri){
    currPri=pri;
    boxSubset();


}
var boxSubset= function(){
    
data.box.forEach(element => {
    if(element.priority==currPri)
    {
        currBoxList.push(element);
    }
    
    
});
}
var layer= function(){
    setPriority(4);
    findCrate();
    var xStart=0,
         quantity=0,
         xEnd=data.crate[crateIndex].length,
         zStart=0,
         zEnd=data.crate[crateIndex].width,
        yEnd=data.crate[crateIndex].height,
        zHighest=0,
        yHighest=0,
        palArea=xEnd*zEnd,
        unpacked=[],
        vol=0,
        flag=0;
        pFlag=1;

    while(pFlag)
    {
        pFlag=0;
        if(flag)
        {
            currBoxList=unpacked;
            unpacked=[];
        }
        flag+=1;
        currBoxList.forEach((element,index)=>{
            var or1=0,or2=0,or3=0;
            if(element.width<=yEnd)
            or1=Math.floor(palArea/(element.length*element.height));

            if(element.height<=yEnd)
            or2=Math.floor(palArea/(element.length*element.width));

            if(element.length<=yEnd)
            or3=Math.floor(palArea/(element.width*element.height));

            var best=Math.max(or1,or2,or3);
            if(best>0)
            {
                var packx,packy;
                var final
                if(best==or1)
                    {
                        final=or1;
                        packx=element.length;
                        packy=element.width;
                        packz=element.height;
                    }
                else if(best==or2)
                {
                    final=or2;  
                    packx=element.length;
                    packy=element.height;
                    packz=element.width;
                    
                } 
                else
                    {
                        final=or3;
                        packx=element.width;
                        packy=element.length;
                        packz=element.height;
                    }
                
            ///////////////////////////
                if(final >= element.quantity && (zEnd-zStart)>=packz && yEnd>=packy)
                {
                    let n=element.quantity;
                    vol+=(n*(packx*packy));
                    console.log("SKU: "+element.SKU+" Place all "+element.quantity+" packets from x= "+xStart+" z= "+zStart );
                    
                    xStart+=Math.ceil(n*packx);

                    zHighest=Math.max(zHighest,packz)
                    yHighest=Math.max(yHighest,packy)

                    if(xEnd-xStart<1)
                    {
                        xStart=0;
                        zStart+=zHighest;
                        zHighest=0;
                    }
                    quantity+=1;
                    palArea=((xEnd-xStart)*(zEnd-zStart))
                    console.log("New xStart= "+xStart+" New z-start= "+zStart+" Area= "+palArea);
                    console.log(".");
                    pFlag=1;
                }
                else if((zEnd-zStart)>=packz && yEnd>=packy) 
                {
                    let n=final;
                    console.log("SKU: "+element.SKU+" Place ONLY "+n+" packets from x= "+xStart+" z= "+zStart );
                    
                    xStart+=Math.ceil(n*packx);
                    vol+=(n*(packx*packy));

                    zHighest=Math.max(zHighest,packz)
                    yHighest=Math.max(yHighest,packy)

                    if(xEnd-xStart<1)
                    {
                        xStart=0;
                        zStart+=zHighest;
                        zHighest=0;
                    }
                    palArea=((xEnd-xStart)*(zEnd-zStart))
                    console.log("New xStart= "+xStart+" New z-start= "+zStart+" Area= "+palArea);
                    console.log(".");
                    element.quantity-=n;
                    unpacked.push(element);
                    pFlag=1;
                }
                else
                {
                    unpacked.push(element);
                }

            }
            else
            unpacked.push(element);
        })
    //yEnd-=yHighest;
        zStart=0;
        zHighest=0;
        xStart=0;
        yHighest=0;
        palArea=(xEnd-xStart)*(zEnd-zStart);
    }
    console.log("Remainig Gap x= ",(xEnd-xStart),(zEnd-zStart));
    console.log("Total quantity packed = ",quantity);
    console.log("Remaining to be packed = ", unpacked.length,currBoxList.length);
    console.log("Volume wasted = ",vol,yEnd)
    console.log(data.crate[crateIndex]);
    console.log(unpacked)

}
layer();

