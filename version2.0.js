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

var findQuantity=function(palx,palz,elx,elz,quantity)  
{
    var fitted=0;
    var flag=0;
    while(palz-elz >0)
    {
        while(palx-elx>0)
        {
            fitted+=1;
            if(fitted==quantity)
            {
                flag=1;
                break;
            }
            palx+=elx;
        }
        if(flag==1)
        break;
        elx=0;
        palz+=elz;         //could check for remaining area to be pushed as a free rectangle
    }
    return ({
        quantity:fitted,
        xEnd:palx,
        zEnd:palz,
            })
}


var layer= function(){
    var quantity=0,palletNo=1,
    yEnd=data.crate[crateIndex].height;
    console.log("###################################################################################")
    console.log("Start Pallet No :",palletNo);
    console.log("###################################################################################")
    findCrate();

    var rectangles=[],
        xEnd=data.crate[crateIndex].length,
        zEnd=data.crate[crateIndex].width,
        yEnd=data.crate[crateIndex].height,
        zStart=0,
        xStart=0;


    rectangles.push({
        xStart:0,
        xEnd:xEnd,
        zStart:0,
        zEnd:zEnd,
        palArea:xEnd*zEnd
    })
    
for(var priIndex=10;priIndex>0;priIndex--)
{
    setPriority(priIndex);

        unpacked=[],
        vol=0,
        flag=0,
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
            var or11=0,or21=0,or31=0,or12=0,or22=0,or32=0,found=0;
            var final;
            
            if(element.width<=yEnd)
            {

            console.log("AAAAAAAAAAAAA")
                or11=findQuantity(xEnd-xStart,zEnd-zStart,element.length,element.height,element.quantity);
                console.log("BBBBBBBBBB")
               // console.log(or11.quantity,element.quantity)
                console.log(xEnd-xStart,zEnd-zStart,element.length,element.height,element.quantity)
                    if(or11.quantity==element.quantity)
                    {
                        found=1;
                        final=or11;console.log("FOund")

                    }
                if(found==0)
                {
                    or12=findQuantity(zEnd-zStart,xEnd-xStart,element.length,element.height,element.quantity);
                    if(or11.quantity==element.quantity)
                    {
                        found=1;
                        final=or11;
                    }
                }
            }
            if(found==0 && element.height<=yEnd )
            {
                or21=findQuantity(xEnd-xStart,zEnd-zStart,element.length,element.width,element.quantity);
                if(or21.quantity==element.quantity)
                {
                    found=1;
                    final=or21;
                }

                if(found==0)
                {
                    or22=findQuantity(zEnd-zStart,xEnd-xStart,element.length,element.width,element.quantity)
                    if(or22.quantity==element.quantity)
                    {
                        found=1;
                        final=or21;
                    }
                }
            }
            if(found==0 && element.length<=yEnd)
            {
                or31=findQuantity(xEnd-xStart,zEnd-zStart,element.width,element.height,element.quantity);
                if(or31.quantity==element.quantity)
                { 
                    found=1;
                    final=or31;
                }


                if(found==0)
                { 
                    or32=findQuantity(xEnd-xStart,zEnd-zStart,element.width,element.height,element.quantity);
                    if(or32.quantity==element.quantity)
                    {
                        found=1;
                        final=or32;
                    }
                }
            }
            console.log(found)

            // var best=Math.max(or11,or21,or31,or32,or22,or12);
            // if(best>0)
            // {
            //     var packx,packy;
            //     if(best==or1)
            //         {
            //             final=or1;
            //             packx=element.length;
            //             packy=element.width;
            //             packz=element.height;
            //         }
            //     else if(best==or2)
            //     {
            //         final=or2;  
            //         packx=element.length;
            //         packy=element.height;
            //         packz=element.width;
                    
            //     } 
            //     else
            //         {
            //             final=or3;
            //             packx=element.width;
            //             packy=element.length;
            //             packz=element.height;
            //         }
                
            ///////////////////////////
                if(final.quantity >= element.quantity)
                {
                    console.log("Inside if")
                    let n=element.quantity;
                 //   vol+=(n*(packx*packy));
                    console.log("SKU: "+element.SKU+" Place all "+element.quantity+
                    " packets from x= "+xStart.toFixed(1)+" z= "+zStart.toFixed(1) );
                   // console.log("In Orientation X= "+packx.toFixed(1)+" Y = "+packy.toFixed(1));

                   
                    quantity+=1;
                    palArea=((xEnd-xStart)*(zEnd-zStart))
                    console.log("New xStart= "+xStart.toFixed(1)+
                    " New z-start= "+zStart.toFixed(1)+" Area= "+palArea.toFixed(1));
                    console.log(".");
                    pFlag=1;
                }
                
               

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
            rectangles.length=0;
            rectangles.push({
                xStart:0,
                xEnd:xEnd,
                zStart:0,
                zEnd:zEnd,
                palArea:palArea
            })
    
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
    console.log(palletNo,data.totalBoxVol/data.crate[crateIndex].vol);

}



layer();

