const express = require('express');
const router = express.Router();

const{GetProductId,
     createProduct , 
     GetAllProducts ,
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
     getProductsBySouSCategory} = require('../controllers/ProductController');

router.get("/GetProductId/:id", GetProductId);
router.get("/GetProductImageListById/:id", getImagesProducts);
router.get("/GetAllProducts", GetAllProducts);
router.get("/searchNameProduct/:nom",searchNameProduct);
router.get("/searchTypeProduct/:type", searchTypeProduct);
router.get("/searchBrandProduct/:brand",searchBrandProduct);
router.get("/searchCategoryProduct/:category",searchCategoryProduct);
router.get("/getColorsProduct/:id",getColorsProduct);
router.get("/getColorsProductMobile/:id",getColorsProductMobile);
router.get("/getProductByCategory/:id",getProductByCategory);
router.get("/getProductBySousCategory/:id",getProductsBySouSCategory);
router.put("/UpdateProduct/:id", UpdateProduct);
router.delete("/deleteProduct/:id",deleteProduct)
router.post("/createProduct", createProduct);
router.put("/addProductToOffer/:idP/:idO",addProductToOffer);

module.exports =router