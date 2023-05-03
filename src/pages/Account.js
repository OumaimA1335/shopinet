import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  CardHeader,
  TextField,
} from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../Config/FirebaseConfig";
import { auth } from "../Config/FirebaseConfig";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
const Account = () => {
  const { email, errorMessage } = useAuth();
  const user3 = auth.currentUser.toJSON();
  console.log(user3);
  const [imageUser, setImageUser] = useState(user3.photoURL);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [error,setError]=useState(null);
  const [values, setValues] = useState({
    email:null,
    password:null,
  });
  const [id, setId] = useState();
  async function handleImageUpload(e) {
    //let nom = user3.displayName;
    const imageRef = ref(storage, `imagesUser/${user3.email}`);
    const file = e.target.files[0];
    await uploadBytes(imageRef, file).then(() => {
      getDownloadURL(imageRef)
        .then((url) => {
          setImageUser(url);
        })
        .catch((error) => {
          console.log(error.message, "error getting the image url");
        });
    });
  }
  const handleChange = (event) => {
    console.log(event.target.value);
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  useEffect(() => {
    const fetchHandler = async () => {
      return await axios
        .get(`http://localhost:5005/Admin/GetAccountByEmail/${user3.email}`)
        .then((res) => res.data);
    };
    fetchHandler().then((data) => {
      setId(data.id);
      console.log(data);
    });
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(values);
    try {
      const err = await email(values.email, values.password, imageUser);
      if (err) {
        console.log(err);
        setError(err)
        setButtonClicked(true);
      } else {
        await axios
          .put(`http://localhost:5005/Admin/updateAccount/${id}`, {
            email: String(values.email),
            image: String(imageUser),
          })
          .then((res) => {
            res.data;
            console.log("updated in postgres");
          });
        console.log("successuflly");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">Profile</Typography>
          </div>
          <div>
            <Grid container spacing={3}>
              <Grid xs={12} md={6} lg={4}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Avatar
                        src={imageUser}
                        sx={{
                          height: 80,
                          mb: 2,
                          width: 80,
                        }}
                      />
                      <Typography
                        gutterBottom
                        variant="h7"
                        style={{
                          fontFamily: "initial",
                          fontStyle: "-moz-initial",
                        }}
                      >
                        {user3.email}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        style={{
                          fontFamily: "initial",
                          fontStyle: "-moz-initial",
                        }}
                      >
                        {user3.phoneNumber}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button
                      component="label"
                      color="warning"
                      variant="contained"
                      htmlFor="account-settings-upload-image"
                      style={{
                        marginTop: "20px",
                        marginLeft: "45px",
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
                  </CardActions>
                </Card>
              </Grid>
              <Grid xs={12} md={6} lg={8}>
                <Card>
                  <CardHeader />
                  <h4
                    style={{
                      fontFamily: "initial",
                      fontStyle: "-moz-initial",
                      marginLeft: "50px",
                    }}
                  >
                    {" "}
                    Vos coordonneés
                  </h4>
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ m: -1.5 }}>
                      <Grid container spacing={3}>
                        <Grid xs={12} md={10}>
                          <TextField
                            fullWidth
                            color="warning"
                            helperText="S'il vous plait saisir votre nouveau email"
                            label="Votre Email"
                            type="email"
                            name="email"
                            onChange={handleChange}
                            required
                            value={values.email}
                            InputLabelProps={{
                              style: { fontWeight: "bold", fontSize: "16px" },
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid xs={12} md={10}>
                          <TextField
                            fullWidth
                            color="warning"
                            helperText="S'il vous plait saisir votre nouveau mot de passe"
                            label="Votre mot de passe"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            required
                            InputLabelProps={{
                              style: { fontWeight: "bold", fontSize: "16px" },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ position: "relative" }}>
                    <Button
                      variant="contained"
                      color="warning"
                      style={{
                        fontFamily: "initial",
                        fontStyle: "-moz-initial",
                      }}
                      onClick={handleSubmit}
                    >
                      Enregistrer
                    </Button>
                    {buttonClicked && (
                      <p
                        style={{
                          fontFamily: "initial",
                          fontStyle: "-moz-initial",
                          marginLeft: "20px",
                        }}
                      >
                        {error}
                      </p>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  );
};

export default Account;
