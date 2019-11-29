const mysql = require("mysql");


var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "vente",
    multipleStatements: true
});

mysqlConnection.connect(err => {
    if (!err) console.log("Connection à la base de données succès");
    else console.log("Erreur de connection de la base de données ! : " + err);
});

module.exports = mysqlConnection;