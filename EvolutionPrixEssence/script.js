"use strict";

// Variables
let btnObtenir = document.getElementById("btnObtenir");
let selectCurrencies = document.getElementById("selectCurrency");
let selectedCurrency;
let exchangeRate;
let startTime = document.getElementById("startTime");
let endTime = document.getElementById("endTime");


// Events
startTime.addEventListener("change", getTime);
endTime.addEventListener("change", getTime);
selectCurrencies.addEventListener("change", function(){
    selectedCurrency = selectCurrencies.value;
    console.log(selectedCurrency);
});
btnObtenir.addEventListener("click", getExchangeRateToUSD);


// Functions
function getTime(){
    if(checkTime()){
        let startDate = new Date(startTime.value);
        let startMonth = startDate.getMonth();
        let startYear = startDate.getFullYear();
    
        let endDate = new Date(endTime.value);
        let endMonth = endDate.getMonth() + 1;
        let endYear = endDate.getFullYear();
    
        console.log(startMonth + " " + startYear);
        console.log(endMonth + " " + endYear);
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

    // await fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
    // .then(response => response.json())
    // .then(function(data){
    //     for (let key in data.symbols) {
    //         let option = document.createElement("option");
    //         option.text = key;
    //         option.value = key;
    //         selectCurrency.appendChild(option);
    //     }
    // });
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

//getExchangeRateToUSD();


// On Load
//getAllCurrencies();

