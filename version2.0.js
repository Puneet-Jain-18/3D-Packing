var data=require('./initialize');     //data.box  //data.crate   //data.layers.dim   //data.totalBoxVol


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
    return rectangles; 
}

var sortRect=function(rectangles)
{
   return (rectangles.sort((a,b) => (a.area > b.area) ? 1 : ((b.area > a.area) ? -1 : 0))); 
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
        area:xEnd*zEnd,
    })
    var priIndex=10;
    var unpacked=[],
        vol=0;
    while(priIndex>0)
    {
        setPriority(priIndex);
            yHighest=0,
            flag=0,
            layerFlag=1;
    
        while(yEnd>0)
        {
            
            yHighest=0,
            flag=0,
            layerFlag=1;
        
            while(layerFlag)
            {
                console.log("Priority Index : ",priIndex,currBoxList.length);
                layerFlag=0;
                if(flag)
                {
                    console.log("Assigning unpacked",unpacked.length)
                    currBoxList=unpacked;
                    unpacked=[];
                }
                flag+=1;
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
                                        minQuantity=or11.quantity;
                                        final=or11;
                                        
                                    }
                                if(found==0)
                                {
                                    or12=findQuantity(xEnd-xStart,zEnd-zStart,element.height,element.length,element.quantity);
                                    if(or11.quantity==element.quantity)
                                    {
                                        found=1;
                                        final=or11;
                                        final.packx=element.height;
                                        final.packz=element.length;
                                        final.packy=element.width;
                                        rectIndex=ind;
                                        break;
                                    }
                                    else if(or12.quantity>minQuantity)
                                    {
                                        minQuantity=or12.quantity;
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
                                    final.packx=element.length;
                                    final.packz=element.width;
                                    final.packy=element.height;
                                    rectIndex=ind;
                                    break;

                                }
                                else if(or21.quantity>minQuantity)
                                {
                                    minQuantity=or21.quantity;
                                    final=or21;
                                    
                                }

                                if(found==0)
                                {
                                    or22=findQuantity(xEnd-xStart,zEnd-zStart,element.width,element.length,element.quantity)
                                    if(or22.quantity==element.quantity)
                                    {
                                        found=1;
                                        final=or21;
                                        final.packx=element.width;
                                        final.packz=element.length;
                                        final.packy=element.height;
                                        rectIndex=ind;
                                        break;
                                    }
                                    else if(or22.quantity>minQuantity)
                                    {
                                        minQuantity=or22.quantity;
                                        final=or22;
                                        
                                    }
                                }
                            }
                            if(found==0 && element.length<=yEnd)
                            {//  console.log("ccccccccccccccccc")
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
                                    minQuantity=or31.quantity;
                                    final=or31;
                                    
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
                                        minQuantity=or32.quantity;
                                        final=or32;
                                        
                                    }
                                }
                            }
                        }
                    }
                    if(rectIndex==-1)
                    {
                        console.log
                        unpacked.push(element);
                        continue;
                    }
                    console.log(found)
                        if(final.quantity == element.quantity)
                        {  
                            quantity+=1;
                            layerFlag=1;
                            if(final.packy >yHighest)
                            {
                                yHighest=final.packy;
                            }

                            rectangles=rectReplace(rectangles,rectIndex,final);       
                        }
                        else if(final.quantity<element.quantity)
                        {
                            layerFlag=1;
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
                        priIndex-=1;
                        if(priIndex<=0)
                        break;
                        setPriority(priIndex);
                        layerFlag=1;
                    }

            }
            ///currently might accomodate one extra layer
            if(priIndex<=0)
            break;
            yEnd-=yHighest;
            if(yEnd<=0)
            break;

            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Adding New Layer in the pallet  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            rectangles.length=0;
            rectangles.push({
                xStart:0,
                xEnd:data.crate[crateIndex].length,
                zStart:0,
                zEnd:data.crate[crateIndex.width],
                area:(data.crate[crateIndex.width])*(data.crate[crateIndex].length),
            })
        }
        if(priIndex>0 && unpacked.length>0)
        {
            palletNo+=1;
            console.log("##########################################################################################################");
            console.log("Starting new pallet No.  "+palletNo);
            console.log("##########################################################################################################");
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
