var express = require('express');
var router = express.Router();
var bodyparser = require("body-parser");
var db = require('../config/db.js');
var util = require("util");
var generateentitycode = require('../config/generateentitycode');


router.use(bodyparser.json());


class Commande {
    constructor(codeCmd, codeCli, LibCmd, mtHTCmd, mtTVACmd, mtTTCCmd, lieuLivrCmd) {
        this.codeCommande = codeCmd === 'New' ? generateentitycode.entityCode('commande') : codeCmd;
        this.Codeclient = codeCli;
        this.LibelleCommande = LibCmd;
        this.MontantHTCommande = mtHTCmd;
        this.MontantTVAcommande = mtTVACmd;
        this.MontantTTCcommande = mtTTCCmd;
        this.LieuLivraison = lieuLivrCmd;
    }
};

//Liste de toutes les commandes
router.get('/', function (req, res, next) {


    try {
        var sql = "SELECT DISTINCT * from commande cd inner join client cl on cl.CODECLIENT = cd.CODECLIENT";
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
            data: 'Exception AllCommandes : ' + error
        }));
    }

});


//Détail de la commande par son code
router.get('/CommandeById/:id', function (req, res, next) {

    try {
        var sql = "SELECT * from commande where CODECOMMANDE = ?";
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
            data: 'Exception CommandeById : ' + error
        }));
    }

});


router.get('/CommandeDetailsById/:id', function (req, res, next) {

    try {
        var sql = "SET @paramCodeCommande = ?; CALL usp_GetDetailCommande(@paramCodeCommande)";
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
            data: 'Exception CommandeDetailsById : ' + error
        }));
    }
});


// Mise à jour de la commande
router.put('/UpdateCommande', function (req, res, next) {

    try {
        let CommandeData = new Commande(req.body.CODECOMMANDE, req.body.CODECLIENT, req.body.LIBELLECOMMANDE, req.body.MONTANTHT.toString(), req.body.MONTANTTVA.toString(), req.body.MONTANTTTC.toString(), req.body.LIEULIVRAISON);

        if (CommandeData) {

            var sql = "UPDATE commande SET ";

            var isDataProvided = false;
            /*
                        if (!CommandeData.codeCommande) {
                            res.writeHead(200, {
                                "Content-type": "aplication/json"
                            });
                            res.write(JSON.stringify({
                                data: "Le nom du client n'est pas fourni"
                            }));
                        }
            */

            if (CommandeData.LibelleCommande) {
                sql += " LIBELLECOMMANDE = '" + CommandeData.LibelleCommande + "',";
                isDataProvided = true;
            }

            if (CommandeData.MontantHTCommande) {
                sql += " MONTANTHT = " + parseFloat(CommandeData.MontantHTCommande) + ",";
                isDataProvided = true;
            }


            if (CommandeData.MontantTVAcommande) {
                sql += " MONTANTTVA = " + parseFloat(CommandeData.MontantTVAcommande) + ",";
                isDataProvided = true;
            }

            if (CommandeData.MontantTTCcommande) {
                sql += " MONTANTTTC = " + parseFloat(CommandeData.MontantTTCcommande) + ",";
                isDataProvided = true;
            }
            /*
                    if (req.body.DATECOMMANDE) {
                        sql += " DATECOMMANDE = '" + req.body.DATECOMMANDE + "',";
                        isDataProvided = true;
                    }
                    */

            if (CommandeData.LieuLivraison) {
                sql += " LIEULIVRAISON = '" + CommandeData.LieuLivraison + "',";
                isDataProvided = true;
            }

            sql = sql.slice(0, -1); //Supprimer la derniere virgule

            sql += " WHERE CODECOMMANDE = '" + CommandeData.codeCommande + "'";

            db.query(sql, (err, result) => {
                if (!err) {
                    res.json({
                        'status': 'success',
                        'resultat': result,
                        'data': CommandeData
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
                'description': 'Veuillez saisir les informations de la commande'
            });
        }
    } catch (error) {
        res.writeHead(400, {
            "Content-type": "aplication/json"
        });
        res.write(JSON.stringify({
            data: 'Exception UpdateCommande : ' + error
        }));
    }
});


// Attribuer la commandeà un autre client
router.put('/ForwardCommande', function (req, res, next) {

    try {
        let CommandeData = new Commande(req.body.CODECOMMANDE, req.body.CODECLIENT, req.body.LIBELLECOMMANDE, req.body.MONTANTHT, req.body.MONTANTTVA, req.body.MONTANTTTC, req.body.LIBELLECOMMANDE);

        if (CommandeData) {

            var sql = "UPDATE commande SET ";

            var isDataProvided = false;
            /*
                        if (!CommandeData.codeCommande) {
                            res.writeHead(200, {
                                "Content-type": "aplication/json"
                            });
                            res.write(JSON.stringify({
                                data: "Le code de la commande n'est pas fourni"
                            }));
                        }

                        if (!CommandeData.Codeclient) {
                            res.writeHead(200, {
                                "Content-type": "aplication/json"
                            });
                            res.write(JSON.stringify({
                                data: "Le code du client n'est pas fourni"
                            }));
                        } else {
                            sql += " CODECLIENT = '" + CommandeData.Codeclient + "',";
                            isDataProvided = true;
                        }
            */

            sql += " CODECLIENT = '" + CommandeData.Codeclient + "',";
            isDataProvided = true;

            sql = sql.slice(0, -1); //Supprimer la derniere virgule

            sql += " WHERE CODECOMMANDE = '" + CommandeData.codeCommande + "'";

            db.query(sql, (err, result) => {
                if (!err) {
                    res.json({
                        'status': 'success',
                        'data': CommandeData,
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
                data: "Veuillez preciser la commande à reaffecter, et le client concerné"
            }));
        }

    } catch (error) {
        res.writeHead(400, {
            "Content-type": "aplication/json"
        });
        res.write(JSON.stringify({
            data: 'Exception ForwardCommande : ' + error
        }));
    }
});

router.delete('/DeleteCommande/:id', function (req, res, next) {

    try {
        var sql = "DELETE FROM commande where CODECOMMANDE = ?";
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
            data: 'Exception DeleteCommande : ' + error
        }));
    }


});


// Ajuter une commande
router.post('/AddCommande', function (req, res, next) {

    try {

        let CommandeData = new Commande('New', req.body.CODECLIENT, req.body.LIBELLECOMMANDE, req.body.MONTANTHT.toString(), req.body.MONTANTTVA.toString(), req.body.MONTANTTTC.toString(), req.body.LIEULIVRAISON);


        if (CommandeData) {

            var sql = "INSERT INTO commande (CODECOMMANDE, CODECLIENT, LIBELLECOMMANDE, MONTANTHT, MONTANTTVA, MONTANTTTC, LIEULIVRAISON) VALUES ";
            sql += util.format("('%s', '%s', '%s', %d, %d, %d, '%s')", CommandeData.codeCommande, CommandeData.Codeclient, CommandeData.LibelleCommande, parseFloat(CommandeData.MontantHTCommande), parseFloat(CommandeData.MontantTVAcommande), parseFloat(CommandeData.MontantTTCcommande), CommandeData.LieuLivraison);

            db.query(sql, (err, result) => {
                if (!err) {
                    res.json({
                        'status': 'success',
                        'result': result,
                        'data': CommandeData
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
                data: "Veuillez saisir le code du client et/ou de la commande"
            }));
        }

    } catch (error) {
        res.writeHead(400, {
            "Content-type": "aplication/json"
        });
        res.write(JSON.stringify({
            data: 'Exception AddCommande : ' + error
        }));
    }

});


module.exports = router;