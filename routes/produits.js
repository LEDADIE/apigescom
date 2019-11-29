var express = require('express');
var router = express.Router();
var bodyparser = require("body-parser");
var db = require('../config/db.js');
var util = require("util");
var generateentitycode = require('../config/generateentitycode');


router.use(bodyparser.json());


class Produit {
    constructor(CodeProd, CodeCat, LibProd, PrixProd) {
        this.codeProduit = CodeProd === 'New' ? generateentitycode.entityCode('produit') : CodeProd;
        this.codeCategorie = CodeCat;
        this.libelleProduit = LibProd;
        this.PrixProduit = PrixProd;
    }
};


/* GET users listing. */
router.get('/', function (req, res, next) {

    try {
        var sql = "CALL usp_GetAllProduct()";

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
            data: 'Exception AllProduits : ' + error
        }));
    }

});


//Détail de la commande par son code
router.get('/ProduitById/:id', function (req, res, next) {

    try {
        var sql = "SET @paramCodeProduit = ?; CALL usp_GetDetailProduct(@paramCodeProduit)";
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
            data: 'Exception ProduitById : ' + error
        }));
    }

});



// Mise à jour de la categorie
router.put('/UpdateProduit', function (req, res, next) {

    try {
        let ProduitData = new Produit(req.body.CODEPRODUIT, req.body.CODECATEGORIE, req.body.LIBELLE, req.body.PRIX.toString());

        var sql = "UPDATE produit SET ";

        isDataProvided = true;

        if (ProduitData) {

            var isDataProvided = false;

            if (ProduitData.libelleProduit) {
                sql += " LIBELLE = '" + ProduitData.libelleProduit + "',";
                isDataProvided = true;
            }

            if (ProduitData.PrixProduit) {
                sql += " PRIX = " + parseFloat(ProduitData.PrixProduit) + ",";
                isDataProvided = true;
            }

            sql = sql.slice(0, -1); //Supprimer la derniere virgule

            sql += " WHERE CODEPRODUIT = '" + ProduitData.codeProduit + "'";

            db.query(sql, (err, result) => {
                if (!err) {
                    res.json({
                        'status': 'success',
                        'resultat': result,
                        'data': ProduitData
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
                'description': 'Veuillez saisir les informations du produit'
            });
        }
    } catch (error) {
        res.writeHead(400, {
            "Content-type": "aplication/json"
        });
        res.write(JSON.stringify({
            data: 'Exception UpdateCategorie : ' + error
        }));
    }
});

// Changer la catégorie du produit
router.put('/ForwardProduit', function (req, res, next) {

    try {

        let ProduitData = new Produit(req.body.CODEPRODUIT, req.body.CODECATEGORIE, req.body.LIBELLE, req.body.PRIX.toString());

        if (ProduitData) {

            var sql = "UPDATE produit SET ";

            var isDataProvided = false;


            sql += " CODECATEGORIE = '" + ProduitData.codeCategorie + "',";
            isDataProvided = true;

            sql = sql.slice(0, -1); //Supprimer la derniere virgule

            sql += " WHERE CODEPRODUIT = '" + ProduitData.codeProduit + "'";

            db.query(sql, (err, result) => {
                if (!err) {
                    res.json({
                        'status': 'success',
                        'data': ProduitData,
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
                data: "Veuillez preciser le produit à reaffecter, et la catégorie concernée"
            }));
        }

    } catch (error) {
        res.writeHead(400, {
            "Content-type": "aplication/json"
        });
        res.write(JSON.stringify({
            data: 'Exception ForwardProduit : ' + error
        }));
    }
});


// Supprimer la catégorie
router.delete('/DeleteProduit/:id', function (req, res, next) {

    try {
        var sql = "DELETE FROM produit where CODEPRODUIT = ?";
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
            data: 'Exception DeleteProduit : ' + error
        }));
    }


});


// Ajuter une categorie
router.post('/AddProduit', function (req, res, next) {

    try {

        let ProduitData = new Produit('New', req.body.CODECATEGORIE, req.body.LIBELLE, req.body.PRIX.toString());

        if (ProduitData) {

            var sql = "INSERT INTO produit (CODEPRODUIT, CODECATEGORIE,LIBELLE,PRIX) VALUES ";
            sql += util.format("('%s', '%s', '%s', %d)", ProduitData.codeProduit, ProduitData.codeCategorie, ProduitData.libelleProduit, parseFloat(ProduitData.PrixProduit));

            db.query(sql, (err, result) => {
                if (!err) {
                    res.json({
                        'status': 'success',
                        'result': result,
                        'data': ProduitData
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
                data: "Veuillez saisir les informations du produit"
            }));
        }

    } catch (error) {
        res.writeHead(400, {
            "Content-type": "aplication/json"
        });
        res.write(JSON.stringify({
            data: 'Exception AddProduit : ' + error
        }));
    }

});

module.exports = router;