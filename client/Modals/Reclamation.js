const { DataTypes, Model } = require('sequelize');
const {Commande} = require('../../admin/modals/Commande');
const sequelize = require('../../database');
const Users = require('../../admin/modals/Users');
class Reclamation extends Model {}
Reclamation.init( {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.STRING,
    unique : true,
    allowNull: false
  },
  etat: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue :'Non vérifieé'
  },
  idClient: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Users,
      key: "id",
    },
  },
  idCommande: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Commande,
      key: "id",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {sequelize, modelName: 'réclamations' });

// chaque client un zéro ou plusieurs réclamation
Users.hasMany(Reclamation,{foreignKey :'idClient'});
Reclamation.belongsTo(Users, {foreignKey:'idClient'});

// chaque commande a une réclamation
Commande.hasOne(Reclamation,{foreignKey:'idCommande'});
Reclamation.belongsTo(Commande,{foreignKey:'idCommande'});

module.exports = Reclamation ;