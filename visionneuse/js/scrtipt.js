'use strict'

let urlAPI = "https://swapi.dev/api";

let images = ["alderaan",
            "coruscant",
            "dagobah",
            "endor",
            "naboo",
            "tatooine",
            "yavin iv"];

let listeFilms = document.getElementById("moviesList");
let films = [];

function obtenirFilmsSelonPlanette(planet){
    planet.films.forEach(film => {
        fetch(film)
        .then(reponse => reponse.json())
        .then(result => {
            if(!films.some(film => film.title == result.title))
            {
                films.push({'title': result.title, 'planets': [planet.name]});
            }
            else
            {
                films.filter(film => {
                    if(film.title == result.title)
                    {
                        film.planets.push(planet.name);
                    }
                });
            }
        })
        .catch(error => console.error(error));
    });
}

(async function obtenirFilms(){
    let url = urlAPI + "/planets/?search=";
    images.forEach(planette => {
        fetch(url + planette)
        .then(reponse => reponse.json())
        .then(result => result.results[0])
        .then(planet => obtenirFilmsSelonPlanette(planet))
        .catch(error => console.error(error));
    });
})();

// function ajouterFilmAListe(film)
// {
//     let action = document.createElement("a");
//     action.classList.add("dropdown-item");
//     action.setAttribute("href", "#");
//     action.textContent = film.title;
//     listeFilms.appendChild(action);
// }


