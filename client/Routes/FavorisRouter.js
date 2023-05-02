const express = require('express');
const router = express.Router();

const {createFavoris,getProducts,getFavoriteProductById,deletefavoriteProduct}=require("../Controllers/FavorisController");

router.post("/createFavoris",createFavoris);
router.get("/getFavoriteProducts",getProducts);
router.get("/getFavoriteProductById/:id",getFavoriteProductById);
router.delete("/deletefavoriteProduct/:idClient/:idProd",deletefavoriteProduct);
module.exports=router;