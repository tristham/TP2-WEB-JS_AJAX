"use strict";

// Variables
let btnObtenir = document.getElementById("btnObtenir");
let selectCurrencies = document.getElementById("selectCurrency");
let selectedCurrency;
let selectArea = document.getElementById("selectState");
let selectedArea;
let exchangeRate = 1.39;  // valeur de test pour eviter de faire plein de fetch avec ma apiKey
let startTime = document.getElementById("startTime");
let endTime = document.getElementById("endTime");
let gasPricesRaw;
let gasPricesFormated = new Array();
let formattedStartTime = 200801; // valeur par defaut
let formattedEndTime = 201801; // valeur par defaut


// Events
startTime.addEventListener("change", getTime);
endTime.addEventListener("change", getTime);
selectCurrencies.addEventListener("change", function(){
    selectedCurrency = selectCurrencies.value;
    console.log("Monnaie choisit: " + selectedCurrency);
});
selectArea.addEventListener("change", function(){
    selectedArea = selectArea.value;
    console.log("État choisit: " + selectedArea);
});
//btnObtenir.addEventListener("click", getExchangeRateToUSD);


// Functions
function getTime(){
    if(checkTime()){
        let startDate = new Date(startTime.value);
        let startMonth = startDate.getMonth() + 1;
        let startYear = startDate.getFullYear();
        let endDate = new Date(endTime.value);
        let endMonth = endDate.getMonth() + 1;
        let endYear = endDate.getFullYear();
        
        if(startMonth < 10){
            startMonth = "0" + startMonth;
        }
        if(startMonth < 10){
            endMonth = "0" + endMonth;
        }

        formattedEndTime = parseInt(endYear+""+endMonth);
        formattedStartTime = parseInt(startYear+""+startMonth);

        // console.log(formattedStartTime);
        // console.log(formattedEndTime);
    }
    else{
        alert("Veuillez entrer une date de début antérieure à la date de fin");
    }
}
function checkTime(){
    if(startTime.value > endTime.value){
        return false;
    }
    return true;
}

// Appel API Currency
async function  getAllCurrencies(){
    let myHeaders = new Headers();
        myHeaders.append("apikey", "j2Alr3JmoVbPkuQHELsnOvj8ShuqrnlF");
        let requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    await fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
    .then(response => response.json())
    .then(function(data){
        for (let key in data.symbols) {
            let option = document.createElement("option");
            option.text = key;
            option.value = key;
            selectCurrency.appendChild(option);
        }
    });
}

async function getExchangeRateToUSD(){
    var myHeaders = new Headers();
    myHeaders.append("apikey", "j2Alr3JmoVbPkuQHELsnOvj8ShuqrnlF");
    
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };
    
    await fetch("https://api.apilayer.com/exchangerates_data/latest?symbols=" + selectedCurrency +"&base=USD", requestOptions)
    .then(response => response.json())
    .then(function(result) { exchangeRate = result.rates[selectedCurrency] })
    .then(function() { console.log(exchangeRate) })
    .catch(error => console.log('error', error));
}

async function getGasPrices(){
    gasPricesRaw = await fetch("http://api.eia.gov/series/?api_key=T7l06GSNDKWNNaugwPbVfEaZebD3QQVu7slXnvuA&start=2008-01-31&end=2008-12-12&series_id=PET.EMM_EPM0_PTE_SMA_DPG.M")
    .then(response => response.json())
    .then(function(result) { gasPricesRaw = result.series[0].data; })
    .then(function() { console.log(gasPricesRaw);})
    .then(function() { return gasPricesRaw })
    .catch(error => console.log('error', error));
};


// On Load
// getAllCurrencies();
getGasPrices();


// Bouton pour tester
document.getElementById('btnTest').addEventListener("click", function(){
    trimDataWithDates();
}); 

function trimDataWithDates(){
    Array.from(gasPricesRaw).forEach(element => {
        let gasTimePrice = {};
        gasTimePrice.Date = element[0];
        gasTimePrice.Price = element[1];
        if(parseInt(gasTimePrice.Date) >= formattedStartTime && parseInt(gasTimePrice.Date) <= formattedEndTime){
            gasPricesFormated.push(gasTimePrice);
        }

    });

    console.log(gasPricesFormated);
    gasPricesFormated.forEach(element => console.log(element));
}