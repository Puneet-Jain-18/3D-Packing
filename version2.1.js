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
var cannotBePacked=[];
//////////////////////////////////
///////////FUNCTIONS//////////////
//////////////////////////////////

////currently selecting maximum volume crate
var insertCrate=async function(palletNo,x,z,y)
{
    var newCrate={
        palletNo:palletNo,
        xRemaining:x,
        yRemaining:y,
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
    crate.yRemaining-=crate.yHighest;
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
var layer= async function(){


    findCrate();
    var quantity=0,palletNo=1;
    insertCrate(palletNo,data.crate[crateIndex].length,data.crate[crateIndex].width,data.crate[crateIndex].height);

    console.log("::::::Welcome to pallet packing ::::::")
    console.log("\n\n Please place the number boxes displayed along the X-axis of the pallet. ")
    console.log("Move to A upper row if row is full. \n");
    console.log("###################################################################################")
    console.log("Adding Pallet No :",palletNo);
    console.log("###################################################################################")

    var priIndex=10;  
    setPriority(priIndex);
        var unpacked=[];       ;
        var layerFlag=0;    
        var zflag=0;   
    while(priIndex>0)
    {
        layerFlag=1;
        while(layerFlag)
        {
            layerFlag=0;
            var rectangle;
            for(var j=0;j<currBoxList.length;j++)
            {
                element=currBoxList[j];
                //////////////////////////////////////////////////////////////////////
                ////////////Check why element is coming again////////////////////////
                /////////////////////////////////////////////////////////////////////
                if(await again(element.SKU))
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
                    if(currCrate.yRemaining < (Math.min(element.length,element.width,element.height)) )       ////////We could Do 0 here lets try later
                    continue;
                    
                    for (var ind=0;ind<currCrate.rectangles.length;ind++)
                    {
                        rectangle=currCrate.rectangles[ind];

                        if(rectangle.area >= element.area)
                        {

                            xStart=rectangle.xStart;
                            xEnd=rectangle.xEnd;
                            zStart=rectangle.zStart;
                            zEnd=rectangle.zEnd;

                            if(element.width<=currCrate.yRemaining)
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
                            if(found==0 && element.height<=currCrate.yRemaining)
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
                            if(found==0 && element.length<=currCrate.yRemaining)
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
                    //so we make a new temporary layer to check if element can be accomodated in it or not
                    //Addition of  new layer  working properly  :) 
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

                            if(element.width<=currCrate.yRemaining)
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
                                        rectIndex=0;
                                    }
                                    else if(or11.quantity>minQuantity)
                                    {
                                        final=or11;
                                        minQuantity=or11.quantity;
                                        final.packx=element.length;
                                        final.packz=element.height;
                                        final.packy=element.width;
                                        finalCrate=chosenCreate;
                                        rectIndex=0;
                                        
                                        
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
                                        rectIndex=0;
                                        finalCrate=chosenCreate;
                                        
                                    }
                                    else if(or12.quantity>minQuantity)
                                    {
                                        final=or12;
                                        minQuantity=or12.quantity;
                                        rectIndex=0;
                                        final.packx=element.height;
                                        final.packz=element.length;
                                        final.packy=element.width;
                                        finalCrate=chosenCreate;
                                    }
                                }
                            }
                            if(found==0 && element.height<=currCrate.yRemaining )
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
                                    rectIndex=0;
                                    

                                }
                                else if(or21.quantity>minQuantity)
                                {
                                    final=or21;
                                    minQuantity=or21.quantity;
                                    final.packx=element.length;
                                    final.packz=element.width;
                                    final.packy=element.height;
                                    finalCrate=chosenCreate;
                                    rectIndex=0;
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
                                        rectIndex=0;
                                    
                                    }
                                    else if(or22.quantity>minQuantity)
                                    {
                                        final=or22;
                                        minQuantity=or22.quantity;
                                        final.packx=element.width;
                                        final.packz=element.length;
                                        final.packy=element.height;
                                        finalCrate=chosenCreate;
                                        rectIndex=0;
                                    }
                                }
                            }
                            if(found==0 && element.length<=currCrate.yRemaining)
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
                                    rectIndex=0;
                                }
                                else if(or31.quantity>minQuantity)
                                {
                                    final=or31;
                                    minQuantity=or31.quantity;
                                    final.packx=element.width;
                                    final.packz=element.height;
                                    final.packy=element.length;
                                    finalCrate=chosenCreate;  
                                    rectIndex=0;                                                             
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
                                        rectIndex=0;
                                    }
                                    else if(or32.quantity>minQuantity)
                                    {
                                        final=or32;
                                        minQuantity=or32.quantity;
                                        final.packx=element.height;
                                        final.packz=element.width;
                                        final.packy=element.length;
                                        finalCrate=chosenCreate;
                                        rectIndex=0;
                                    }
                                }
                            }

                            ////inserting new layer actually
                            if(rectIndex!=-1)
                            {
                                crates[chosenCreate]=addNewLayer(currCrate);
                                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                                console.log("\nAdd new  layer in pallet NO", chosenCreate+1 ," Y Remaining:",crates[chosenCreate].yRemaining )
                                console.log("\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                                rectIndex=0;
                                break;
                            }
                        }

                    }
                }
                //ths means current element cannot be accomodated in any pallet
                //we need to create new pallet for this
                if(rectIndex==-1) 
                {
                    palletNo+=1;
            await insertCrate(palletNo,data.crate[crateIndex].length,data.crate[crateIndex].width,data.crate[crateIndex].height);
                    console.log("#################################################################################");
                    console.log("\nInserting new crate",crates[crates.length-1].palletNo);
                    console.log("\n#################################################################################");
                    rectangle=crates[crates.length-1].rectangles[0];
                    var currCrate=crates[crates.length-1];
                    

                    if(rectangle.area >= element.area)
                    {

                        xStart=rectangle.xStart;
                        xEnd=rectangle.xEnd;
                        zStart=rectangle.zStart;
                        zEnd=rectangle.zEnd;
                        if(element.width<=currCrate.yRemaining)
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
                                    rectIndex=0;
                                }
                                else if(or11.quantity>minQuantity)
                                {
                                    final=or11;
                                    minQuantity=or11.quantity;
                                    final.packx=element.length;
                                    final.packz=element.height;
                                    final.packy=element.width;
                                    finalCrate=chosenCreate;
                                    rectIndex=0;
                                    
                                    
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
                                    rectIndex=0;
                                    finalCrate=chosenCreate;
                                    
                                }
                                else if(or12.quantity>minQuantity)
                                {
                                    final=or12;
                                    minQuantity=or12.quantity;
                                    rectIndex=0;
                                    final.packx=element.height;
                                    final.packz=element.length;
                                    final.packy=element.width;
                                    finalCrate=chosenCreate;
                                }
                            }
                        }
                        if(found==0 && element.height<=currCrate.yRemaining )
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
                                rectIndex=0;
                                

                            }
                            else if(or21.quantity>minQuantity)
                            {
                                final=or21;
                                minQuantity=or21.quantity;
                                final.packx=element.length;
                                final.packz=element.width;
                                final.packy=element.height;
                                finalCrate=chosenCreate;
                                rectIndex=0;
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
                                    rectIndex=0;
                                
                                }
                                else if(or22.quantity>minQuantity)
                                {
                                    final=or22;
                                    minQuantity=or22.quantity;
                                    final.packx=element.width;
                                    final.packz=element.length;
                                    final.packy=element.height;
                                    finalCrate=chosenCreate;
                                    rectIndex=0;
                                }
                            }
                        }
                        if(found==0 && element.length<=currCrate.yRemaining)
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
                                rectIndex=0;
                            }
                            else if(or31.quantity>minQuantity)
                            {
                                final=or31;
                                minQuantity=or31.quantity;
                                final.packx=element.width;
                                final.packz=element.height;
                                final.packy=element.length;
                                finalCrate=chosenCreate;  
                                rectIndex=0;                                                             
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
                                    rectIndex=0;
                                }
                                else if(or32.quantity>minQuantity)
                                {
                                    final=or32;
                                    minQuantity=or32.quantity;
                                    final.packx=element.height;
                                    final.packz=element.width;
                                    final.packy=element.length;
                                    finalCrate=chosenCreate;
                                    rectIndex=0;
                                }
                            }
                        }

                        ////inserting new layer actually
                        if(rectIndex!=-1)
                        {
                            
                            crates[chosenCreate]=addNewLayer(currCrate);
                            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                            console.log("\nAdd new  layer in pallet NO", chosenCreate+1 ," Y Remaining:",crates[chosenCreate].yRemaining )
                            console.log("\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                            rectIndex=0;
                            break;
                        }
                    }
                    else
                    {
                        unpacked.push(element);
                        continue;
                    }
                    finalCrate=crates.length-1;
                    rectIndex=0;

                }

                //Checking if whole quantity can be accomodated or not
                    if(final.quantity == element.quantity && element.quantity>0)
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
                        console.log("Inside pallet no :",crates[finalCrate].palletNo);
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


                        console.log("Inside Pallet No :",crates[finalCrate].palletNo);
                        console.log("SKU: "+element.SKU+" Place ONLY "+final.quantity+
                                    " packets  starting from x= "+rect.xStart.toFixed(1)+" z= "+rect.zStart.toFixed(1));
                        console.log("In Orientation X= "+final.packx.toFixed(1)+" z = "+final.packz.toFixed(1));
                        console.log("..")
                        crates[finalCrate].rectangles=rectReplace(crates[finalCrate].rectangles,rectIndex,final);
                        var el={...element};
                           el.quantity=final.quantity;
                           el.packx=final.packx;
                           el.packz=final.packz; 
                            crates[finalCrate].boxList.push(el);
                        element.quantity=element.quantity-final.quantity;
                       currBoxList.push(element);
                    }
                    else
                    {
                      cannotBePacked.push(element)
                    }
            }
                
             
        }
        if(unpacked.length!=0)
            {
                unpacked.forEach(element=>{
                    cannotBePacked.push(element);
                })
                unpacked=[];
            }
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ Decreasing Priority Now to "+ (priIndex-1) +" $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                priIndex-=1;
                if(priIndex<=0)
                break;
                setPriority(priIndex);
            //done rightly :)
    }
    console.log("Total quantity packed = ",quantity);
    console.log("Remaining to be packed = ", cannotBePacked.length);
 
    console.log("")
    console.log("*****************************************************************");
    console.log("* No of pallets used : ",palletNo,"\t\t\t\t\t*")
    console.log("* No of pallets in most efficient case : ",totalVol/data.crate[crateIndex].vol,"\t*");
    console.log("*****************************************************************");
    console.log(data.box.length)
    
}

layer()
