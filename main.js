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
