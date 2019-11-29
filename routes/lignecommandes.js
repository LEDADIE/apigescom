var express = require('express');
var router = express.Router();
var bodyparser = require("body-parser");
var db = require('../config/db.js');
var util = require("util");
var generateentitycode = require('../config/generateentitycode');



router.use(bodyparser.json());

class LigneDeCommande {
    constructor(CodeLigneComd, codeCmd, codeProd, mtunitaire, quantite, tauxTva) {
        this.CodeLigneDeCommande = CodeLigneComd === 'New' ? generateentitycode.entityCode('lignecommande') : CodeLigneComd;
        this.codeCommande = codeCmd;
        this.codeProduit = codeProd;
        this.prixUnitaireProduit = mtunitaire;
        this.quantiteProduit = quantite;
        this.tauxTVA = tauxTva;
    }
};


//TODO         Liste de toutes les commandes
router.get('/', function (req, res, next) {


    try {
        var sql = "SELECT * from ligne_commande";
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
            data: 'Exception AllLignesDeCommandes : ' + error
        }));
    }

});


// Mise à jour de la ligne de commande
router.put('/UpdateLigneDeCommande', function (req, res, next) {

    try {
        let LigneDeCommandeData = new LigneDeCommande(req.body.CODELIGNECOMMANDE, req.body.CODECOMMANDE, req.body.CODEPRODUIT, req.body.PRIXUNITAIRE.toString(), req.body.QUANTITE.toString(), req.body.TAUXTVA.toString());

        if (LigneDeCommandeData) {

            var sql = "UPDATE ligne_commande SET ";

            var isDataProvided = false;


            if (LigneDeCommandeData.codeCommande) {
                sql += " CODECOMMANDE = '" + LigneDeCommandeData.codeCommande + "',";
                isDataProvided = true;
            }

            if (LigneDeCommandeData.codeProduit) {
                sql += " CODEPRODUIT = '" + LigneDeCommandeData.codeProduit + "',";
                isDataProvided = true;
            }


            if (LigneDeCommandeData.prixUnitaireProduit) {
                sql += " PRIXUNITAIRE = " + parseFloat(LigneDeCommandeData.prixUnitaireProduit) + ",";
                isDataProvided = true;
            }

            if (LigneDeCommandeData.quantiteProduit) {
                sql += " QUANTITE = " + parseInt(LigneDeCommandeData.quantiteProduit) + ",";
                isDataProvided = true;
            }

            if (LigneDeCommandeData.tauxTVA) {
                sql += " TAUXTVA = " + parseFloat(LigneDeCommandeData.tauxTVA) + ",";
                isDataProvided = true;
            }

            sql = sql.slice(0, -1); //Supprimer la derniere virgule

            sql += " WHERE CODELIGNECOMMANDE = '" + LigneDeCommandeData.CodeLigneDeCommande + "'";

            db.query(sql, (err, result) => {
                if (!err) {
                    res.json({
                        'status': 'success',
                        'resultat': result,
                        'data': LigneDeCommandeData
                    })
                } else {
                    res.status(500).send({
                        error: err
                    })
                    console.log(err);
                }
            });

        } else {
            res.json({
                'statut': 'aborted',
                'description': 'Veuillez saisir les informations de la ligne de commande'
            });
        }
    } catch (error) {
        res.writeHead(400, {
            "Content-type": "aplication/json"
        });
        res.write(JSON.stringify({
            data: 'Exception UpdateLigneDeCommande : ' + error
        }));
    }
});


router.delete('/DeleteLigneDeCommande/:id', function (req, res, next) {

    try {
        var sql = "DELETE FROM ligne_commande where CODELIGNECOMMANDE = ?";
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
            data: 'Exception DeleteLigneDeCommande : ' + error
        }));
    }


});

// Ajuter une commande
router.post('/AddLigneDeCommande', function (req, res, next) {

    try {

        let LigneDeCommandeData = new LigneDeCommande('New', req.body.CODECOMMANDE, req.body.CODEPRODUIT, req.body.PRIXUNITAIRE.toString(), req.body.QUANTITE.toString(), req.body.TAUXTVA.toString());

        if (LigneDeCommandeData) {

            var sql = "INSERT INTO ligne_commande (CODELIGNECOMMANDE, CODECOMMANDE, CODEPRODUIT, PRIXUNITAIRE, QUANTITE, TAUXTVA) VALUES ";
            sql += util.format("('%s', '%s', '%s', %d, %i, %d)", LigneDeCommandeData.CodeLigneDeCommande, LigneDeCommandeData.codeCommande, LigneDeCommandeData.codeProduit, parseFloat(LigneDeCommandeData.prixUnitaireProduit), parseInt(LigneDeCommandeData.quantiteProduit), parseFloat(LigneDeCommandeData.tauxTVA));

            db.query(sql, (err, result) => {
                if (!err) {
                    res.json({
                        'status': 'success',
                        'result': result,
                        'data': LigneDeCommandeData
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
                data: "Veuillez saisir le code du client et/ou de la ligne de commande"
            }));
        }

    } catch (error) {
        res.writeHead(400, {
            "Content-type": "aplication/json"
        });
        res.write(JSON.stringify({
            data: 'Exception AddLigneDeCommande : ' + error
        }));
    }

});

module.exports = router;