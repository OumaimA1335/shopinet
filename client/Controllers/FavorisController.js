const Produit = require("../../admin/modals/Produit");
const FavorisProduits = require("../Modals/FavorisProduits");
const _ = require("lodash");

// insertion favoris
async function createFavoris(req, res) {
  const { userId, idProducts, createdAt, updatedAt } = req.body;
  let favorisproduits, find;
  try {
    console.log("if 1");
    console.log(idProducts);
    await Promise.all(
      idProducts.map(async (produitId) => {
        find = await FavorisProduits.findOne({
          where: {
            userId: userId,
            produitId: produitId,
          },
        });
        //console.log(find);
        if (find) {
          console.log("this product is already exist");
        } else {
          favorisproduits = await FavorisProduits.create({
            userId,
            produitId,
            createdAt,
            updatedAt,
          });
        }
      })
    );
  } catch (err) {
    console.log(err);
  }
  if (find) {
    res.status(500).json({ message: "this product is already exist" });
  } else {
    res.status(201).json({ favorisproduits });
  }
}

async function getProducts(req, res) {
  let favorisProducts,
    produits = [];
  try {
    favorisProducts = await FavorisProduits.findAll();
    await Promise.all(
      favorisProducts.map(async (produit) => {
        let idProduit = produit.get("produitId");
        let prod = await Produit.findAll({
          where: {
            id: idProduit,
          },
        });
        if (produits.find((p) => _.isEqual(p, prod))) {
          console.log("ce produit déja exisyte dans la liste");
        } else {
          produits.push(prod);
        }
      })
    );
  } catch (err) {
    console.log(err);
  }
  console.log(produits);
  if (!produits) {
    return res.status(500).json({ message: "Unable to get all favorites" });
  }
  return res.status(201).json({ produits });
}

async function getFavoriteProductById(req, res) {
  const id = req.params.id;
  let favorisProduits,
    produits = [];
  try {
    favorisProduits = await FavorisProduits.findAll({
      where: {
        userId: id,
      },
    });
    await Promise.all(
      favorisProduits.map(async (produit) => {
        let id = produit.get("produitId");
        produits.push(await Produit.findByPk(id));
      })
    );
  } catch (err) {
    console.log(err);
  }
  if (!produits) {
    return res
      .status(500)
      .json({ message: "Unable to get all favorites products" });
  }
  return res.status(201).json({ produits });
}

async function deletefavoriteProduct(req, res) {
  const userId = req.params.idClient;
  const produitId = req.params.idProd;
  let favoriteProduct;
  try {
    favoriteProduct = await FavorisProduits.findOne({
      where: {
        userId,
        produitId,
      },
    });
    favoriteProduct.destroy();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ message: "product deleted successfully" });
}

module.exports = {
  createFavoris,
  getProducts,
  getFavoriteProductById,
  deletefavoriteProduct,
};
