const  Produit  = require("../modals/Produit");
const Offre = require('../modals/Offre');
const moment = require('moment')
//create Offre
async function createOffre(req, res) {
  const { nom, pourcentage, dateEnd, createdAt, updatedAt } = req.body;
  console.log(req.body);
  let offre;
  try {
    offre = await Offre.create({
      nom,
      pourcentage,
      dateEnd,
      createdAt,
      updatedAt,
    });
  } catch (err) {
    console.log(err);
  }
  if (!offre) {
    return res.status(500).json({ message: "Unable to add offre" });
  }
  return res.status(201).json({ offre });
}
// get all offers
async function getAllOffres(req, res) {
  let offres;
  try {
    offres = await Offre.findAll();
  } catch (err) {
    console.log(err);
  }
  if (offres) {
    res.json({ offres });
  } else {
    res.status(404).send("offres not found");
  }
}
// get offer by id 
async function getOffreId(req, res) {
  const id = req.params.id;
  let offre;
  try {
    offre = await Offre.findByPk(id);
  } catch (err) {
    console.log(err);
  }
  if (offre) {
    res.json({ offre });
  } else {
    res.status(404).send("No offer has this id");
  }
}
// update offer
async function updateOffer(req, res) {
  const id = req.params.id;
  const { nom, pourcentage, dateEnd, createdAt, updatedAt } = req.body;
  console.log(req.body);
  let offre;
  try {
    offre = await Offre.findByPk(id);
    offre.set({
      nom,
      pourcentage,
      dateEnd,
      createdAt,
      updatedAt,
    });
    await offre.save();
  } catch (err) {
    console.log(err);
  }
  if (!offre) {
    return res.status(500).json({ message: "Unable to update offre" });
  }
  return res.status(201).json({ offre });
}
// Set null to products that belongs to that offer 
async function deleteProductsOfOffre(req, res) {
  const id = req.params.id;
  let offre,disabled=false;
  const currentDate =  moment().format('YYYY-MM-DD');
  console.log(currentDate);
  try {
    offre = await Offre.findByPk(id);
    const date = offre.get("dateEnd");
    if (currentDate == date) {
      const products = await Produit.findAll({
        where: {
          offreId: id,
        },
      });
      products.map(async (product) => {
        product.set({
          offreId: null,
        });
        await product.save();
      });
      disabled = false
    }
    else
    {
       disabled = true
    }
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ disabled });
}
async function deleteAnOffer(req, res) {
  const id = req.params.id;
  let offre;
  try {
    offre = await Offre.findByPk(id);
    await offre.destroy();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ message: "offre deleted successfully" });
}
async function searchOffre(req, res) {
  const nom1 = req.params.nom;
  let offre;
  try {
     offre = await Offre.findAll({
      where: {
        nom: nom1,
      },
    });
  } catch (err) {
    console.log(err);
  }
  if (offre) return res.status(200).json({ offre });
}
module.exports = {
  createOffre,
  getAllOffres,
  getOffreId,
  updateOffer,
  deleteProductsOfOffre,
  deleteAnOffer,
  searchOffre
};
