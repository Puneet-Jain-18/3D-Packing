var data=require('./initialize');     //data.box  //data.crate   //data.layers.dim   //data.totalBoxVol

//pallet and crate are same thing

//////////////////////////////////
///////////Variables//////////////
//////////////////////////////////
var crateIndex=0;
var currPri=5;
var currBoxList=[];
var volumeArray=[];
var problem=[];
var oldList=0;
var totalVol=data.totalBoxVol;
var crates=[];            //xRemaining   //yRemaining    //zYemaining  //vol      //boxesPacked   //rectangles[]
//////////////////////////////////
///////////FUNCTIONS//////////////
//////////////////////////////////

////currently selecting maximum volume crate
var insertCrate=function(palletNo,x,z,y)
{
    var newCrate={
        palletNo:palletNo,
        xRemaining:x,
        yRemainig:y,
        zRemaining :z,
        maxX:x,
        maxZ:z,
        vol:x*y*z,
        boxList:[],
        yHighest:0,
        rectangles:[{
        xEnd:data.crate[crateIndex].length,
        zEnd:data.crate[crateIndex].width,
        zStart:0,
        xStart:0,
        area:x*z,
        }]
    }
    crates.push(newCrate)
    sortCrates();
}
var sortCrates=function()
{
    crates.sort((a,b) => (a.vol > b.vol) ? 1 : ((b.vol > a.vol) ? -1 : 0)); 
}
var findCrate = function()
    {
        var max=0;
        var index=-1;
        for(var i=0;i<data.crate.length;i++)
        {

            var element=data.crate[i];
            if(element.vol > max )
            {
                max=element.vol;
                index=i;
            }
    }
    crateIndex=index;
}
var addNewLayer= function(crate)
{
    crate.yRemainig-=crate.yHighest;
    crate.yHighest=0;
    crate.xRemaining=crate.maxX;
    crate.zRemaining=crate.maxZ;
    crate.rectangles.length=0;
    crate.rectangles.push({
        xEnd:crate.maxX,
        zEnd:crate.maxZ,
        zStart:0,
        xStart:0,
        area:crate.maxX*crate.maxZ,
        })
        return (crate);

}

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

