var express = require('express');
var router = express.Router();
var bodyparser = require("body-parser");
var db = require('../config/db.js');
var util = require("util");
var generateentitycode = require('../config/generateentitycode');



router.use(bodyparser.json());

class Categorie {
    constructor(codeCat, commentaire) {
        this.codeCategorie = codeCat === 'New' ? generateentitycode.entityCode('categorie') : codeCat;
        this.Commentaire = commentaire;
    }
};

//Liste de toutes les categories
router.get('/', function (req, res, next) {


    try {
        var sql = "SELECT * from categorie";
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
            data: 'Exception AllCategories : ' + error
        }));
    }

});


//Détail de la categorie par son code
router.get('/CategorieById/:id', function (req, res, next) {

    try {
        var sql = "SELECT * from categorie where CODECATEGORIE = ?";
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
            data: 'Exception CategorieById : ' + error
        }));
    }

});


router.get('/CategorieDetailsById/:id', function (req, res, next) {

    try {
        var sql = "SET @paramCodecategorie = ?; CALL usp_GetDetailCategorie(@paramCodecategorie)";
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
            data: 'Exception CategorieDetailsById : ' + error
        }));
    }
});


// Mise à jour de la categorie
router.put('/UpdateCategorie', function (req, res, next) {

    try {
        let CategorieData = new Categorie(req.body.CODECATEGORIE, req.body.COMMENTAIRE);

        var sql = "";

        if (CategorieData) {

            var isDataProvided = false;

            if (CategorieData.Commentaire) {

                sql += "UPDATE categorie SET ";

                sql += " COMMENTAIRE = '" + CategorieData.Commentaire + "',";
                isDataProvided = true;

                sql = sql.slice(0, -1); //Supprimer la derniere virgule

                sql += " WHERE CODECATEGORIE = '" + CategorieData.codeCategorie + "'";
            }



            db.query(sql, (err, result) => {
                if (!err) {
                    res.json({
                        'status': 'success',
                        'resultat': result,
                        'data': CategorieData
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
                'description': 'Veuillez saisir les informations de la categorie'
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


// Supprimer la catégorie
router.delete('/DeleteCategorie/:id', function (req, res, next) {

    try {
        var sql = "DELETE FROM categorie where CODECATEGORIE = ?";
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
            data: 'Exception DeleteCategorie : ' + error
        }));
    }


});


// Ajuter une categorie
router.post('/AddCategorie', function (req, res, next) {

    try {

        let CategorieData = new Categorie('New', req.body.COMMENTAIRE);


        if (CategorieData) {

            var sql = "INSERT INTO categorie (CODECATEGORIE, COMMENTAIRE) VALUES ";
            sql += util.format("('%s', '%s')", CategorieData.codeCategorie, CategorieData.Commentaire);

            db.query(sql, (err, result) => {
                if (!err) {
                    res.json({
                        'status': 'success',
                        'result': result,
                        'data': CategorieData
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
                data: "Veuillez saisir le descriptif de la categorie"
            }));
        }

    } catch (error) {
        res.writeHead(400, {
            "Content-type": "aplication/json"
        });
        res.write(JSON.stringify({
            data: 'Exception AddCategorie : ' + error
        }));
    }

});

module.exports = router;