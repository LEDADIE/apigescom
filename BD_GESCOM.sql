-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  sam. 05 oct. 2019 à 07:17
-- Version du serveur :  5.7.26
-- Version de PHP :  7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `vente`
--
DROP DATABASE IF EXISTS `vente`;
CREATE DATABASE IF NOT EXISTS `vente` DEFAULT CHARACTER SET latin1 COLLATE latin1_general_ci;
USE `vente`;

DELIMITER $$
--
-- Procédures
--
DROP PROCEDURE IF EXISTS `usp_GetAllProduct`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_GetAllProduct` ()  NO SQL
SELECT DISTINCT
ct.CODECATEGORIE
,ct.COMMENTAIRE
,pd.CODEPRODUIT
,pd.LIBELLE
,pd.PRIX
,pd.DATE
FROM produit pd
INNER JOIN categorie ct on ct.CODECATEGORIE = pd.CODECATEGORIE$$

DROP PROCEDURE IF EXISTS `usp_GetDetailCategorie`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_GetDetailCategorie` (IN `paramCodecategorie` TEXT)  NO SQL
SELECT DISTINCT
ct.CODECATEGORIE
,ct.COMMENTAIRE
,pd.CODEPRODUIT
,pd.LIBELLE
,pd.PRIX
,pd.DATE
FROM categorie ct
LEFT JOIN produit pd on pd.CODECATEGORIE = ct.CODECATEGORIE
where ct.CODECATEGORIE = paramCodecategorie$$

DROP PROCEDURE IF EXISTS `usp_GetDetailClient`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_GetDetailClient` (IN `paramCodeClient` TEXT)  NO SQL
SELECT DISTINCT
cl.CODECLIENT
,cl.NOM
,cl.PRENOM
,cl.CONTACT
,cl.EMAIL
,cl.ADRESSE
,cl.VILLE
,ct.CODECATEGORIE
,pd.CODEPRODUIT
,pd.LIBELLE
,cd.CODECOMMANDE
,cd.LIBELLECOMMANDE
,cd.MONTANTHT
,cd.MONTANTTVA
,cd.MONTANTTTC
,cd.DATECOMMANDE
,cd.LIEULIVRAISON
,lc.PRIXUNITAIRE
,lc.QUANTITE
,lc.TAUXTVA
from client cl
LEFT join commande cd on cd.CODECLIENT = cl.CODECLIENT
LEFT join ligne_commande lc on lc.CODECOMMANDE = cd.CODECOMMANDE
LEFT join produit pd on pd.CODEPRODUIT = lc.CODEPRODUIT
LEFT join categorie ct on ct.CODECATEGORIE = pd.CODECATEGORIE
where cl.CODECLIENT = paramCodeClient
ORDER by pd.CODEPRODUIT$$

DROP PROCEDURE IF EXISTS `usp_GetDetailCommande`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_GetDetailCommande` (IN `paramCodeCommande` VARCHAR(50))  SELECT DISTINCT
cl.CODECLIENT
,cl.NOM
,cl.PRENOM
,cl.CONTACT
,cl.EMAIL
,cl.ADRESSE
,cl.VILLE
,cat.CODECATEGORIE
,pd.CODEPRODUIT
,pd.LIBELLE
,cd.CODECOMMANDE
,cd.LIBELLECOMMANDE
,cd.MONTANTHT
,cd.MONTANTTVA
,cd.MONTANTTTC
,cd.DATECOMMANDE
,cd.LIEULIVRAISON
,lc.PRIXUNITAIRE
,lc.QUANTITE
,lc.TAUXTVA
from ligne_commande lc
inner join produit pd on pd.CODEPRODUIT = lc.CODEPRODUIT
inner join categorie cat on cat.CODECATEGORIE = pd.CODECATEGORIE
inner join commande cd on cd.CODECOMMANDE = lc.CODECOMMANDE
inner join client cl on cl.CODECLIENT = cd.CODECLIENT
WHERE cd.CODECOMMANDE = paramCodeCommande
ORDER by pd.CODEPRODUIT$$

