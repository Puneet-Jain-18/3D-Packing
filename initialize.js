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
            totalBoxVol=totalBoxVol+(element.vol*element.quantity);
        }
    });
    crate.forEach(element=>{
        element.vol=element.length*element.width*element.height;
    })
};
var totalBoxVol=0.0,
    crate=[
        {
            length:400,width:600,height:720,vol:0       ///please place the biggest crate first
        },
        {
        length:600, width:400, height:350,vol:0
        },
        {
        length:500,width:400,height:350,vol:0
        },
],
    dataTemp,
    data=[],
    layers={
        dim:new Set(),
        val:[]
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
