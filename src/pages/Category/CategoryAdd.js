import FormGroup from "@mui/material/FormGroup";
import {Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import { useState,useEffect } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
const SousCategoryAdd = () => {
  const history = useNavigate();
  const [Taille, setTaille] = useState([]);
  const [inputs, setInputs]=useState ({
    nom:'',
    nomcategorie: '',
    idSize :0
  });
  const categorie =[
    {
      id :1,
      nom :'Vêtements'
    },
    {
      id :2,
      nom :'Accessoires'
    }
  ]
  useEffect(() => {
    const fetchHandler = async () => {
      return await axios
        .get("http://localhost:5005/Taille/getAllTailles")
        .then((res) => res.data);
    };
    fetchHandler().then((data) => {
      setTaille(data.tailles);
      console.log(data);
    });
  }, []);

  const handleChange = (e)=>
  {
    setInputs((prevState)=>
    ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
    console.log(e.target.name, e.target.value);
  }
  const sendRequest= async()=>
  {
    console.log("entrer")
    await axios.post("http://localhost:5005/SousCategorie/createSousCategorie",{
    nom :String(inputs.nom),
    nomcategorie :String(inputs.nomcategorie),
    idSize : Number(inputs.idSize)
  }).then(res=> {res.data
  console.log(res.data)});


  }
const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/admin/liste-Categorie"))
  };
  return (
    <div>
      <Card style={{ width: "600px", height: "500px", marginLeft: "200px" }}>
        <CardContent>
          <Box
            sx={{
              alignItems: "center",
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
                Ajouter sous catégorie
              </legend>
              <TextField
                label="Nom"
                variant="outlined"
                color="warning"
                name="nom"
                onChange={handleChange}
                value={inputs.nom}
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
                label="Catégorie"
                helperText="S'il vous plait choisir la  catégorie"
                variant="outlined"
                color="warning"
                name="nomcategorie"
                onChange={handleChange}
                value={inputs.nomcategorie}
                required
                focused
                style={{ margin: "20px" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
              >
                {categorie.map((option) => (
                  <MenuItem key={option.id} value={option.nom}>
                    {option.nom}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="standard-select-currency"
                select
                label="tailles"
                helperText="S'il vous plait choisir la catégorie taille"
                variant="outlined"
                color="warning"
                name="idSize"
                onChange={handleChange}
                value={inputs.idSize}
                required
                focused
                style={{ margin: "20px" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
              >
                {Taille.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nom}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="warning"
                onClick={handleSubmit}
                style={{
                  fontFamily: "initial",
                  fontStyle: "-moz-initial",
                  margin: "20px",
                }}
              >
                Ajouter
              </Button>
            </FormGroup>
          </Box>
        </CardContent>
      </Card>
      
      
    </div>
  );
};

export default SousCategoryAdd;
