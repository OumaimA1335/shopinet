import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { auth } from "../Config/FirebaseConfig";
export const Login = () => {
  const { login, isuser } = useAuth();
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let verify = await axios.post("http://localhost:5005/Admin/verifyAdmin", {
        email: String(inputs.email),
      });
      if (verify) {
        await login(inputs.email, inputs.password);
        console.log(auth.currentUser);
        localStorage.setItem("user",auth.currentUser.toJSON())
        history("/admin");
      } else {
        console.log("You are not admin");
      }
    } catch (err) {
      console.log(err);
    }
    console.log(inputs);
  };
  return (
    <div>
      <Card
        style={{
          width: "450px",
          height: "400px",
          marginLeft: "500px",
          marginTop: "100px",
        }}
      >
        <CardContent>
          <Box
            sx={{
              alignItems: "center",
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
                Login
              </legend>
              <TextField
                label="Email"
                variant="outlined"
                color="warning"
                name="email"
                type={"email"}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    email: e.target.value,
                  })
                }
                value={inputs.email}
                focused
                required
                style={{ margin: "20px", textDecoration: "blod" }}
                InputLabelProps={{
                  style: { fontWeight: "bold", fontSize: "16px" },
                }}
              />
              <TextField
                label="Mot de passe"
                variant="outlined"
                color="warning"
                name="password"
                type={"password"}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    password: e.target.value,
                  })
                }
                value={inputs.password}
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
                onClick={handleSubmit}
                style={{
                  fontFamily: "initial",
                  fontStyle: "-moz-initial",
                  margin: "20px",
                }}
              >
                Login
              </Button>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};
