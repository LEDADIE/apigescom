var express = require('express');
var router = express.Router();
var bodyparser = require("body-parser");
var db = require('../config/db.js');
var util = require("util");
var generateentitycode = require('../config/generateentitycode');


router.use(bodyparser.json());



class Client {
  constructor(codeCli, nonCli, PrenCli, ContCli, EmailCli, AdrCli, VilleCli) {

    this.CodeClient = codeCli === 'New' ? generateentitycode.entityCode('client') : codeCli;
    this.NomClient = nonCli;
    this.PrenomsClient = PrenCli;
    this.ContactClient = ContCli;
    this.EmailClient = EmailCli;
    this.AdresseClient = AdrCli;
    this.VilleClient = VilleCli;
  }
};

/*
router.use(bodyparser.urlencoded({
  extended: true
}));
*/
//Liste de tous les clients du système
router.get('/', function (req, res, next) {

  try {
    var sql = "SELECT * from client";

    db.query(sql, (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        res.status(500).send({
          error: err
        })
        console.log(err);
      }
    });

  } catch (error) {
    res.writeHead(400, {
      "Content-type": "aplication/json"
    });
    res.write(JSON.stringify({
      data: 'Exception AllClients : ' + error
    }));
  }



});


//Obtenir les données uniques du client
router.get('/ClientById/:id', function (req, res, next) {


  try {
    var sql = "SELECT * from client where CODECLIENT = ?";

    db.query(sql, [req.params.id], (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        res.status(500).send({
          error: err
        })
        console.log(err);
      }
    });

  } catch (error) {
    res.writeHead(400, {
      "Content-type": "aplication/json"
    });
    res.write(JSON.stringify({
      data: 'Exception ClientById : ' + error
    }));
  }

});

//obtenier les commandes du client
router.get('/CommandesByClientId/:id', function (req, res, next) {


  try {
    var sql = "SET @paramCodeClient = ?; CALL usp_GetDetailClient(@paramCodeClient)";

    db.query(sql, [req.params.id], (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        res.status(500).send({
          error: err
        })
        console.log(err);
      }
    });
  } catch (error) {
    res.writeHead(400, {
      "Content-type": "aplication/json"
    });
    res.write(JSON.stringify({
      data: 'Exception CommandesByClientId : ' + error
    }));
  }

});


//Ajouter un client
router.post('/AddClient', function (req, res, next) {

  try {
    let ClientData = new Client('New', req.body.NOM, req.body.PRENOM, req.body.CONTACT, req.body.EMAIL, req.body.ADRESSE, req.body.VILLE);

    if (ClientData.CodeClient && ClientData.NomClient) {
      //var EntityId = generateEntityId.EntityId(client)

      var sql = "INSERT INTO client (CODECLIENT, NOM, PRENOM, CONTACT, EMAIL, ADRESSE, VILLE) VALUES ";
      sql += util.format("('%s', '%s', '%s', '%s', '%s', '%s', '%s')", ClientData.CodeClient, ClientData.NomClient, ClientData.PrenomsClient, ClientData.ContactClient, ClientData.EmailClient, ClientData.AdresseClient, ClientData.VilleClient);

      db.query(sql, (err, result) => {
        if (!err) {
          res.json({
            'status': 'success',
            'data': ClientData,
            'result': result
          })
        } else {
          res.status(500).send({
            error: err
          })
          console.log(err);
        }
      });
    } else {
      res.writeHead(200, {
        "Content-type": "aplication/json"
      });
      res.write(JSON.stringify({
        data: "Veuillez saisir les informations obligatoires du client : Nom du client"
      }));
    }

  } catch (error) {
    res.writeHead(400, {
      "Content-type": "aplication/json"
    });
    res.write(JSON.stringify({
      data: 'Exception AddClient : ' + error
    }));
  }


});

//Mise a jour du client
router.put('/UpdateClient', function (req, res, next) {

  try {

    let ClientData = new Client(req.body.CODECLIENT, req.body.NOM, req.body.PRENOM, req.body.CONTACT, req.body.EMAIL, req.body.ADRESSE, req.body.VILLE);

    if (ClientData) {

      var sql = "UPDATE client SET ";

      var isDataProvided = false;

      /*
      if (ClientData.NomClient) {
        sql += " NOM = '" + ClientData.NomClient + "',";
        isDataProvided = true;
      } else {
        res.writeHead(200, {
          "Content-type": "aplication/json"
        });
        res.write(JSON.stringify({
          data: "Le nom du client n'est pas fourni"
        }));
      }
      */

      if (ClientData.PrenomsClient) {
        sql += " PRENOM = '" + ClientData.PrenomsClient + "',";
        isDataProvided = true;
      }


      if (ClientData.ContactClient) {
        sql += " CONTACT = '" + ClientData.ContactClient + "',";
        isDataProvided = true;
      }

      if (ClientData.EmailClient) {
        sql += " EMAIL = '" + ClientData.EmailClient + "',";
        isDataProvided = true;
      }

      if (ClientData.AdresseClient) {
        sql += " ADRESSE = '" + ClientData.AdresseClient + "',";
        isDataProvided = true;
      }

      if (ClientData.VilleClient) {
        sql += " VILLE = '" + ClientData.VilleClient + "',";
        isDataProvided = true;
      }

      sql = sql.slice(0, -1); //Supprimer la derniere virgule

      sql += " WHERE CODECLIENT = '" + ClientData.CodeClient + "'";

      db.query(sql, (err, result) => {
        if (!err) {
          res.json({
            'status': 'success',
            'data': ClientData,
            'result': result
          })
        } else {
          res.status(500).send({
            error: err
          })
          console.log(err);
        }
      });

    } else {
      res.writeHead(200, {
        "Content-type": "aplication/json"
      });
      res.write(JSON.stringify({
        data: "Veuillez saisir les informations obligatoires du client : Nom client, Code du client"
      }));
    }

  } catch (error) {
    res.writeHead(400, {
      "Content-type": "aplication/json"
    });
    res.write(JSON.stringify({
      data: 'Exception UpdateClient : ' + error
    }));
  }

});

//Supprimer le client
router.delete('/DeleteClient/:id', function (req, res, next) {

  try {
    var sql = "DELETE FROM client where CODECLIENT = ?";
    db.query(sql, [req.params.id], (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        res.status(500).send({
          error: err
        })
        console.log(err);
      }
    });

  } catch (error) {
    res.writeHead(400, {
      "Content-type": "aplication/json"
    });
    res.write(JSON.stringify({
      data: 'Exception DeleteClient : ' + error
    }));
  }

});

module.exports = router;