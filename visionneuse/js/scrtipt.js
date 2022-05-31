'use strict'

// Variables globales:
let urlAPI = "https://swapi.dev/api";
let listeFilms = document.getElementById("moviesList");
let images = ["alderaan",
            "coruscant",
            "dagobah",
            "endor",
            "naboo",
            "tatooine",
            "yavin iv"];

let films = [];

// Fonctions pour récupérer les données et lister les films:
function obtenirFilmsSelonPlanette(planet){
    planet.films.forEach(film => {
        fetch(film)
        .then(reponse => reponse.json())
        .then(result => {
            if(!films.some(film => film.title == result.title))
            {
                films.push({'title': result.title, 'planets': [planet.name.toLowerCase()]});
                ajouterFilmAListe(result.title);
            }
            else
            {
                films.filter(film => {
                    if(film.title == result.title)
                    {
                        film.planets.push(planet.name.toLowerCase());
                    }
                });
            }
        })
        .catch(error => console.error(error));
    });
}

function ajouterFilmAListe(film)
{
    let action = document.createElement("a");
    action.classList.add("dropdown-item");
    action.setAttribute("href", "#");
    action.textContent = film;
    listeFilms.appendChild(action);
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
