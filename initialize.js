var initialize=function(){
const xlsx = require('xlsx');
var wb =xlsx.readFile('./rawData.xlsx');
var ws=wb.Sheets[wb.SheetNames[0]];
    dataTemp =xlsx.utils.sheet_to_json(ws);
    dataTemp.forEach(element => {
        //////////////////////////////////
        //CHANGE VOLUME TO QUANTITY HERE//
        /////////////////////////////////
    if (element.vol)              
        {
            data.push(element);
            console.log(element.SKU)
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
        x:2,
        y:4,
        z:6,
        vol:0
        },
        {
        x:2,
        y:4,
        z:6,
        vol:0
        },
        {
        x:2,
        y:4,
        z:6,
        vol:0
        }
],
    dataTemp,
    data=[];

initialize();

console.log(data);
console.log(crate[1].vol)
module.exports={
    box:data,
    crate:crate,
}
