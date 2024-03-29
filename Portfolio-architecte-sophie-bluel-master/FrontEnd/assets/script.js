//Utiliser fetch pour envoyer la requête GET à l'URL de l'API
try {
    fetch('http://localhost:5678/api/works')
        //L'API renvoie les données sous forme de réponse et on extrait ces données avec response.json()
        .then(response => {
            return response.json();
        })

        .then(donnees => {
            const figuresGallery = document.querySelector('.figures-gallery');
            //Une boucle pour chaque work
            donnees.forEach((work) => {
                //création de la balise <figure>
                let newFigure = document.createElement('figure');
                newFigure.id = work.id;
                newFigure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>`
                //Ajout d'une classe à <figure> pour pouvoir sélectionner les boutons
                newFigure.classList.add('boutons');
                newFigure.setAttribute("categorie", work.categoryId);
                //Ajouter la balise <figure> qu'on vient de créer dans la galerie déjà existante
                figuresGallery.appendChild(newFigure);

            });

            // Associer un événement au logo "Mode édition" pour afficher la modale
            editModeLogo.addEventListener('click', function () {
                const editModal = document.querySelector('#modale');


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

                    //Réinitialiser le contenu de l'input à la fermeture
                    let fileInput = document.getElementById('fileInput');
                    fileInput.value = null;

                    //Afficher de nouveau l'icône, le bouton et le paragraphe
                    let basicContent = document.querySelector(".basic-content");
                    basicContent.style.display = 'flex';

                    //Supprimer l'image ajoutée à la fermeture de la modale
                    const addedImage = document.querySelector('.ajout-button img');
                    if (addedImage) {
                        addedImage.remove();
                    }
                    // Réinitialiser le champ de l'image
                    fileInput.value = null;
                    titleInput.value = '';
                    categorySelect.selectedIndex = 0;
                }
            })

            //Fermer la modale quand on clique sur une croix
            const iconCross = document.querySelectorAll(".fa-xmark");

            iconCross.forEach(icon => {
                icon.addEventListener('click', function () {
                    document.querySelector('#modale').style.display = 'none';

                    //Intervertir l'affichage des div dans la modale lorsque cette dernière se ferme
                    document.querySelector('.ajout').style.display = 'none';
                    document.querySelector('.modale-1').style.display = 'block';

                    fileInput.value = null;

                    //Afficher de nouveau l'icône, le bouton et le paragraphe
                    let basicContent = document.querySelector(".basic-content");
                    basicContent.style.display = 'flex';

                    //Pour supprimer l'image ajoutée
                    // Masquer l'image ajoutée
                    const addedImage = document.querySelector('.ajout-button img');
                    if (addedImage) {
                        addedImage.remove();
                    }
                    // Réinitialiser le champ de l'image
                    fileInput.value = null;
                    titleInput.value = '';
                    categorySelect.selectedIndex = 0;
                });
            });
        })
}
catch (error) {
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

            // Sélectionnez tous les boutons de la classe .filtres
            const filterButtons = document.querySelectorAll('.filtres button');

            // Ajout d'un gestionnaire d'événements à chaque bouton
            filterButtons.forEach(button => {
                button.addEventListener('click', function () {
                    // Réinitialiser les styles de tous les boutons
                    filterButtons.forEach(btn => {
                        btn.style.color = '#1D6154';
                        btn.style.backgroundColor = 'rgb(246, 246, 235)';
                    });

                    // Mettre à jour les styles du bouton cliqué
                    this.style.color = 'white';
                    this.style.backgroundColor = '#1D6154';
                });
            });
        })
}
catch (error) {
}



// Vérifier si le token est présent dans le local storage
const token = localStorage.getItem('monToken');

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

// Gestrionnaire d'événements pour le logout
logoutButton.addEventListener('click', function () {
    //Supprimer le token d'authentification du local storage
    localStorage.removeItem('monToken');

    // Cacher la barre et afficher le bouton de connection
    const topBar = document.getElementById('top-bar');
    if (topBar) {
        topBar.style.display = 'none';
    }
    if (loginButton) {
        loginButton.style.display = 'flex';
    }

    // Cacher le bouton de déconnection
    logoutButton.style.display = 'none';
});

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
            <div class="corbeille">
                <i class="fa-solid fa-trash-can" data-work-id="${work.id}"></i> 
            </div>    
        </div>   
        `
        newFigure.querySelector(".imgGallery").style.backgroundImage = `url("${work.imageUrl}")`

        //Ajouter la balise <figure> qu'on vient de créer dans la galerie déjà existante
        newFigure.classList.add("figureGallery");

        document.querySelector(".modale-gallery").appendChild(newFigure);

    });
    suppression();
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

        // Ajouter du style à l'image (hauteur de 100px)
        newImage.style.height = '100px';

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

    let modale1 = document.querySelector(".modale-1")
    modale1.style.display = 'none'

    let ajouter = document.querySelector(".ajout")
    ajouter.style.display = 'block'

    // Ajouter un gestionnaire d'événements pour le champ d'entrée de type file
    let fileInput = document.getElementById('fileInput');
    fileInput.removeEventListener('change', changeContent, true);

    fileInput.addEventListener('change', changeContent);
});

//Ajout des catégories dans l'onglet déroulant Catégories
fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(data => {
        const selectElement = document.getElementById('category-select');

        // On réinitialise les options existantes
        selectElement.innerHTML = '';

        // Ajouter une option vide en premier
        const emptyOption = document.createElement('option');
        emptyOption.value = ''; // Valeur vide
        emptyOption.textContent = ''; // Texte vide
        selectElement.appendChild(emptyOption);

        // Ajout d'une option pour chaque catégorie
        data.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id; // Définir la valeur de l'option sur l'identifiant de la catégorie
            option.textContent = category.name; // Définir le texte de l'option sur le nom de la catégorie
            selectElement.appendChild(option); // Ajouter l'option à l'élément select
        });
    })
    .catch(error => console.error('Erreur lors du chargement des catégories :', error));

