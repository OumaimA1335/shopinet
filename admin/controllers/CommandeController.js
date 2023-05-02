const { Commande } = require("../modals/Commande");
const CommandeProduit = require("../modals/CommandeProduit");
const Facture = require("../modals/Facture");
const Produit = require("../modals/Produit");
const Users = require("../modals/Users");

async function createCommande(req, res) {
  // const id = req.params.id;
  const { Adresse, Tel, createdAt, updatedAt, idClient, Paiement, Products } =
    req.body;
  console.log(req.body);
  let commande, commandeId;
  try {
    // création de la commande
    commande = await Commande.create({
      Adresse,
      Tel,
      createdAt,
      updatedAt,
      idClient,
      Paiement,
    });

    // affectation des produits avec leurs quantité à la commande crée
    commandeId = await commande.get("id");
    console.log(commandeId);
    Products.map(async (produit) => {
      console.log(produit);
      await CommandeProduit.create({
        commandeId,
        produitId: produit.id,
        quantite: produit.quantite,
        createdAt,
        updatedAt,
      });
    });

    // création facture
    let product,
      prixProduit = 0,
      tvaProduit = 0,
      prixHorsTaxe = 0,
      prixTTCProduit = 0;
    let TotalHT = 0,
      TotalTTC = 0,
      TVA = 0,
      TotalNet = 0;
    const Tva = 19,
      Timbre = 1000,
      FraisTransport = 7000;
    await Promise.all(
      Products.map(async (produit) => {
        product = await Produit.findByPk(produit.id);
        prixProduit = product.get("prix");
        //console.log("le prix de produit est "+prixProduit);
        prixHorsTaxe = prixProduit * produit.quantite;
        //console.log("le prix Hors taxe de produit est "+prixHorsTaxe);
        tvaProduit = prixProduit * (Tva / 100);
        //console.log("le TVA de produit est "+tvaProduit);
        TotalHT = TotalHT + prixHorsTaxe;
        //console.log("le TotalHT des produit est "+TotalHT);
        TVA = TVA + tvaProduit;
        //console.log("le TVA des produits est "+TVA);
        prixTTCProduit = prixHorsTaxe + tvaProduit;
        //console.log("le prixTTC de produit est "+prixTTCProduit);
        TotalTTC = TotalTTC + prixTTCProduit;
        //console.log("le TotalTTC  des produits est "+prixTTCProduit);
      })
    );
    TotalNet = TotalTTC + Timbre + FraisTransport;
    // Affichage des données
    //console.log(TotalHT,TotalTTC,TotalNet,TVA);
    await Facture.create({
      TotalHT,
      TVA,
      TotalTTC,
      TotalNet,
      createdAt,
      updatedAt,
      commandeId,
    });
  } catch (err) {
    console.log(err);
  }
  if (!commande) {
    return res.status(500).json({ message: "Unable to add commande" });
  }
  return res.status(201).json({ commande });
}
// affichage  de tous les commandes
async function getCommandes(req, res) {
  let commandes;
  try {
    commandes = await Commande.findAll();
  } catch (err) {
    console.log(err);
  }
  if (commandes) {
    res.json({ commandes });
  } else {
    res.status(404).send(" commandes not found");
  }
}

//affichage des nouveaux commandes
async function getNewCommandes(req, res) {
  let commandes;
  try {
    commandes = await Commande.findAll({
      where: {
        Etat: "Non livrée",
      },
    });
  } catch (err) {
    console.log(err);
  }
  if (commandes) {
    res.json({ commandes });
  } else {
    res.status(404).send("There is no new orders");
  }
}
// récupérer la commande d'un client
async function getCommandeClient(req, res) {
  const id = req.params.id;
  let commande;
  try {
    commande = await Commande.findAll({
      where: {
        idClient: id,
      },
    });
  } catch (err) {
    console.log(err);
  }
  if (commande) {
    res.json({ commande });
  } else {
    res.status(404).send("You have no old order");
  }
}
//Modifier l'etat d'une commande à livreé par l'admin
async function updateEtatCommande(req, res) {
  const id = req.params.id;
  let commande;
  try {
    commande = await Commande.findByPk(id);
    commande.set({
      Etat: "Livrée",
    });
    commande.save();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ commande });
}
// recuperer la facture d'une commande
async function getFactureCommande(req, res) {
  let facture;
  const id = req.params.id;
  try {
    facture = await Facture.findAll({
      where: {
        commandeId: id,
      },
    });
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ facture });
}
// Annulation d'une commande par un client
async function cancelCommandeByClient(req, res) {
  const id = req.params.id;
  let commande, etat;
  try {
    commande = await Commande.findByPk(id);
    etat = commande.get("Etat");
    if (etat == "Non livrée") {
      await commande.destroy();
    }
    else {
     return  res.json({
        message: "Commande has been validated , you can't cancel it now",
      });
    }
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ message: "Commande deleted successfully" });
}
//recuprer les produits et la quantité d'un produits 
async function getProductsCommande(req,res)
{
  const id = req.params.id;
  let commandeProduits,produit,Produits=[];
  try{
    commandeProduits = await CommandeProduit.findAll(
      {
        where:{
          commandeId :id
        }
      }
    );
 await Promise.all(commandeProduits.map(async(item,index)=>{
     produit = await Produit.findByPk(item.produitId);
     Produits.push(
      {
        nom : produit.get("nom"),
        prix :produit.get("prix"),
        quantite :item.quantite
      }
     )
    }))
  }catch(err)
  {
    console.log(err);
  }
  if (commandeProduits) {
    res.json({ Produits });
  } else {
    res.status(404).send("cette commande n'a pas produits");
  }
}
//recuperer une commande 
async function getCommande(req,res)
{
  const id = req.params.id;
  let commande
  try{
     commande = await Commande.findByPk(id);
  }catch(err)
  {
    console.log(err);
  }
  if (commande) {
    res.json([ commande ]);
  } else {
    res.status(404).send("Il n'a pas une commande de cette id");
  }
}
//récuperer le client à traver l'id de commande
async function getClient(req,res)
{ 
  const id = req.params.id;
  let client,idClient,commande;
  try{
   commande = await Commande.findByPk(id);
   idClient = commande.get("idClient");
   client = await Users.findByPk(idClient);
  }catch(err)
  {
    console.log(err);
  }
  if (client) {
    res.json(client);
  } else {
    res.status(404).send("Il n'a pas client qui a cette commande");
  }
}
module.exports = {
  createCommande,
  getCommandes,
  getNewCommandes,
  updateEtatCommande,
  getFactureCommande,
  getCommandeClient,
  cancelCommandeByClient,
  getProductsCommande,
  getCommande,
  getClient
};
