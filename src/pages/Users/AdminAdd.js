import React from 'react'
import FormGroup from "@mui/material/FormGroup";
import { Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useState ,useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
const AdminAdd = () => {
  const { signup,user } = useAuth();
  const history = useNavigate();
  const [inputs, setInputs]=useState ({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try 
    {
      await signup(inputs.email,inputs.password);
      console.log(user);
      await axios.post("http://localhost:5005/Admin/createAccount",{
        email :String(inputs.email),
        role_id : Number(2)
      })
      history("/admin/liste-admin");
    } catch (err) {
      console.log(err);
    }
    console.log(inputs);
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
              Ajouter un sous admin
            </legend>
            <TextField
              label="Email"
              variant="outlined"
              color="warning"
              name="email"
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  email: e.target.value,
                })
              }
              value={inputs.email}
              focused
              required
              style={{ marginTop: "20px",marginBottom: "20px" }}
              InputLabelProps={{
                style: { fontWeight: "bold", fontSize: "16px" },
              }}
            />
              <TextField
              label="Mot de passe"
              variant="outlined"
              type={"password"}
              color="warning"
              focused
              required
              style={{ marginTop: "20px",marginBottom: "20px" }}
              InputLabelProps={{
                style: { fontWeight: "bold", fontSize: "16px" },
              }}
            />
            <TextField
              label="Confirmer"
              variant="outlined"
              type={"password"}
              color="warning"
              name="nom"
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  password: e.target.value,
                })
              }
              value={inputs.password}
              focused
              required
              style={{ marginTop: "20px",marginBottom: "20px" }}
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
                
              }}
              onClick={handleSubmit}
            >
              Ajouter 
            </Button>
          </FormGroup>
        </Box>
      </CardContent>
    </Card>
  </div>
  )
}

export default AdminAdd
