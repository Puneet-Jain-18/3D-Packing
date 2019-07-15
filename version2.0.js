var data=require('./initialize');     //data.box  //data.crate   //data.layers.dim   //data.totalBoxVol
console.log(data.totalBoxVol);

//////////////////////////////////
///////////Variables//////////////
//////////////////////////////////
var crateIndex=0;
var currPri=5;
var currBoxList=[];
var volumeArray=[]


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


//  layerEval();             currently not using this function

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
    var palxStart=0,palzStart=0;
    while(palzStart+elz <=palz)
    {
        palzStart+=elz; 
        while(palxStart+elx<=palx)
        {
            fitted+=1;
            palxStart+=elx;
            if(fitted==quantity)
            {
                flag=1;
                break;
            }
        }
        if(flag==1)
        break;
        elxStart=0;
                //could check for remaining area to be pushed as a free rectangle
    }
    return ({
        quantity:fitted,
        xLength:palxStart,
        zLength:palzStart,
            })
}
var rectReplace= function(rectangles,rectIndex,element)
{
    var temp=rectangles[rectIndex];

    rectangles.splice(rectIndex,1);
    rectangles.push(
        {
            xStart:temp.xStart,
            xEnd:temp.xEnd,
            zStart:temp.zStart+element.zLength,
            zEnd:temp.zEnd,
            area:(temp.xEnd-temp.xStart)*(temp.zEnd-(temp.zStart+element.zLength))
        })
    rectangles.push({
            xStart:temp.xStart+element.xLength,
            xEnd:temp.xEnd,
            zStart:temp.zStart+(element.zLength-element.packz),
            zEnd:temp.zStart+element.zLength,
            area:(element.packz * (temp.xEnd-(temp.xStart+element.xLength)))
        }

    )
    rectangles=mergeRect(rectangles);
    
    return(sortRect(rectangles));

}

var mergeRect=function(rectangles)
{ 
    ///TODO :Write Merge function
    for(var i=0;i<rectangles.length;i++)
    {
        for(var j=0;j<rectangles.length;j++)
        {
            if(i>=j)
            continue;
            if((rectangles[i].zEnd-rectangles[j].zStart==0 || rectangles[i].zStart-rectangles[j].zEnd==0 )&& 
                rectangles[i].xStart-rectangles[j].xStart==0  &&
                rectangles[i].xEnd-rectangles[j].xEnd==0)
                {
                    let st=Math.min(rectangles[i].zStart,rectangles[j].zStart);
                    let end=Math.max(rectangles[i].zEnd,rectangles[j].zEnd);
                    rectangles.push({
                        xStart:rectangles[i].xStart,
                        xEnd:rectangles[i].xEnd,
                        zStart:st,
                        zEnd:end,
                        area:((rectangles[i].xEnd-rectangles[i].xStart)*(end-st)),
                    })
                    
                    rectangles.splice(i,1)
                    j-=1;
                    rectangles.splice(j,1);

                  

                }
                else if((rectangles[i].xEnd-rectangles[j].xStart==0 ||rectangles[i].xStart-rectangles[j].xEnd==0) && 
                    rectangles[i].zStart-rectangles[j].zStart==0&&
                    rectangles[i].zEnd-rectangles[j].zEnd==0
                )
                {
                    let st=Math.min(rectangles[i].xStart,rectangles[j].xStart);
                    let end=Math.max(rectangles[i].xEnd,rectangles[j].xEnd);
                    rectangles.push({
                        xStart:st,
                        xEnd:end,
                        zStart:rectangles[i].zStart,
                        zEnd:rectangles[i].zEnd,
                        area:((rectangles[i].zEnd-rectangles[i].zStart)*(end-st)),
                    })
                    rectangles.splice(i,1)
                    j-=1;
                    rectangles.splice(j,1);
                    j-=1;
                   

                }

        }
    }
    return rectangles; 
}

var sortRect=function(rectangles)
{
   return (rectangles.sort((a,b) => (a.area > b.area) ? 1 : ((b.area > a.area) ? -1 : 0))); 
}

