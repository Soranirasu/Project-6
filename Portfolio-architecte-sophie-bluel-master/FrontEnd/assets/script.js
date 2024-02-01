//Utiliser fetch pour envoyer la requête GET à l'URL de l'API
try {
    fetch('http://localhost:5678/api/works')
        //L'API renvoie les données sous forme de réponse et on extrait ces données avec response.json()
        .then(response => {
            return response.json();
        })

        .then(donnees => {
            console.log(donnees);
            //Une boucle pour chaque work
            donnees.forEach((work) => {
                //création de la balise <figure>
                let newFigure = document.createElement('figure');
                newFigure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>`
                //Ajout d'une classe à <figure> pour pouvoir sélectionner les boutons
                newFigure.classList.add('boutons');
                newFigure.setAttribute("categorie", work.categoryId);
                //Ajouter la balise <figure> qu'on vient de créer dans la galerie déjà existante
                document.querySelector("div.gallery").appendChild(newFigure);1

            });

            // Associer un événement au logo "Mode édition" pour afficher la modale
            editModeLogo.addEventListener('click', function () {
                const editModal = document.querySelector('#modale');

                console.log(editModal);

                editModal.style.display = 'block';

                galleryInvoc(donnees)

            });

            //Repasser au premier affichage de la modale au clic sur la flèche
            const arrowLeft = document.querySelector('.fa-arrow-left');

            arrowLeft.addEventListener('click', function () {
                document.querySelector('.ajout').style.display = 'none';
                document.querySelector('.modale-1').style.display = 'block';
            });

            // Fermer la modale si l'utilisateur clique en dehors de celle-ci
            window.addEventListener('click', function (event) {
                if ((event.target).closest('#modale') == null && event.target != document.querySelector('#edit-mode-logo')) {
                    document.querySelector('#modale').style.display = 'none';

                    //Repasser la div "ajout" en display:none et la div "modale-1" en display:block lorsqu'on ferme la modale
                    document.querySelector('.ajout').style.display = 'none';
                    document.querySelector('.modale-1').style.display = 'block';
                }
            })

            //Fermer la modale quand on clique sur la 1ere croix
            const iconCross = document.querySelectorAll(".fa-xmark");

            iconCross.forEach(icon => {
                icon.addEventListener('click', function() {
                    document.querySelector('#modale').style.display = 'none';
                });
            });
        })
}
catch (error) {
    console.log(error);
}

//Ajout des filtres de catégories pour filtrer les work dans la gallerie
try {
    fetch("http://localhost:5678/api/categories")
        .then(response => {
            return response.json();
        })

        .then(donnees => {
            let categories = donnees;
            //option permettant d'afficher tous les travaux par défaut
            categories.unshift({ id: 0, name: 'Tous' })
            console.log(donnees);
            //Une boucle pour générer un boutton pour chaque catégorie
            donnees.forEach((category, index) => {
                //Création de <button> pour filtrer
                let newButton = document.createElement('button');
                //Ajout d'un attribut qui contient la catégorie pour chaque Figure
                newButton.setAttribute("categorie", `${category.id}`);
                newButton.innerText = `${category.name}`
                //Click Event <button> pour filtrer
                newButton.addEventListener('click', function (event) {
                    let buttonCategory = event.target.getAttribute("categorie");
                    const allButtons = document.querySelectorAll(".boutons");

                    allButtons.forEach((oneButton) => {
                        //récupérer l'attribut catégorie sur les figures
                        const figureCategory = oneButton.getAttribute("categorie");
                        if (figureCategory == buttonCategory || buttonCategory == 0) {
                            //on veut l'afficher
                            oneButton.style.display = "block";
                        }
                        else {
                            oneButton.style.display = "none";
                        }
                    })
                })


                document.querySelector(".filtres").appendChild(newButton);

            })




        })
}
catch (error) {
    console.log(error);
}


// Vérifier si le token est présent dans le local storage
const token = localStorage.getItem('monToken');

console.log(token);

// Sélectionner le bouton login/logout
const loginButton = document.querySelector('.nav-login');
const logoutButton = document.getElementById('logout');

// Si le token est présent, afficher la barre et masquer le bouton login
if (token) {
    const topBar = document.getElementById('top-bar');
    if (topBar) {
        topBar.style.display = 'flex';
    }
    if (loginButton) {
        loginButton.style.display = 'none';
    }
    if (logoutButton) {
        logoutButton.style.display = 'flex';
    }
}

//Ouvrir la modale au clic sur le logo du mode edition
// Sélectionner la modale et le logo "Mode édition"
const editModal = document.getElementById('modale');
const editModeLogo = document.getElementById('edit-mode-logo');

//On envoie la variable qui contient les données
function galleryInvoc(donnees) {
    //Quand on ouvre la modale, on la vide avant de la remplir (et éviter de la reremplir à chaque fois un peu plus)
    document.querySelector(".modale-gallery").innerHTML = "";
    donnees.forEach((work) => {
        //création de la balise <figure>
        let newFigure = document.createElement('figure');
        newFigure.innerHTML = `
        <div class="imgGallery"> 
            <i class="fa-solid fa-trash-can"></i> 
        </div>   
        `
        newFigure.querySelector(".imgGallery").style.backgroundImage = `url("${work.imageUrl}")`

        //Ajouter la balise <figure> qu'on vient de créer dans la galerie déjà existante
        newFigure.classList.add("figureGallery");

        document.querySelector(".modale-gallery").appendChild(newFigure);

    });
}

//création d'une fonction qui contiendra tout ce qu'on a dans l'addEventListener ('change)
function changeContent(event) {
    // Récupérer le fichier téléchargé
    const file = event.target.files[0];

    // Afficher l'image dans la modale
    if (file) {
        // Masquer l'icône, le bouton et le paragraphe
        let basicContent = document.querySelector(".basic-content");
        basicContent.style.display = 'none';

        // Créer un élément image
        let newImage = document.createElement('img');
        newImage.src = URL.createObjectURL(file);

        // Ajouter du style à l'image (hauteur de 250px)
        newImage.style.height = '250px';

        // Ajouter l'image à la modale
        let ajoutButton = document.querySelector(".ajout-button");
        // Insérer l'image juste avant la classe "title"
        ajoutButton.appendChild(newImage);
    }
}

// Ajouter le bouton "Ajouter une photo"
let addButton = document.querySelector("#ajouter");
addButton.addEventListener('click', function () {
    // Logique pour ajouter une nouvelle photo
    console.log("Ajout");

    let modale1 = document.querySelector(".modale-1")
    modale1.style.display = 'none'

    let ajouter = document.querySelector(".ajout")
    ajouter.style.display = 'block'

    // Ajouter un gestionnaire d'événements pour le champ d'entrée de type file
    let fileInput = document.getElementById('fileInput');
    fileInput.removeEventListener('change', changeContent, true);

    fileInput.addEventListener('change', changeContent);
});



