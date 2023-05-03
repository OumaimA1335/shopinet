import React from "react";
import FormGroup from "@mui/material/FormGroup";
import { Button, FormControl } from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import {BsCircle} from "react-icons/bs"
import CardContent from "@mui/material/CardContent";
import CarouselItems from "../../Components/CarouselItems";
import { useState, useEffect } from "react";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import { useParams } from "react-router-dom";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Carousel from 'react-material-ui-carousel';
import Paper from '@mui/material/Paper';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../Config/FirebaseConfig";
import { v4 } from "uuid";
const ProductAdd = () => {
  const { id } = useParams();
  const history = useNavigate();
  console.log(id);

  const [souscategorie, setSousCategorie] = React.useState([]);
  const [Taille, setTaille] = React.useState([]);
  const [TailleChoisi, setTailleChoisi] = React.useState([]);
  const [marque, setMarque] = React.useState([]);
  const [image1, setImage1] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [colors,setColors] =useState([]);
  const [inputs, setInputs] = useState({
    nom: "",
    marque_id: 0,
    souscategorie_id: 0,
    description: "",
    quantite: 0,
    prix: 0,
    codeBar: "",
    imageList: [""],
    Tailles: [""],
    sexe: "",
    couleurs :[]
  });
  useEffect(() => {
    const fetchHandlerSousCategorie = async () => {
      return await axios
        .get(
          `http://localhost:5005/SousCategorie/getSouCategorieByIdCategorie/${id}`
        )
        .then((res) => res.data);
    };
    const fetchHandlerMarque = async () => {
      return await axios
        .get("http://localhost:5005/Marque/getAllMarques")
        .then((res) => res.data);
    };
    const fetchHandlerColors = async () => {
      return await axios
        .get(
          "http://localhost:5005/Couleur/getAllColors"
        )
        .then((res) => res.data);
    };
    fetchHandlerSousCategorie().then((data) => {
      setSousCategorie(data.sousCategorie);
      console.log(data);
    });
    fetchHandlerMarque().then((data) => {
      setMarque(data.marques);
      console.log(data);
    });
    fetchHandlerColors().then((data) => {
      setColors(data.colors);
      console.log(data);
    });
  }, []);
  console.log(colors);
  useEffect(() => {
    const fetchHandlerTaille = async () => {
      return await axios
        .get(`http://localhost:5005/SousCategorie/fetchTailleBasedOnSousCategory/${inputs.souscategorie_id}`)
        .then((res) => res.data);
    };
    if (inputs.souscategorie_id !== 0) {
    fetchHandlerTaille().then((data) => {
      setTaille(data)
      console.log(data);
      console.log(Taille);
    });
  }
 
  }, [inputs.souscategorie_id]);
  console.log(Taille);
/**const handleStorageImage =async() => {
    console.log(image1);  
  await Promise.all( image1.map((item)=>{
        const imageRef = ref(storage, `product/${item.nom}`);
        uploadBytes(imageRef,item.url).then(()=>{
          getDownloadURL(imageRef)
          .then((url) => {
            setImageUrls((prev) => [...prev, url]);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
        })

          
          //setImage(null);
        })
  )
    
      console.log(imageUrls);
  };*/
console.log(imageUrls);
 async function  handleImageUpload (e) {
    let nom = v4();
    const imageRef = ref(storage, `product/${nom}`);
    const file = e.target.files[0];
    await uploadBytes(imageRef,file).then(()=>{
      getDownloadURL(imageRef)
      .then((url) => {
        setImage1((prev) => [...prev, {
          nom,
          url
        }]);
      })
      .catch((error) => {
        console.log(error.message, "error getting the image url");
      });
    });

    console.log(image1);
 
  }
  const handleDeleteImage = (item,index) => {
    //suppression de firebase
   const imageRef = ref(storage, "product/"+item.nom);
    console.log(imageRef);
    deleteObject(imageRef).then(() => {
      console.log('Image deleted successfully!');
    }).catch((error) => {
      console.log('Error deleting image:', error);
    });

  // update state
  setImage1((prevImages) => {
    const newImages = [...prevImages];
    newImages.splice(index, 1);
    return newImages;
  })
   
  };
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    console.log(e.target.name, "Value", e.target.value);
  };
  const handleChangeTaille = (event) => {
    const {
      target: { value },
    } = event;
    setTailleChoisi(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const sendRequest= async()=>
  { 
    console.log("entrer")
    console.log(inputs.couleurs)
    await axios.post("http://localhost:5005/Product/createProduct",{
    nom :String(inputs.nom),
    marque_id : Number(inputs.marque_id),
    souscategorie_id :Number(inputs.souscategorie_id),
    description:String(inputs.description),
    quantite:Number(inputs.quantite),
    prix:Number(inputs.prix),
    codeBar :String(inputs.codeBar),
    imageList:image1,
    Tailles :TailleChoisi,
    sexe:String(inputs.sexe),
    couleurs:inputs.couleurs
  }).then(res=> {res.data
  console.log(res.data)});
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    console.log(TailleChoisi)
    sendRequest().then(() => history("/admin/liste-produit"))
  };
  return (
    <div>
      <Card style={{ width: "600px", height: "1200px", margin: "20px" }}>
        <CardContent>
          <Box
            sx={{
              alignItems: "left",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FormGroup>
              <legend
                style={{
                  fontFamily: "initial",
                  fontStyle: "-moz-initial",
                }}
              >
                Ajouter un produit
              </legend>
              <TextField
                label="Code Bar"
                variant="outlined"
                color="warning"
                name="codeBar"
                value={inputs.codeBar}
                onChange={handleChange}
                focused
                required
                style={{ margin: "20px" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
              />

              <TextField
                label="Nom"
                variant="outlined"
                color="warning"
                name="nom"
                value={inputs.nom}
                onChange={handleChange}
                focused
                required
                style={{ margin: "20px" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
              />
              <TextField
                id="standard-select-currency"
                select
                label="Sous Catégorie"
                helperText="S'il vous plait choisir la sous catégorie"
                variant="outlined"
                color="warning"
                name="souscategorie_id"
                value={inputs.souscategorie_id}
                onChange={handleChange}
                required
                focused
                style={{ margin: "20px" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
              >
                {souscategorie.map((option) => (
                  <MenuItem key={option.id} value={option.idSousCategorie}>
                    {option.nom}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="standard-select-currency"
                select
                label="Marque"
                helperText="S'il vous plait choisir la marque"
                variant="outlined"
                color="warning"
                name="marque_id"
                value={inputs.marque_id}
                onChange={handleChange}
                required
                focused
                style={{ margin: "20px" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
               
              >
                {marque.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nom}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                select
                label ="Tailles"
                value={TailleChoisi}
                onChange={handleChangeTaille}
                input={<OutlinedInput label="Name" />}
                color="warning"
                style={{ margin: "20px" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => {
                    if (Array.isArray(selected)) {
                      return selected.join(", ");
                    }
                    return selected;
                  },
                }}
              >
                {Taille && Taille.length>0 && Taille.map((item) => (
                 item.tableauTaille.map((i)=>
                  (<MenuItem
                    key={i}
                    value={i}  
                  >
                    {i}
                  </MenuItem>
                  ))
                ))}
                  </TextField>
                  
                <TextField
                id="standard-select-currency"
                select
                label="Couleur"
                helperText="S'il vous plait choisir la marque"
                variant="outlined"
                color="warning"
                name="couleurs"
                value={inputs.couleurs}
                onChange={handleChange}
                required
                focused
                style={{ margin: "20px" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => {
                    if (Array.isArray(selected)) {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {selected.map((value) => (
                            <div key={value} style={{ marginRight: 10 }}>
                              <BsCircle className="fs-4" style={{ color: colors.find((c) => c.id === value)?.couleur, backgroundColor: colors.find((c) => c.id === value)?.couleur }} />
                            </div>
                          ))}
                        </div>
                      );
                    }
                  },
                }}
              >
                {colors.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    
                  <BsCircle className="fs-4" style={{ color: option.couleur ,backgroundColor: option.couleur}}/>
                  </MenuItem>
                ))}
              </TextField>
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                style={{
                  marginLeft: "30px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "orange",
                }}
              >
                Sexe
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                defaultValue="female"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value={inputs.sexe}
                  control={<Radio value={"Femme"} color="warning" />}
                  onClick={handleChange}
                  label="Female"
                  name="sexe"
                  style={{
                    margin: "20px",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                />
                <FormControlLabel
                  value={inputs.sexe}
                  control={<Radio value={"Homme"} color="warning" />}
                  label="Male"
                  onClick={handleChange}
                  name="sexe"
                  style={{
                    margin: "20px",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                />
              </RadioGroup>

              <TextField
                id="standard-multiline-flexible"
                label="Description"
                multiline
                maxRows={4}
                variant="outlined"
                color="warning"
                name="description"
                value={inputs.description}
                onChange={handleChange}
                required
                focused
                style={{ margin: "20px" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
              />
              <TextField
                label="Prix"
                variant="outlined"
                color="warning"
                name="prix"
                value={inputs.prix}
                onChange={handleChange}
                focused
                required
                style={{ margin: "20px" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
              />
              <TextField
                label="Quantite"
                variant="outlined"
                color="warning"
                name="quantite"
                value={inputs.quantite}
                onChange={handleChange}
                focused
                required
                style={{ margin: "20px", textDecoration: "blod" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
              />
              <Button
                variant="contained"
                color="warning"
                style={{
                  fontFamily: "initial",
                  fontStyle: "-moz-initial",
                  margin: "20px",
                }}
                onClick={handleSubmit}
              >
                Ajouter
              </Button>
            </FormGroup>
          </Box>
        </CardContent>
      </Card>
      <Card
        style={{
          marginTop: "-1119px",
          width: "450px",
          height: "600px",
          marginLeft: "662px",
        }}
      >
        <CardContent>
          <Box
            sx={{
              alignItems: "left",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FormControl>
              <legend
                style={{
                  fontFamily: "initial",
                  fontStyle: "-moz-initial",
                }}
              >
                Séléctionner les images de produit
              </legend>
              <Carousel>
              {image1 && image1.length>0  && image1.map((item,index)=> (
             <Paper>
             <img
              style={{
                width: '300px',
                height: '300px',
                marginLeft: '55px',
              }}
              src={item.url}
            />
              <Button
              variant="contained"
              color="warning"
              style={{ marginLeft: '150px', marginBottom: '15px' }}
              onClick={() => handleDeleteImage(item,index)}
            >
              Supprimer
            </Button>
             </Paper>))
             
             }
           
              </Carousel>

              <Button
                component="label"
                color="warning"
                variant="contained"
                htmlFor="account-settings-upload-image"
                
                style={{
                  marginTop: "20px",
                  fontFamily: "initial",
                  fontStyle: "-moz-initial",
                }}
              >
                Sélectionner une image
                <input
                  hidden
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg"
                  id="account-settings-upload-image"
                />
              </Button>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductAdd;
