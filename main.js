var data=require('./initialize');     //data.box  //data.crate   //data.layers.dim   //data.totalBoxVol
console.log(data.totalBoxVol);
var m=data.totalBoxVol;


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
    var quantity=0,palletNo=1,
    yEnd=data.crate[crateIndex].height;
    console.log("###################################################################################")
    console.log("Start Pallet No :",palletNo);
    console.log("###################################################################################")
    findCrate();
    for(var priIndex=10;priIndex>0;priIndex--)
{
    setPriority(priIndex);
    var xStart=0,
         xEnd=data.crate[crateIndex].length,
         zStart=0,
         zEnd=data.crate[crateIndex].width,
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
                    vol+=(n*(packx*packy*packz));
                    console.log("SKU: "+element.SKU+" Place all "+element.quantity+
                    " packets from x= "+xStart.toFixed(1)+" z= "+zStart.toFixed(1) );
                    console.log("In Orientation X= "+packx.toFixed(1)+" Y = "+packy.toFixed(1));
                    
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
                    console.log("New xStart= "+xStart.toFixed(1)+
                    " New z-start= "+zStart.toFixed(1)+" Area= "+palArea.toFixed(1));
                    console.log(".");
                    pFlag=1;
                }
                else if((zEnd-zStart)>=packz && yEnd>=packy) 
                {
                    let n=final;
                    console.log("SKU: "+element.SKU+" Place ONLY "+n+
                    " packets from x= "+xStart.toFixed(1)+" z= "+zStart.toFixed(1) );
                    console.log("In Orientation X= "+packx.toFixed(1)+" Y = "+packy.toFixed(1))
                    
                    xStart+=Math.ceil(n*packx);
                    vol+=(n*(packx*packy*packz));

                    zHighest=Math.max(zHighest,packz)
                    yHighest=Math.max(yHighest,packy)

                    if(xEnd-xStart<1)
                    {
                        xStart=0;
                        zStart+=zHighest;
                        zHighest=0;
                    }
                    palArea=((xEnd-xStart)*(zEnd-zStart))
                    console.log("New xStart= "+xStart.toFixed(1)+
                    " New z-start= "+zStart.toFixed(1)+
                    " Area= "+palArea.toFixed(1));
                    console.log(".");
                    element.quantity-=n;
                    currBoxList.push(element);
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
        yEnd-=yHighest;
        if(yEnd<=1)
        {
            palletNo+=1;
            console.log("###################################################################################")
            console.log("Start Pallet No :",palletNo);
            console.log("###################################################################################")
            yEnd=data.crate[crateIndex].height;
            data.totalBoxVol-=vol;
            vol=0;
            findCrate();
            xEnd=data.crate[crateIndex].length;
            zEnd=data.crate[crateIndex].width;
        }
        zStart=0;
        zHighest=0;
        xStart=0;
        yHighest=0;
        palArea=(xEnd-xStart)*(zEnd-zStart);
    }
}
    console.log("Remainig Gap x= ",(xEnd-xStart),(zEnd-zStart));
    console.log("Total quantity packed = ",quantity);
    console.log("Remaining to be packed = ", unpacked.length,currBoxList.length);
    console.log("Volume wasted = ",vol,yEnd)
    console.log(data.crate[crateIndex]);
    console.log(palletNo,m/data.crate[0].vol);

}
layer();
