Date.prototype.ddmmyyyy = function () {
    var jour = new Date().getDate();
    var mois = new Date().getMonth() + 1;
    var annee = new Date().getFullYear();

    return [
        (jour > 9 ? '' : '0') + jour,
        (mois > 9 ? '' : '0') + mois,
        annee
    ].join('');
};


function nombre_aleatoire(nbrecar) {
    var alea = Math.floor((Math.pow(10, nbrecar) - 1) * Math.random());
    alea = alea.toString().padStart(nbrecar, '0');
    return alea;
}

module.exports = {
    entityCode: function (entite) {
        var codeEntite = "";
        var initialEntity = null;
        var finEntity = null;

        switch (entite) {


            case "commande":
                this.initialEntity = "CMD-";
                this.finEntity = "001";
                break;

            case "client":
                this.initialEntity = "CLS-";
                this.finEntity = "002";
                break;

            case "lignecommande":
                this.initialEntity = "LCD-";
                this.finEntity = "003";
                break;

            case "produit":
                this.initialEntity = "PRD-";
                this.finEntity = "004";
                break;

            case "categorie":
                this.initialEntity = "CAT-";
                this.finEntity = "005";
                break;

            default:
                this.initialEntity = "ENT-";
                this.finEntity = "999";
                break;
        }

        var datedujour = new Date();
        var delday = datedujour.ddmmyyyy();

        var nomre_alea = nombre_aleatoire(6);
        var nomre_aleasec = nombre_aleatoire(4);

        codeEntite = this.initialEntity + delday + '-' + nomre_alea + '-' + nomre_aleasec + '-' + this.finEntity;

        return codeEntite;
    }

};