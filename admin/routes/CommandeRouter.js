const express = require('express');
const router = express.Router();

const {createCommande ,getCommandes ,
    getNewCommandes,updateEtatCommande,
    getFactureCommande,getCommandeClient,
    cancelCommandeByClient,getProductsCommande
    ,getCommande,getClient} = require('../controllers/CommandeController')

router.post("/createCommande",createCommande);
router.get("/getAllCommandes",getCommandes);
router.get("/getNewCommandes",getNewCommandes);
router.get("/getFacture/:id",getFactureCommande);
router.get("/getClientCommande/:id",getCommandeClient);
router.put("/updateCommande/:id",updateEtatCommande);
router.delete("/cancelCommande/:id",cancelCommandeByClient);
router.get("/getProductsCommande/:id",getProductsCommande);
router.get("/getCommande/:id",getCommande);
router.get("/getClient/:id",getClient);
module.exports=router;