const { Commande } = require("../../admin/modals/Commande");
const CommandeProduit = require("../../admin/modals/CommandeProduit");
const Avis = require("../Modals/Avis");

//ajouter un avis à un produit par un client , s'il est déja l'acheteé
async function createAvis(req, res) {
  const { nbEtoile, description, idClient, idProduit, createdAt, upadtedAt } =
    req.body;
  let avis, commandesClient, commandeProduit;
  try {
    commandesClient = await Commande.findAll({
      where: {
        idClient: idClient,
      },
    });
   await Promise.all(commandesClient.map(async (commande) => {
        id = commande.get("id");
        commandeProduit = await CommandeProduit.findAll({
          where: {
            commandeId: id,
            produitId: idProduit,
          },
        });
      }));
    console.log(commandeProduit);
    if (commandeProduit.length!=0) {
      avis = await Avis.create({
        nbEtoile,
        description,
        idClient,
        idProduit,
        createdAt,
        upadtedAt,
      });
    }
  } catch (err) {
    console.log(err);
  }
  if (!avis) {
    return res.status(500).json({ message: "Unable to add avis" });
  }
  return res.status(201).json({ avis });
}

// consulter les avis

async function getAllAvis(req,res)
{   
    let avis;
    try{
        avis = await Avis.findAll();
    }catch(err)
    {
        console.log(err);
    }
    if (!avis) {
        return res.status(500).json({ message: "Unable to get avis" });
      }
      return res.status(201).json({ avis });
}
// get avis by id product
async function getAvisByIdProd (req,res)
{   const id = req.params.id;
    let avis ;
   try{
     avis = await Avis.findAll({
        where :{
            idProduit :id
        }
     })
   }catch(err)
   {
    console.log(err);
   }
   if (!avis) {
    return res.status(500).json({ message: "Unable to get avis by id product" });
  }
  return res.status(201).json({ avis });
}
module.exports = {
  createAvis,
  getAllAvis,
  getAvisByIdProd
};