var oldList=0;
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
        area:xEnd*zEnd,
    })
    var priIndex=10;
    var unpacked=currBoxList,
        vol=0;
    while(priIndex>0)
    {
        setPriority(priIndex);
            var yHighest=0,
            flag=0,
            layerFlag=1;
    
        while(yEnd>0)
        {
            
            yHighest=0,
            flag=0,
            layerFlag=1;
        
            while(layerFlag)
            {
                layerFlag=0;
                    currBoxList=unpacked;
                    unpacked=[];
                for(var j=0;j<currBoxList.length;j++)
                {
                    element=currBoxList[j];
                    element.area=Math.min(
                        element.length*element.width,
                        element.width*element.height,
                        element.height*element.length);
                    var or11=0,or21=0,or31=0,or12=0,or22=0,or32=0,found=0,minQuantity=0;
                    var final;
                    var rectIndex=-1;
                    
                    for (var ind=0;ind<rectangles.length;ind++)
                    {
                        var rectangle=rectangles[ind];

                        if(rectangle.area > element.area)
                        {

                            xStart=rectangle.xStart;
                            xEnd=rectangle.xEnd;
                            zStart=rectangle.zStart;
                            zEnd=rectangle.zEnd;

                            if(element.width<=yEnd)
                            {

                                or11=findQuantity(xEnd-xStart,zEnd-zStart,element.length,element.height,element.quantity);
                                    if(or11.quantity==element.quantity)
                                    {
                                        found=1;
                                        final=or11;
                                        final.packx=element.length;
                                        final.packz=element.height;
                                        final.packy=element.width;
                                        rectIndex=ind;
                                        break;
                                    }
                                    else if(or11.quantity>minQuantity)
                                    {
                                        final=or11;
                                        minQuantity=or11.quantity;
                                        rectIndex=ind;
                                        final.packx=element.length;
                                        final.packz=element.height;
                                        final.packy=element.width;
                                        
                                        
                                    }
                                if(found==0)
                                {
                                    or12=findQuantity(xEnd-xStart,zEnd-zStart,element.height,element.length,element.quantity);
                                    if(or12.quantity==element.quantity)
                                    {
                                        found=1;
                                        final=or12;
                                        final.packx=element.height;
                                        final.packz=element.length;
                                        final.packy=element.width;
                                        rectIndex=ind;
                                        break;
                                    }
                                    else if(or12.quantity>minQuantity)
                                    {
                                        final=or12;
                                        minQuantity=or12.quantity;
                                        rectIndex=ind;
                                        final.packx=element.height;
                                        final.packz=element.length;
                                        final.packy=element.width;
                                        
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
                                    final.packx=element.length;
                                    final.packz=element.width;
                                    final.packy=element.height;
                                    rectIndex=ind;
                                    break;

                                }
                                else if(or21.quantity>minQuantity)
                                {
                                    final=or21;
                                    minQuantity=or21.quantity;
                                    rectIndex=ind;
                                    final.packx=element.length;
                                    final.packz=element.width;
                                    final.packy=element.height;
                                    
                                }

                                if(found==0)
                                {
                                    or22=findQuantity(xEnd-xStart,zEnd-zStart,element.width,element.length,element.quantity)
                                    if(or22.quantity==element.quantity)
                                    {
                                        found=1;
                                        final=or22;
                                        final.packx=element.width;
                                        final.packz=element.length;
                                        final.packy=element.height;
                                        rectIndex=ind;
                                        break;
                                    }
                                    else if(or22.quantity>minQuantity)
                                    {
                                        final=or22;
                                        minQuantity=or22.quantity;
                                        rectIndex=ind;
                                        final.packx=element.width;
                                        final.packz=element.length;
                                        final.packy=element.height;
                                       
                                        
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
                                    final.packx=element.width;
                                    final.packz=element.height;
                                    final.packy=element.length;
                                    rectIndex=ind;
                                    break;
                                }
                                else if(or31.quantity>minQuantity)
                                {
                                    final=or31;
                                    minQuantity=or31.quantity;
                                    final.packx=element.width;
                                    final.packz=element.height;
                                    final.packy=element.length;
                                    rectIndex=ind;                                                                  
                                }



                                if(found==0)
                                { 
                                    or32=findQuantity(xEnd-xStart,zEnd-zStart,element.height,element.width,element.quantity);
                                    if(or32.quantity==element.quantity)
                                    {
                                        found=1;
                                        final=or32;
                                        final.packx=element.height;
                                        final.packz=element.width;
                                        final.packy=element.length;
                                        rectIndex=ind;
                                        break;
                                    }
                                    else if(or32.quantity>minQuantity)
                                    {
                                        final=or32;
                                        minQuantity=or32.quantity;
                                        final.packx=element.height;
                                        final.packz=element.width;
                                        final.packy=element.length;
                                        rectIndex=ind;
                                    }
                                }
                            }
                        }
                    }
                    if(rectIndex==-1)
                    {
                        unpacked.push(element);
                        continue;
                    }
                        if(final.quantity == element.quantity)
                        {  
                            vol+=element.quantity*(final.packx*final.packy*final.packz)
                            quantity+=1;
                            layerFlag=1;
                            if(final.packy >yHighest)
                            {
                                yHighest=final.packy;
                            }

                            rectangles=rectReplace(rectangles,rectIndex,final);       
                        }
                        else if(final.quantity<element.quantity && final.quantity>=1)
                        {
                            layerFlag=1;
                            vol+=(final.quantity*final.packx*final.packy*final.packz);
                            if(final.packy >yHighest)
                            {
                                yHighest=final.packy;
                            }
                            rectangles=rectReplace(rectangles,rectIndex,final); 
                            element.quantity-=final.quantity;
                            unpacked.push(element);
                        }
                        else
                        {
                            unpacked.push(element);
                        }
                    }
                    if(unpacked.length==0)
                    {
                        console.log("YESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
                        priIndex-=1;
                        if(priIndex<=0)
                        break;
                        setPriority(priIndex);
                        unpacked=currBoxList;
                        layerFlag=1;
                    }
                    

            }
            //done rightly :)
            if(priIndex<=0)
            break;

            yEnd-=yHighest;
            if(oldList==unpacked.length)
            break;
            
            console.log("////////////////////////////////////// Adding New Layer in the pallet  ///////////////////////////////////");
           oldList=unpacked.length;
            rectangles.length=0;
            rectangles.push({
                xStart:0,
                xEnd:data.crate[crateIndex].length,
                zStart:0,
                zEnd:data.crate[crateIndex].width,
                area:(data.crate[crateIndex].width)*(data.crate[crateIndex].length),
            })
        }
        if(priIndex>0 && unpacked.length>0)
        {
            rectangles.length=0;
            rectangles.push({
                xStart:0,
                xEnd:data.crate[crateIndex].length,
                zStart:0,
                zEnd:data.crate[crateIndex].width,
                area:(data.crate[crateIndex].width)*(data.crate[crateIndex].length),
            })
            
              palletNo+=1;
              volumeArray.push(Math.ceil(vol));
              console.log("VOLUME OF THIS PALLET USED",vol)

              console.log("Y Remaining = ",yEnd);
              console.log("Unpacked Items",unpacked.length)
              vol=0;
              console.log("##########################################################################################################");
              console.log("Starting new pallet No.  "+palletNo);
              console.log("Current PRIORITY=",priIndex);
              yEnd=data.crate[crateIndex].height;
              console.log("##########################################################################################################");
            
            }
        

    }
    console.log("Total quantity packed = ",quantity);
    console.log("Remaining to be packed = ", unpacked.length,currBoxList.length);
 
    console.log(data.crate[crateIndex]);
    console.log(palletNo,data.totalBoxVol/data.crate[0].vol);
    var tot=0
    for(var i=0;i<volumeArray.length;i++)
    tot+=volumeArray[i];

    console.log(data.totalBoxVol-tot)
    console.log(data.box.length)
}

layer()
