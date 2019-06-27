var initialize=function(){
const xlsx = require('xlsx');
var wb =xlsx.readFile('./rawData.xlsx');
var ws=wb.Sheets[wb.SheetNames[0]];
    data =xlsx.utils.sheet_to_json(ws);
    data.forEach(element => {
    if (element.vol !=undefined)
        {
            console.log(element.SKU)
            totalBoxVol=totalBoxVol+element.Vol;
        }
        else
        {
            console.log(1+element.vol)
        data.splice(element);
        }
    });
};
var totalBoxVol=0.0,
    totalCrateVol=0.0,
    data;

initialize();

console.log(data);