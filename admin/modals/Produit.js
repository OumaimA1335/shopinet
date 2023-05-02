const { DataTypes } = require("sequelize");
const sequelize = require("../../database");
const {Categorie, SousCategorie} = require("./SousCategorie");
const { Commande, CommandeProduit } = require("./Commande");
const Marque = require("./Marque");
const Offre = require("./Offre");
const Type = require("./Type");
const Couleur = require("./Couleur");

// Entité Produit
const Produit = sequelize.define("produit", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marque_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Marque,
      key: "id",
    },
  },
  
  description: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prix: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  offreId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Offre,
      key: "id",
    },
  },
  codeBar: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  imageList: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    allowNull: false,
  },
  Tailles: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    allowNull: false,
  },
  sexe: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  souscategorie_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: SousCategorie,
      key: "idSousCategorie",
    },
  },
  model: {
    type: DataTypes.CHAR,
    allowNull: true,
  }
});

// un offre a plusieurs produits et un produit appartient à un seul offre
Offre.hasMany(Produit);
Produit.belongsTo(Offre, { foreignKey: "offreId" });

// un produit a une seul catégorie , et une catégorie appartient à plusieurs produits
Categorie.hasMany(Produit, { foreignKey: "souscategorie_id" });
Produit.belongsTo(Categorie, { foreignKey: "souscategorie_id" });

// un produit appartient à une seul marque , une marque a plusieurs produits
Marque.hasMany(Produit, { foreignKey: "marque_id" });
Produit.belongsTo(Marque, { foreignKey: "marque_id" });


// un produit appartient qu'a un seul type , et type a plusieurs produits
/*Type.hasMany(Produit, { foreignKey: "type_id" });
Produit.belongsTo(Type, { foreignKey: "type_id" });*/

module.exports = Produit;
