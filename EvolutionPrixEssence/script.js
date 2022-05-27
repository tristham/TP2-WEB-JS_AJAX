"use strict";

// Variables
let selectCurrency = document.getElementById("selectCurrency");

// Appel API Currency
// Source: https://apilayer.com/marketplace/exchangerates_data-api#documentation-tab
var myHeaders = new Headers();
myHeaders.append("apikey", "j2Alr3JmoVbPkuQHELsnOvj8ShuqrnlF");
var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

let allCurrencies;
function getAllCurrencies(){
    fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
