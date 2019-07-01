var initialize=function(){
const xlsx = require('xlsx');
var wb =xlsx.readFile('./rawData.xlsx');
var ws=wb.Sheets[wb.SheetNames[0]];
    dataTemp =xlsx.utils.sheet_to_json(ws);
    dataTemp.forEach(element => {
        //////////////////////////////////
        //CHANGE VOLUME TO QUANTITY HERE//
        /////////////////////////////////
        /////////////////////////////////////
        //Round Off value to upper integer//
        ////////////////////////////////////
    if (element.vol)              
        {
            layers.dim.add(element.height).add(element.width).add(element.length);
            data.push(element);
            totalBoxVol=totalBoxVol+element.vol;
        }
    });
    crate.forEach(element=>{
        element.vol=element.x*element.y*element.z;
    })
};
var totalBoxVol=0.0,
    crate=[
        {
        x:2, y:4, z:6,vol:0
        },
        {
        x:2,y:4,z:6,vol:0
        },
        {
        x:2,y:4,z:6,vol:0
        },
],
    dataTemp,
    data=[],
    layers={
        dim:new Set(),
        val:null
    }
    

initialize();
layers.dim=[...layers.dim]
layers.dim=layers.dim.sort()  //spread values in set
module.exports={
    box:data,
    crate:crate,
    layers:layers,
    totalBoxVol:totalBoxVol
}