DROP PROCEDURE IF EXISTS `usp_GetDetailProduct`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_GetDetailProduct` (IN `paramCodeClient` TEXT)  NO SQL
SELECT DISTINCT
ct.CODECATEGORIE
,ct.COMMENTAIRE
,pd.CODEPRODUIT
,pd.LIBELLE
,pd.PRIX
,pd.DATE
FROM produit pd
LEFT JOIN categorie ct on ct.CODECATEGORIE = pd.CODECATEGORIE
WHERE pd.CODEPRODUIT = paramCodeClient$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

DROP TABLE IF EXISTS `categorie`;
CREATE TABLE `categorie` (
  `CODECATEGORIE` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `COMMENTAIRE` varchar(50) COLLATE latin1_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci COMMENT='Categorie Produit';

--
-- Déchargement des données de la table `categorie`
--
-- --------------------------------------------------------

--
-- Structure de la table `client`
--

DROP TABLE IF EXISTS `client`;
CREATE TABLE `client` (
  `CODECLIENT` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `NOM` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `PRENOM` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `CONTACT` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `EMAIL` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `ADRESSE` varchar(500) COLLATE latin1_general_ci DEFAULT NULL,
  `VILLE` varchar(50) COLLATE latin1_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Déchargement des données de la table `client`
--


-- Structure de la table `commande`
--

DROP TABLE IF EXISTS `commande`;
CREATE TABLE `commande` (
  `CODECOMMANDE` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `CODECLIENT` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `LIBELLECOMMANDE` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
  `MONTANTHT` float(10,2) DEFAULT '0.00',
  `MONTANTTVA` float(10,2) DEFAULT '0.00',
  `MONTANTTTC` float(10,2) DEFAULT '0.00',
  `DATECOMMANDE` datetime DEFAULT CURRENT_TIMESTAMP,  
  `DATEMODIFICATION` datetime DEFAULT CURRENT_TIMESTAMP,
  `LIEULIVRAISON` varchar(100) COLLATE latin1_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Déchargement des données de la table `commande`
--

-- Doublure de structure pour la vue `detailcommandeclient_vue`
-- (Voir ci-dessous la vue réelle)
--
DROP VIEW IF EXISTS `detailcommandeclient_vue`;
CREATE TABLE `detailcommandeclient_vue` (
`Codeclient` varchar(50)
,`NomComplet` varchar(102)
,`Telephone` varchar(50)
,`Email` varchar(50)
,`Ville` varchar(50)
,`Adresse` varchar(500)
,`Categorieproduit` varchar(50)
,`codeproduit` varchar(50)
,`Libelleproduit` varchar(500)
,`Prixunitaireproduit` float(10,2)
,`Quantiteproduit` int(11)
,`TauxTVAapplique` float
,`Codecommande` varchar(50)
,`Libellecommande` varchar(50)
,`MontantHT` float(10,2)
,`MontantTVA` float(10,2)
,`MontantTTC` float(10,2)
,`Datecommande` datetime
,`Lieulivraison` varchar(100)
);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `lignecommande_vue`
-- (Voir ci-dessous la vue réelle)
--
DROP VIEW IF EXISTS `lignecommande_vue`;
CREATE TABLE `lignecommande_vue` (
`Codeclient` varchar(50)
,`NomComplet` varchar(102)
,`Teléphone` varchar(50)
,`Email` varchar(50)
,`Ville` varchar(50)
,`Adresse` varchar(500)
,`Categorieproduit` varchar(50)
,`codeproduit` varchar(50)
,`Libelleproduit` varchar(500)
,`Prixunitaireproduit` float(10,2)
,`Quantitepproduit` int(11)
,`TauxTVAapplique` float
,`Codecommande` varchar(50)
,`Libellecommande` varchar(50)
,`MontantHT` float(10,2)
,`MontantTVA` float(10,2)
,`MontantTTC` float(10,2)
,`Datecommande` datetime
,`Lieulivraison` varchar(100)
);

-- --------------------------------------------------------

--
-- Structure de la table `ligne_commande`
--

DROP TABLE IF EXISTS `ligne_commande`;
CREATE TABLE `ligne_commande` (
  `CODECOMMANDE` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `CODEPRODUIT` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `PRIXUNITAIRE` float(8,2) DEFAULT NULL,
  `QUANTITE` int(11) DEFAULT NULL,
  `TAUXTVA` float DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Déchargement des données de la table `ligne_commande`

-- Structure de la table `produit`
--

DROP TABLE IF EXISTS `produit`;
CREATE TABLE `produit` (
  `CODEPRODUIT` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `CODECATEGORIE` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `LIBELLE` varchar(500) COLLATE latin1_general_ci DEFAULT NULL,
  `PRIX` float(10,2) DEFAULT '0.00',
  `DATE` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Déchargement des données de la table `produit`
--

-- Structure de la vue `detailcommandeclient_vue` exportée comme une table
--
DROP TABLE IF EXISTS `detailcommandeclient_vue`;
CREATE TABLE`detailcommandeclient_vue`(
    `Codeclient` varchar(50) COLLATE latin1_general_ci NULL,
    `NomComplet` varchar(102) COLLATE latin1_general_ci DEFAULT NULL,
    `Telephone` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
    `Email` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
    `Ville` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
    `Adresse` varchar(500) COLLATE latin1_general_ci DEFAULT NULL,
    `Categorieproduit` varchar(50) COLLATE latin1_general_ci NOT NULL,
    `codeproduit` varchar(50) COLLATE latin1_general_ci NOT NULL,
    `Libelleproduit` varchar(500) COLLATE latin1_general_ci DEFAULT NULL,
    `Prixunitaireproduit` float(10,2) DEFAULT '0.00',
    `Quantiteproduit` int(11) DEFAULT '0',
    `TauxTVAapplique` float(10,2) DEFAULT '0.00',
    `Code commande` varchar(50) COLLATE latin1_general_ci NOT NULL,
    `Libellecommande` varchar(50) COLLATE latin1_general_ci DEFAULT NULL,
    `MontantHT` float(10,2) DEFAULT '0.00',
    `MontantTVA` float(10,2) DEFAULT '0.00',
    `MontantTTC` float(10,2) DEFAULT '0.00',
    `Datecommande` datetime DEFAULT NULL,
    `Lieulivraison` varchar(100) COLLATE latin1_general_ci DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Structure de la vue `lignecommande_vue` exportée comme une table
--
DROP TABLE IF EXISTS `lignecommande_vue`;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`CODECATEGORIE`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD KEY `AK_CODECLIENT` (`CODECLIENT`);

--
-- Index pour la table `commande`
--
ALTER TABLE `commande`
  ADD PRIMARY KEY (`CODECOMMANDE`),
  ADD KEY `FK_AVOIR` (`CODECLIENT`);

--
-- Index pour la table `ligne_commande`
--
ALTER TABLE `ligne_commande`
  ADD PRIMARY KEY (`CODECOMMANDE`,`CODEPRODUIT`),
  ADD KEY `FK_LIGNE_COMMANDE` (`CODEPRODUIT`);

--
-- Index pour la table `produit`
--
ALTER TABLE `produit`
  ADD PRIMARY KEY (`CODEPRODUIT`),
  ADD KEY `FK_APPARTIENT` (`CODECATEGORIE`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