var again=function(sku)
{
    for(var i=0;i<problem.length;i++)
    {
        if(problem[i]==sku)
        return 1;
    }
    return 0;
}
//////////////////////////////////
///////////EXECUTION//////////////
//////////////////////////////////
var vol
var layer= function(){


    findCrate();
    var quantity=0,palletNo=1,
    yEnd=data.crate[crateIndex].height;    //redundent
    insertCrate(palletNo,data.crate[crateIndex].length,data.crate[crateIndex].width,data.crate[crateIndex].height);
    console.log("###################################################################################")
    console.log("Adding Pallet No :",palletNo);
    console.log("###################################################################################")

    var priIndex=10;
    var unpacked;                   
    while(priIndex>0)
    {
        setPriority(priIndex);
        layerFlag=1;
        var unpacked=[]
    
        while(layerFlag)
        {
            layerFlag=0;
            for(var j=0;j<currBoxList.length;j++)
            { 
                element=currBoxList[j];
                //////////////////////////////////////////////////////////////////////
                ////////////Check why element is coming again////////////////////////
                /////////////////////////////////////////////////////////////////////
                if(again(element.SKU))
                        {
                            continue;
                        }
                
                element.area=Math.min(
                    element.length*element.width,
                    element.width*element.height,
                    element.height*element.length);
                var or11=0,or21=0,or31=0,or12=0,or22=0,or32=0,found=0,minQuantity=0;
                var final;
                var rectIndex=-1;
                var finalCrate=-1;
                /////////////////////Adding new code from here
                for(var chosenCreate=0;chosenCreate<crates.length;chosenCreate++)
                {
                    var currCrate=crates[chosenCreate];
                    if(currCrate.yRemainig < 1 )       ////////We could Do 0 here lets try later
                    continue;
                    
                    for (var ind=0;ind<currCrate.rectangles.length;ind++)
                    {
                        var rectangle=currCrate.rectangles[ind];

                        if(rectangle.area >= element.area)
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
                                        finalCrate=chosenCreate;
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
                                        finalCrate=chosenCreate;
                                        
                                        
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
                                        finalCrate=chosenCreate;
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
                                        finalCrate=chosenCreate;
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
                                    finalCrate=chosenCreate;
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
                                    finalCrate=chosenCreate;
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
                                        finalCrate=chosenCreate;
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
                                        finalCrate=chosenCreate;
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
                                    finalCrate=chosenCreate;
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
                                    finalCrate=chosenCreate;                                                               
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
                                        finalCrate=chosenCreate;
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
                                        finalCrate=chosenCreate;
                                    }
                                }
                            }
                        }
                    }
                    if(found==1)
                    break;
                    // this means current element cannot be acomodaated in current layer
                    //so we make a new layer to check if element can be accomodated in it or not
                    if(rectIndex==-1)       
                    {
                        var temp=addNewLayer(currCrate);
                        var rectangle=temp.rectangles[0];
                        if(rectangle.area >= element.area)
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
                                        finalCrate=chosenCreate;
                                    }
                                    else if(or11.quantity>minQuantity)
                                    {
                                        final=or11;
                                        minQuantity=or11.quantity;
                                        final.packx=element.length;
                                        final.packz=element.height;
                                        final.packy=element.width;
                                        finalCrate=chosenCreate;
                                        
                                        
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
                                        finalCrate=chosenCreate;
                                        
                                    }
                                    else if(or12.quantity>minQuantity)
                                    {
                                        final=or12;
                                        minQuantity=or12.quantity;
                                        rectIndex=ind;
                                        final.packx=element.height;
                                        final.packz=element.length;
                                        final.packy=element.width;
                                        finalCrate=chosenCreate;
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
                                    finalCrate=chosenCreate;
                                    

                                }
                                else if(or21.quantity>minQuantity)
                                {
                                    final=or21;
                                    minQuantity=or21.quantity;
                                    final.packx=element.length;
                                    final.packz=element.width;
                                    final.packy=element.height;
                                    finalCrate=chosenCreate;
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
                                        finalCrate=chosenCreate;
                                    
                                    }
                                    else if(or22.quantity>minQuantity)
                                    {
                                        final=or22;
                                        minQuantity=or22.quantity;
                                        final.packx=element.width;
                                        final.packz=element.length;
                                        final.packy=element.height;
                                        finalCrate=chosenCreate;
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
                                    finalCrate=chosenCreate;
                                }
                                else if(or31.quantity>minQuantity)
                                {
                                    final=or31;
                                    minQuantity=or31.quantity;
                                    final.packx=element.width;
                                    final.packz=element.height;
                                    final.packy=element.length;
                                    finalCrate=chosenCreate;                                                               
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
                                        finalCrate=chosenCreate;
                                    }
                                    else if(or32.quantity>minQuantity)
                                    {
                                        final=or32;
                                        minQuantity=or32.quantity;
                                        final.packx=element.height;
                                        final.packz=element.width;
                                        final.packy=element.length;
                                        finalCrate=chosenCreate;
                                    }
                                }
                            }

                            ////inserting new layer actually
                            if(rectIndex!=-1)
                            {
                                console.log("Added new permanent layer")
                                crates[chosenCreate]=addNewLayer(currCrate);
                                rectIndex=0;
                                console.log(rectIndex)
                                break;
                            }
                        }

                    }
                }
                //ths means current element cannot be accomodated in any pallet
                //we need to create new pallet for this
                if(rectIndex==-1) 
                {
                    insertCrate();
                   // j=j-1;          //re evaluate this element
                   unpacked.push(element)
                    continue;                   
                }
                    if(final.quantity == element.quantity )
                    {  
                        vol+=element.quantity*(final.packx*final.packy*final.packz);
                        crates[finalCrate].vol -=element.quantity*(final.packx*final.packy*final.packz);
                        crates[finalCrate].boxList.push(element);
                        quantity+=1;
                        layerFlag=1;
                        problem.push(element.SKU);

                        if(final.packy >crates[finalCrate].yHighest)
                        {
                            crates[finalCrate].yHighest=final.packy;
                        }
                        let rect=crates[finalCrate].rectangles[rectIndex];
                        console.log(rect,rectIndex,crates[finalCrate].rectangles.length);
                        console.log("SKU: "+element.SKU+" Place all "+element.quantity+
                                    " packets from x= "+rect.xStart.toFixed(1)+" z= "+rect.zStart.toFixed(1));
                        console.log("In Orientation X= "+final.packx.toFixed(1)+" z = "+final.packz.toFixed(1));
                        console.log("..")
                        crates[finalCrate].rectangles=rectReplace(crates[finalCrate].rectangles,rectIndex,final);       
                    }
                    else if(final.quantity<element.quantity && final.quantity>=1)
                    {
                        layerFlag=1;
                        vol+=(final.quantity*final.packx*final.packy*final.packz);
                        crates[finalCrate].vol-=(final.quantity*final.packx*final.packy*final.packz);

                        if(final.packy >crates[finalCrate].yHighest)
                        {
                            crates[finalCrate].yHighest=final.packy;
                        }
                        let rect=crates[finalCrate].rectangles[rectIndex];
                        console.log("SKU: "+element.SKU+" Place ONLY "+element.quantity+
                                    " packets from x= "+rect.xStart.toFixed(1)+" z= "+rect.zStart.toFixed(1));
                        console.log("In Orientation X= "+final.packx.toFixed(1)+" z = "+final.packz.toFixed(1));
                        console.log("..")
                        crates[finalCrate].rectangles=rectReplace(crates[finalCrate].rectangles,rectIndex,final);
                        let el=element;
                            el.quantity=final.quantity; 
                            crates[finalCrate].boxList.push(el);
                        element.quantity=element.quantity-final.quantity;
                        unpacked.push(element);
                    }
                    else
                    {
                        unpacked.push(element);
                    }

            }
                if(unpacked.length==0)
                {
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ Decreasing Priority Now to "+ priIndex-1 +" $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                    priIndex-=1;
                    if(priIndex<=0)
                    break;
                    setPriority(priIndex);
                    unpacked=currBoxList;
                    layerFlag=1;
                    console.log(currBoxList.length)
                }
                if(unpacked.length!=0)
                {
                    currBoxList=unpacked;
                    unpacked=[]
                    layerFlag=1;
                }
        }
            //done rightly :)
    }
    console.log("Total quantity packed = ",quantity);
    console.log("Remaining to be packed = ", unpacked.length);
 
    console.log(data.crate[crateIndex]);
    console.log("")
    console.log("*****************************************************************");
    console.log("* No of pallets used : ",palletNo,"\t\t\t\t\t*")
    console.log("* No of pallets in most efficient case : ",totalVol/data.crate[crateIndex].vol,"\t*");
    console.log("*****************************************************************");
}

layer()