const express = require('express');
const firebaseAdmin = require('firebase-admin');
const path = require('path');

const app = express();
const port = 3000;

// Initialise Firebase Admin SDK
const serviceAccount = require('../../serviceA.json'); // Si tu as un niveau de plus

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://ton-projet.firebaseio.com" // Remplace par ton URL Firebase
});

// Exemple d'authentification utilisateur (vérifier le token)
app.post('/verifyToken', (req, res) => {
    const idToken = req.body.token; // Assure-toi que le token est envoyé dans le body

    firebaseAdmin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            const uid = decodedToken.uid;
            res.json({ message: "Utilisateur vérifié", uid });
        })
        .catch(error => {
            res.status(401).json({ error: "Token invalide" });
        });
});

// Serve les fichiers statiques depuis le dossier 'front' à la racine
app.use(express.static(path.join(__dirname, '../../front')));  // Chemin vers 'front'

// Route pour servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../front', 'index.html')); // Serve 'index.html' depuis 'front'
});

// Démarre le serveur sur le port 3000
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
