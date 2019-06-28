var initialize=function(){
const xlsx = require('xlsx');
var wb =xlsx.readFile('./rawData.xlsx');
var ws=wb.Sheets[wb.SheetNames[0]];
    data =xlsx.utils.sheet_to_json(ws);
    data.forEach(element => {
    if (element.vol)
        {
            data_final.push(element);
            console.log(element.SKU)
            totalBoxVol=totalBoxVol+element.vol;
        }
    });
};
var totalBoxVol=0.0,
    totalCrateVol=0.0,
    data,
    data_final=[];

initialize();

console.log(data_final);
console.log(totalBoxVol)
