const express = require('express');
const router = express.Router();

const {createAvis,getAllAvis,getAvisByIdProd} = require('../Controllers/AvisController');

router.post("/createAvis",createAvis);
router.get("/getAllAvis",getAllAvis);
router.get("/getAvisByIdProd/:id",getAvisByIdProd);
module.exports= router;