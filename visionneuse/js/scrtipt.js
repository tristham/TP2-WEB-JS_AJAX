'use strict'

// Variables globales:
let urlAPI = "https://swapi.dev/api";

let listeFilms = document.getElementById("moviesList");
let contenu = document.getElementById("content");
let planet = document.getElementById("planet");
let planetName = document.getElementById("planetName");
let boutonRotation = document.getElementById("boutonRotation");
let boutonsVitesseRotation = document.querySelectorAll('input[type="radio"]');

let fichiersImages = ["alderaan",
                "coruscant",
                "dagobah",
                "endor",
                "naboo",
                "tatooine",
                "yavin iv"];

let films = [];
let imagesAAfficher = [];
let imageEnCours = 0;

let timer;
let position = 1;
let delais = [1500, 1000, 500];
let delaiEnCours = 1;

// Évenements:
document.getElementById("precedent").addEventListener("click", passerImageSuivante);
document.getElementById("suivant").addEventListener("click", passerImagePrecedente);
boutonRotation.addEventListener("click", activerDesactiverDiaporama);
boutonsVitesseRotation.forEach(boutonRadio => boutonRadio.addEventListener("click", changerVitesse));

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
    action.addEventListener("click", afficherImages);
}

(async function obtenirFilms(){
    let url = urlAPI + "/planets/?search=";
    fichiersImages.forEach(planette => {
        fetch(url + planette)
        .then(reponse => reponse.json())
        .then(result => result.results[0])
        .then(planet => obtenirFilmsSelonPlanette(planet))
        .catch(error => console.error(error));
    });
})();


// Fonctions pour afficher les images:
function afficherImages(e){
    films.filter(film => {
        if(film.title == e.target.innerText)
        {
            imagesAAfficher = film.planets;
        }
    });

    position = 1;
    activerDiaporama();
}

function changerImage()
{
    if(imagesAAfficher.length > 0)
    {
        contenu.style.visibility = "visible";
        imageEnCours = (imageEnCours + position + imagesAAfficher.length) % imagesAAfficher.length;
        planet.setAttribute("src", "images/" + imagesAAfficher[imageEnCours] + ".jpg");
        planet.setAttribute("alt", imagesAAfficher[imageEnCours]);
        planetName.textContent = imagesAAfficher[imageEnCours];
    }
}

function passerImageSuivante()
{
    position = 1;
    changerImage();
}

function passerImagePrecedente()
{
    position = -1;
    changerImage();
}

// Fonctions pour le diaporama:
function activerDesactiverDiaporama()
{
    if(boutonRotation.classList.contains("btn-outline-danger"))
    {
        desactiverDiaporama();
    }
    else
    {
        activerDiaporama();
    }
}

function activerDiaporama()
{
    boutonRotation.classList.remove("btn-outline-success");
    boutonRotation.classList.add("btn-outline-danger");
    boutonRotation.textContent = "Arrêter";

    clearInterval(timer);
    timer = setInterval(changerImage, delais[delaiEnCours]);
}

function desactiverDiaporama()
{
    boutonRotation.classList.remove("btn-outline-danger");
    boutonRotation.classList.add("btn-outline-success");
    boutonRotation.textContent = "Activer";

    clearInterval(timer);
    timer = null;
}

function changerVitesse(e)
{
    delaiEnCours = Array.from(boutonsVitesseRotation).indexOf(e.target);

    if(timer != null)
    {
        clearInterval(timer);
        timer = setInterval(changerImage, delais[delaiEnCours]);
    }
}
