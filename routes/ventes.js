var express = require("express");
var router = express.Router();
var bodyparser = require("body-parser");
var db = require("../config/db.js");

router.use(bodyparser.json());

// Liste de toute la vente
router.get("/", function (req, res, next) {
    try {
        var sql = "SELECT * from listecommandeclient_vue";
        db.query(sql, (err, rows, fields) => {
            if (!err) {
                res.json(rows);
            } else {
                res.status(500).send({
                    error: err
                });
                console.log(err);
            }
        });
    } catch (error) {
        res.writeHead(400, {
            "Content-type": "aplication/json"
        });
        res.write(
            JSON.stringify({
                data: "Exception : " + error
            })
        );
        // next(createError(401));
    }
});

// Bilan des ventes
router.get("/Bilan", function (req, res, next) {
    try {
        var sql = "CALL usp_BilanVente()";

        db.query(sql, (err, rows, fields) => {
            if (!err) {
                res.json(rows);
            } else {
                res.status(500).send({
                    error: err
                });
                console.log(err);
            }
        });
    } catch (error) {
        res.writeHead(400, {
            "Content-type": "aplication/json"
        });
        res.write(
            JSON.stringify({
                data: "Exception usp_BilanVente : " + error
            })
        );
    }
});

module.exports = router;