"use strict";

// Variables
let btnObtenir = document.getElementById("btnObtenir");
let selectCurrencies = document.getElementById("selectCurrency");
let selectedCurrency;
let selectArea = document.getElementById("selectState");
let selectedArea;
let exchangeRateToUSD = 1.00;  // valeur par defaut de 1 pour 1 puisqu'on commence en USD
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
    //console.log("Monnaie choisit: " + selectedCurrency);
});
selectCurrencies.addEventListener("change", getExchangeRateToUSD);
selectArea.addEventListener("change", function(){
    selectedArea = selectArea.value;
    //console.log("État choisit: " + selectedArea);
});
selectArea.addEventListener("change", getGasPricesRaw);
btnObtenir.addEventListener("click", trimDataWithDates);
btnObtenir.addEventListener("click", getChart)

// On Load
getAllCurrencies();

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
        if(endMonth < 10){
            endMonth = "0" + endMonth;
        }

        formattedEndTime = parseInt(endYear+""+endMonth);
        formattedStartTime = parseInt(startYear+""+startMonth);
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
            option.text = data.symbols[key];
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
    .then(function(result) { exchangeRateToUSD = result.rates[selectedCurrency] })
    .catch(error => console.log('error', error));
}

async function getGasPricesRaw(){
    selectedArea = selectArea.value;

    gasPricesRaw = await fetch("http://api.eia.gov/series/?api_key=T7l06GSNDKWNNaugwPbVfEaZebD3QQVu7slXnvuA&start=2008-01-31&end=2008-12-12&series_id=" + selectedArea)
    .then(response => response.json())
    .then(function(result) { gasPricesRaw = result.series[0].data; })
    .then(function() { return gasPricesRaw })
    .catch(error => console.log('error', error));
};

function trimDataWithDates(){
    if(gasPricesRaw){
        gasPricesFormated.splice(0,gasPricesFormated.length); // Permet de remettre l'array a 0 si on change de monnaie.
        Array.from(gasPricesRaw).forEach(element => {
            let gasTimePrice = {};
            gasTimePrice.Date = element[0];
            gasTimePrice.Price = element[1];
            if(parseInt(gasTimePrice.Date) >= formattedStartTime && parseInt(gasTimePrice.Date) <= formattedEndTime){
                gasPricesFormated.push(gasTimePrice);
            }
    
        });
    }
}


// --------------------------------- Graph Section ----------------------------------- //

// Variables
let canvas = document.getElementById('Graphique')
let context = canvas.getContext('2d');
let chartExists = false;
let dateToPriceGraph;

// Functions
// src: https://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
// src: https://www.youtube.com/watch?v=sE08f4iuOhA
function getChart(){
    if(gasPricesRaw){
        let prices = gasPricesFormated.map(element => element.Price).reverse();
        prices = prices.map(element => element * exchangeRateToUSD);
        let dates = gasPricesFormated.map(element => element.Date).reverse();
        dates = dates.map(element => element.substring(0,4) + "-" + element.substring(4,6));
    
        if(chartExists){
            dateToPriceGraph.destroy();
            chartExists = false;
        }
        
        dateToPriceGraph = new Chart(context, {
            type: 'line',
            data:{
                labels: dates,
                datasets:[{
                    label: 'Prix',
                    data: prices,
                    backgroundColor: 'cornflowerblue'
                }]
            },
            options:{
                title:{
                    display:true,
                    text:'Prix du pétrole par année'
                }
            }
        });
    
        chartExists = true;
    }
    else{
        alert("Il faut choisir un état !")
    }
}
