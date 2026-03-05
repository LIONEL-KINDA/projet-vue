// serveur.js
import express from 'express';
import mysql from 'mysql2';  
//import cors
import cors from 'cors';
const app = express();
const port = 3002;

// Config BD
const optionsbd = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud',
  port: 3306
};

// Connexion BD
const connection = mysql.createConnection(optionsbd);

connection.connect((err) => {
  if (err) {
    console.log('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connexion à la base de données réussie');
});

// Middleware 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// insert data in db
app.post('/submit', (req, res) => {
  const { nom, prenom, age, classe } = req.body;

  const sql = 'INSERT INTO donnee (nom, prenom, age, classe) VALUES (?,?,?,?)';

  connection.query(sql, [nom, prenom, age, classe], (err, result) => {
    if (err) {
      console.log('Erreur lors de l\'insertion des données :', err);
      res.status(500).send('Erreur lors de l\'insertion des données');
      return;
    }
    console.log('Données insérées avec succès');
  });
});
//get data from db
app.get('/data', (req, res) => {
  const sql = 'SELECT id, nom, prenom, age, classe FROM donnee';
    connection.query(sql, (err, results) => {
    if (err) {
      console.log('Erreur lors de la récupération des données :', err);
      res.status(500).send('Erreur lors de la récupération des données');
      return;
    }
    res.json(results);
  });
});
//edit data in db
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { nom, prenom, age, classe } = req.body;
    const sql = 'UPDATE donnee SET nom=?, prenom=?, age=?, classe=? WHERE id=?';
    connection.query(sql, [nom, prenom, age, classe, id], (err, result) => {
      if (err) {
        console.log('Erreur lors de la mise à jour des données :', err);
        res.status(500).send('Erreur lors de la mise à jour des données');
        return;
      }
      res.json({ message: 'Données mises à jour avec succès' });
    });
  });
  //delete data from db
  app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
     const sql= 'DELETE FROM donnee WHERE id=?';
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.log('Erreur lors de la suppression des données :', err);
        res.status(500).send('Erreur lors de la suppression des données');
        return;
      }
      res.json(result);
    });
  });
// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
