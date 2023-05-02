const Couleur = require("../modals/Couleur");
const CouleursProduit = require("../modals/CouleurProduit");
const  Produit  = require("../modals/Produit");
const { SousCategorie } = require("../modals/SousCategorie");
const { Op } = require('sequelize');
//Get All Products
async function GetAllProducts(req, res) {
  let products;
  try {
    products = await Produit.findAll();
  } catch (err) {
    console.log(err);
  }
  if (products) {
    res.json({ products });
  } else {
    res.status(404).send("Products not found");
  }
}
// Get Product Id
async function GetProductId(req, res) {
  const id = req.params.id;
  let product;
  try {
    product = await Produit.findByPk(id);
  } catch (err) {
    console.log(err);
  }

  if (product) {
    res.json({ product });
  } else {
    res.status(404).send("Product not found");
  }
}
// Insert product
async function createProduct(req, res) {
  const {
    nom,
    marque_id,
    description,
    quantite,
    prix,
    createdAt,
    updatedAt,
    codeBar,
    imageList,
    Tailles,
    sexe,
    souscategorie_id,
    couleurs,
    model
  } = req.body;
  console.log(req.body);
  let product,couleurProduit;
  try {
    product = await Produit.create({
      nom,
      marque_id,
      description,
      quantite,
      prix,
      createdAt,
      updatedAt,
      codeBar,
      imageList,
      Tailles,
      sexe,
      souscategorie_id,
      model
    });
    let id = product.get("id");
    console.log(couleurs);
    for (let i = 0; i < couleurs.length; i++) {
      const couleurId = couleurs[i];
      couleurProduit = await CouleursProduit.create({
        couleurId,
        produitId: id,
        createdAt,
        updatedAt,
      });
    }
  } catch (err) {
    console.log(err);
  }
  if (!product) {
    return res.status(500).json({ message: "Unable to add the product" });
  }
  return res.status(201).json({ product });
}

// update product
async function UpdateProduct(req, res) {
  const id = req.params.id;
  const {
    nom,
    marque_id,
    description,
    quantite,
    prix,
    createdAt,
    updatedAt,
    codeBar,
    imageList,
    Tailles,
    sexe,
    souscategorie_id,
    couleurs,
    model
  } = req.body;
  let product,couleursProduit;
  try {
    product = await Produit.findByPk(id);
    product.set({
      nom,
      marque_id,
      description,
      quantite,
      prix,
      createdAt,
      updatedAt,
      codeBar,
      imageList,
      Tailles,
      sexe,
      souscategorie_id,
      model
    });
    await product.save();
    // récupérer tous les couleures d'un produit
    couleursProduit = await CouleursProduit.findAll({
      where:
      {
        produitId :id
      }
    });
    // supprimer tous les couleurs d'un produit
    couleursProduit.map(async(item)=>{
       await item.destroy();
    });
    // ajouter les nouveaux couleurs d'un produit
    for (let i = 0; i < couleurs.length; i++) {
      const couleurId = couleurs[i];
      couleursProduit = await CouleursProduit.create({
        couleurId,
        produitId: id,
        createdAt,
        updatedAt,
      });
    }
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ product });
}

async function getColorsProduct(req,res)
{  const id = req.params.id;
  let  colorsProduct,couleur,obj, couleurs=[];
  try{
   colorsProduct = await CouleursProduit.findAll({
    where:{
      produitId :id
    }
   });
  await Promise.all( colorsProduct.map(async(item)=>
   { 
      
      couleurs.push(item.couleurId);

   }));
  }catch(err)
  {
    console.log(err)
  }
  return res.status(200).json({ couleurs });
}

