"use strict";

// Variables
let selectCurrency = document.getElementById("selectCurrency");
let startTime = document.getElementById("startTime");
let endTime = document.getElementById("endTime");

//getAllCurrencies();

//Events
startTime.addEventListener("change", getTime);
endTime.addEventListener("change", getTime);
startTime.addEventListener("change", checkTime);
endTime.addEventListener("change", checkTime);


//functions
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

    // await fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions).then(response => response.json())
    // .then(function(data){
    //     for (let key in data.symbols) {
    //         let option = document.createElement("option");
    //         option.text = key;
    //         option.value = key;
    //         selectCurrency.appendChild(option);
    //     }
    // });
}



