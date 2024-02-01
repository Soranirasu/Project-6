//Mettre tout le code dans un EventListener pour qu'il se lance au click sur le bouton d'envoi et non au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('user-login-form').addEventListener('submit', function (event) {
        // Empêcher le comportement par défaut du formulaire (rechargement de la page)
        event.preventDefault();
        // Créer un objet à envoyer
        const dataToSend = {
            "email": document.querySelector('#email').value,
            "password": document.querySelector('#password').value
        };

        // Convertir l'objet en chaîne JSON
        const jsonData = JSON.stringify(dataToSend);

        // URL de l'endpoint de connexion
        const endpointUrl = 'http://localhost:5678/api/users/login';

        // Effectuer une requête POST avec l'API Fetch
        fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Indiquer qu'on envoie des données au format JSON
            },
            body: jsonData, // Ajouter les données JSON dans le corps de la requête
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('La requête a échoué avec le statut ' + response.status);
                }
                return response.json();
            })

            .then(data => {
                // Récupérer le token de la réponse
                const token = data.token;

                // Stocker le token dans le local storage
                localStorage.setItem('monToken', token);

                // Faire quelque chose avec le token si nécessaire
                console.log('Token récupéré :', token);
            })

            .catch(error => {
                // Gérer les erreurs
                console.error('Erreur lors de la requête :', error);
            });

    })
})