// Fonction pour ajouter un nouveau travail dans les galeries
function addWorkToGalleries(work) {
    // Ajout dans la Galerie Principale
    const mainGallery = document.querySelector(".figures-gallery");
    const newFigureMainGallery = document.createElement('figure');
    newFigureMainGallery.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
    `;
    mainGallery.appendChild(newFigureMainGallery);

    // Ajout dans la Galerie de la Modale
    const modalGallery = document.querySelector(".modale-gallery");
    const newFigureModalGallery = document.createElement('figure');
    newFigureModalGallery.innerHTML = `
        <div class="imgGallery"> 
            <div class="corbeille">
                <i class="fa-solid fa-trash-can" data-work-id="${work.id}"></i> 
            </div>
        </div>   
    `;
    modalGallery.appendChild(newFigureModalGallery);
}

//Récupérer les données de saisies sous forme formData
const fileInput = document.getElementById('fileInput');
const titleInput = document.getElementById('titre');
const categorySelect = document.getElementById('category-select');
const submitButton = document.getElementById('submitButton');

//Fonction pour changer la couleur du bouton valider lorsque le formulaire est rempli
function checkFormulaire() {
    // Vérifier si tous les champs sont remplis
    if (fileInput.files.length > 0 && titleInput.value !== '' && categorySelect.value !== '') {
        // Si tous les champs sont remplis, modifier le style du bouton
        submitButton.style.backgroundColor = '#1D6154';
        submitButton.removeAttribute('disabled');
    } else {
        // Sinon, réinitialiser le style du bouton
        submitButton.style.backgroundColor = 'grey';
        submitButton.setAttribute('disabled', '');
    }
}
// Ajouter un gestionnaire d'événements pour surveiller les changements dans les champs du formulaire
fileInput.addEventListener('change', checkFormulaire);
titleInput.addEventListener('input', checkFormulaire); // Utiliser 'input' pour surveiller les saisies en temps réel
categorySelect.addEventListener('change', checkFormulaire);

//Ajout de l'addEventListener au bouton d'envoi
submitButton.addEventListener('click', () => {
    const formData = new FormData();
    //Ajout des données de l'image
    const imageFile = fileInput.files[0];
    formData.append('image', imageFile);

    //Ajout du titre
    const title = titleInput.value;
    formData.append('title', title);

    //Ajout de la catégorie
    const category = categorySelect.value;
    formData.append('category', category);


    //Envoi des données récupérées à l'API via feth
    const token = localStorage.getItem('monToken');

    fetch('http://localhost:5678/api/works', {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: formData,
    })
        //Gestion de la réponse de l'API
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                switch (response.status) {
                    case 201:
                        break;
                    case 400:
                        break;
                    case 401:
                        break;
                    default:
                        alert("Erreur inconnue");
                }

            }
        })
        .then(data => {
            //Ajout des nouveaux travaux sans reload
            addWorkToGalleries(data);

            //Fermer la modale une fois l'ajout réussi
            const modale = document.querySelector(".modale");
            modale.style.display = "none";

            //Intervertir l'affichage des div dans la modale lorsque cette dernière se ferme
            document.querySelector('.ajout').style.display = 'none';
            document.querySelector('.modale-1').style.display = 'block';

            fileInput.value = null;

            //Afficher de nouveau l'icône, le bouton et le paragraphe
            let basicContent = document.querySelector(".basic-content");
            basicContent.style.display = 'flex';

            //Pour supprimer l'image ajoutée
            // Masquer l'image ajoutée
            const addedImage = document.querySelector('.ajout-button img');
            if (addedImage) {
                addedImage.remove();
            }
            // Réinitialiser le champ de l'image
            fileInput.value = null;
            titleInput.value = '';
            categorySelect.selectedIndex = 0;
        })
        .catch(error => {
            console.error("Erreur lors de l'ajout d'un nouveau travail : ", error);
        });
});


function suppression() {
    //Suppression des images de la galerie
    const trashIcons = document.querySelectorAll('.fa-trash-can');
    //Gestionnaire d'événement pour CHAQUE icône corbeille
    trashIcons.forEach(trashIcon => {
        trashIcon.addEventListener('click', function (event) {
            const workId = event.target.getAttribute('data-work-id');
            const token = localStorage.getItem('monToken');

            fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur lors de la suppression du travail');
                    }

                    trashIcon.closest("figure").remove();

                    document.getElementById(workId).remove();
                })

        })
    })
}