// supprimer un produit
async function deleteProduct(req, res) {
  const id = req.params.id;
  try {
    const product = await Produit.findByPk(id);
    await product.destroy();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ message: "Product deleted successfully" });
}
// recherche par nom
async function searchNameProduct(req, res) {
  const nom1 = req.params.nom;
  let product;
  try {
    product = await Produit.findAll({
      nom: {
        [Op.like]: `%${nom1}`, // Search for products that contain the first word in their name
      },
    });
  } catch (err) {
    console.log(err);
  }
  if (product) return res.status(200).json({ product });
}
//rechereche par marque
async function searchBrandProduct(req, res) {
  const marque1 = req.params.brand;
  let product;
  try {
    product = await Produit.findAll({
      where: {
        marque_id: marque1,
      },
    });
  } catch (err) {
    console.log(err);
  }
  if (product) return res.status(200).json({ product });
}
//recherche par catégorie
async function searchCategoryProduct(req, res) {
  const id = req.params.category;
  let product, souscategorieNum,sousCategorie;
  try {
    product = await Produit.findByPk(id);
    souscategorieNum = product.get("souscategorie_id");
    sousCategorie= await SousCategorie.findByPk(souscategorieNum);
  } catch (err) {
    console.log(err);
  }
  if (sousCategorie) return res.status(200).json([sousCategorie]);
}
// recherche par type 
async function searchTypeProduct(req, res) {
  const type = req.params.type;
  let product;
  try {
    product = await Produit.findAll({
      where: {
        type_id: type,
      },
    });
  } catch (err) {
    console.log(err);
  }
  if (product) return res.status(200).json({ product });
}

async function addProductToOffer(req, res) {
  const idProduct = req.params.idP;
  const idOffer = req.params.idO;
  let product;
  try {
    product = await Produit.findByPk(idProduct);
    product.set({
      offreId: idOffer,
    });
    await product.save();
  } catch (err) {
    console.log(err);
  }
  if (product) return res.status(200).json({ product });
}
async function getImagesProducts(req,res)
{
  const id = req.params.id;
  let product , imagelist
  try{
   product = await Produit.findByPk(id);
   imagelist = product.get("imageList");
  }catch(err)
  {
    console.log(err)
  }
  if (imagelist) return res.status(200).json({ imagelist });
}
async function getProductByCategory (req,res)
{ let products, category , idCategory ,TabIdCategory=[];
  const categorie = req.params.id;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  console.log(categorie);
  try{
  if(categorie === "Vêtements")
  {
    category = await SousCategorie.findOne({
      where:
      {
        nomcategorie:categorie
      }
     });
     idCategory = category.get("idSousCategorie");
     products = await Produit.findAll({
      where :
      {
        souscategorie_id :idCategory
      }
     })
  }else if(categorie === "Accessoires")
  {
    category = await SousCategorie.findAll({
      where:
      {
        nomcategorie:categorie
      }
     });
     await Promise.all( category.map(async(item,index)=>
    {
      TabIdCategory.push(item.get("idSousCategorie"))
    }))
    products = await Produit.findAll({
      where :
      {
        [Op.or]: [
          { souscategorie_id: TabIdCategory[0] },
          { souscategorie_id: TabIdCategory[1] }
        ]
      }
     })
  }else if(categorie === "Nouveauté")
  {
    products = await Produit.findAll({
      where :
      {
        createdAt: {
          [Op.gt]: weekAgo
        }
      }
     })
  }else if(categorie === "Promotion")
  {
    products = await Produit.findAll({
      where :
      {
        offreId: {
          [Op.not]: null
        }
      }
     })
  }else if(categorie === "Essayer")
  {
    products = await Produit.findAll({
      where :
      {
        model: {
          [Op.not]: null
        }
      }
     })
  }
  }catch(err)
  {
    console.log(err)
  }
  if (products) return res.status(200).json({ products });
}
async function getColorsProductMobile(req,res)
{  const id = req.params.id;
  let  colorsProduct,couleur,obj, couleurs=[];
  try{
   colorsProduct = await CouleursProduit.findAll({
    where:{
      produitId :id
    }
   });
  await Promise.all(colorsProduct.map(async(item)=>
   {  
      obj = await Couleur.findByPk(item.couleurId);
      couleur = obj.get("couleur")
      couleurs.push(couleur);
   }));
  }catch(err)
  {
    console.log(err)
  }
  return res.status(200).json({ couleurs });
}
async function getProductsBySouSCategory (req,res)
{ 
  const idCategory = req.params.id;
  let products;
  try{
    products = await Produit.findAll({
      where:{
        souscategorie_id : idCategory
      }
    })
  }catch(err)
  {
    console.log(err);
  }
  return res.status(200).json({ products });
}

module.exports = {
  GetProductId,
  createProduct,
  GetAllProducts,
  UpdateProduct,
  deleteProduct,
  searchNameProduct,
  searchBrandProduct,
  searchCategoryProduct,
  searchTypeProduct,
  addProductToOffer,
  getImagesProducts,
  getColorsProduct,
  getProductByCategory,
  getColorsProductMobile,
  getProductsBySouSCategory
};
