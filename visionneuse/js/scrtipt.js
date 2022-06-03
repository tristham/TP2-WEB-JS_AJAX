'use strict'

// Variables globales:
let urlAPI = "https://swapi.dev/api";

let boutonListe = document.getElementById("movies");
let listeFilms = document.getElementById("moviesList");
let controles = document.getElementsByClassName("control");
let planet = document.getElementById("planet");
let image = document.getElementById("image");
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

let nombrePlanettesTraitees = 0;
var filmsTraites;

let imagesAAfficher = [];
let imageEnCours = 0;

let timer;
let position = 1;
let delais = [1500, 1000, 500];
let delaiEnCours = 1;

let erreurChargement = false;

// Évenements:
document.getElementById("precedent").addEventListener("click", passerImageSuivante);
document.getElementById("suivant").addEventListener("click", passerImagePrecedente);
boutonRotation.addEventListener("click", activerDesactiverDiaporama);
boutonsVitesseRotation.forEach(boutonRadio => boutonRadio.addEventListener("click", changerVitesse));

// Initialisation de la page:
obtenirPlanettes();

// Fonctions pour récupérer les données des planettes et lister les films:
function obtenirPlanettes(){
    let url = urlAPI + "/planets/?search=";
    fichiersImages.forEach(async planette => {
        await fetch(url + planette)
        .then(reponse => reponse.json())
        .then(result => result.results[0])
        .then(planet => {
            obtenirFilmsSelonPlanette(planet);
            nombrePlanettesTraitees++;
        })
        .catch(error => {
            console.log('error: ', error);
            erreurChargement = true;
            afficherErreur();
        });
    });
}

function obtenirFilmsSelonPlanette(planet){
    planet.films.forEach(async urlFilm => {
        filmsTraites = films.filter(film => film.url == urlFilm);
        if(filmsTraites.length > 0)
        {
            filmsTraites[0]['planets'].push(planet.name.toLowerCase());
        }
        else
        {
            films.push({'title': '', 'url': urlFilm, 'planets': [planet.name.toLowerCase()]});
            await fetch(urlFilm)
            .then(reponse => reponse.json())
            .then(result => {
                 //L'appel asynchrone ne semble pas permettre la persistance des variables globales ou locales assignées avant la réponse obtenue
                 //si d'autres promesses ont été traitées entre temps, pour l'exemple avec filmsTraitres déclarée globalement:
                 //filmsTraites[0]['title'] = result.title; => ne fonctionne pas.
                films.filter(film => film.url == urlFilm)[0]['title'] = result.title;
                ajouterFilmAListe(result.title);
            })
            .catch(error => {
                console.log('error: ', error);
                erreurChargement = true;
                afficherErreur();
            });
        }
        if(planet.films.indexOf(urlFilm) == planet.films.length - 1)
        {
            verifierChargementTermine();
        }
    });
}

function ajouterFilmAListe(film)
{
    // Elements de liste avec un style "custom" de BootStrap, une "<div>" remplace le "<select>"
    // et les "<a>" remplacent les <option>. L'assignation de l'attribut "href" semble obligatoire
    // pour un bon fonctionnement.
    let action = document.createElement("a");
    action.classList.add("dropdown-item");
    action.setAttribute("href", "#");
    action.textContent = film;
    listeFilms.appendChild(action);
    action.addEventListener("click", afficherImages);
}

//Fonctions pour afficher le contenu ou erreur s'il y a, après le chargement des données:
function verifierChargementTermine()
{
    if(nombrePlanettesTraitees == fichiersImages.length && erreurChargement == false)
    {
        afficherContenu();
    }
}

function afficherContenu()
{
    image.classList.add("border");
    image.classList.add("rounded");
    image.classList.add("border-warning");
    image.classList.add("p-2");
    image.classList.replace("col-4", "col-12");

    document.getElementById("imagePosition").style.color = "white";

    planet.style.borderRadius = "0%";
    planet.setAttribute("src", "images/" + "loaded" + ".jpg");
    planet.setAttribute("alt", "Logo Star Wars");

    planetName.textContent = "";
    planetName.style.fontFamily = '"SF Distant Galaxy Outline", sans-serif';
    planetName.style.top = "90%";

    boutonListe.style.visibility = "visible";
}

function afficherErreur()
{
    planetName.textContent = "Erreur de chargement";
}

// Fonctions pour afficher les images:
function afficherImages(e){
    films.filter(film => {
        if(film.title == e.target.innerText)
        {
            imagesAAfficher = film.planets;
        }
    });

    boutonListe.textContent = e.target.innerText;
    position = 1;
    activerDiaporama();
}

function changerImage()
{
    if(imagesAAfficher.length > 0)
    {
        Array.from(controles).forEach(control => control.style.visibility = "visible");
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
    if(timer !== null)
    {
        lancerTimer();
    }
}

function passerImagePrecedente()
{
    position = -1;
    changerImage();
    if(timer !== null)
    {
        lancerTimer();
    }
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

    lancerTimer();
}

function desactiverDiaporama()
{
    boutonRotation.classList.remove("btn-outline-danger");
    boutonRotation.classList.add("btn-outline-success");
    boutonRotation.textContent = "Activer";

    clearInterval(timer);
    timer = null;
}

// Fonctions pour le timer:
function changerVitesse(e)
{
    delaiEnCours = Array.from(boutonsVitesseRotation).indexOf(e.target);

    if(timer != null)
    {
        lancerTimer();
    }
}

function lancerTimer()
{
    clearInterval(timer);
    timer = setInterval(changerImage, delais[delaiEnCours]);
}
