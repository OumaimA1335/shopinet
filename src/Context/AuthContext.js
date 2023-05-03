import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendEmailVerification,
  updatePassword,
  updateEmail,
  updateProfile,
  deleteUser

} from "firebase/auth";
import { auth } from "../Config/FirebaseConfig";
import zxcvbn from 'zxcvbn';
const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);
export const AuthContextProvider = ({
  children}) => {
  const [isuser, setisUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(auth.currentUser);
      if (user) {
        setisUser(auth.currentUser.toJSON());
      
      } else {
        setisUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  function validatePassword(password) {
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
      throw new Error('Password is not strong enough');
    }
  };

  const signup = async (email, password) => {
    validatePassword(password);
    const userInfo = createUserWithEmailAndPassword(auth, email, password);
     await sendEmailVerification( (await userInfo).user);
     console.log("check your to verify your email") ;
     if((await userInfo).user.emailVerified)
     {
      console.log("verfied");
     }
     else{
      console.log("Not verfied");
     }
     
  };
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const logout = async () => {
   // setUser(null);
    localStorage.removeItem("user");
    setErrorMessage(null);
    await signOut(auth);
  };
  const GoogleAuth = new GoogleAuthProvider();
  const signinGoogle = async () => {
    const result = await signInWithPopup(auth, GoogleAuth);
  };
  const FaceBookAuth = new FacebookAuthProvider();
  const signinFaceBook = async () => {
    const result = await signInWithPopup(auth, FaceBookAuth);
  };
  const email = async (newEmail, newPassword, newPhotoURL) => {
    // Mettre à jour le mot de passe de l'utilisateur
    await updatePassword(auth.currentUser, newPassword)
      .then(async () => {
        console.log("Password updated successfully");
        // Mettre à jour l'email de l'utilisateur
        return await  updateEmail(auth.currentUser, newEmail);
      })
      .then(async() => {
        console.log("Email updated successfully");
        // Mettre à jour la photo de profil de l'utilisateur
        return await updateProfile(auth.currentUser, {
          photoURL: newPhotoURL
        });
      })
      .then(() => {
        console.log("Profile updated successfully");
        setErrorMessage("Modifcation avec succée");
      })
      .catch((error) => {
        console.log("Error updating profile:", error);
        // Gérer les erreurs séparément pour chaque mise à jour
        if (error.code === "auth/email-already-in-use") {
          console.log("Email already in use");
          setErrorMessage("Email déja utilisée: " + error.message);
        } else if (error.code === "auth/weak-password") {
          console.log("Password too weak");
          setErrorMessage("Mot de passe n'est pas assez fort: " + error.message);
        } else if (error.code === "storage/object-not-found") {
          console.log("File not found");
          setErrorMessage("Fichier n'existe pas: " + error.message);
        } else if (error.code === "auth/requires-recent-login")
        {
          console.log("Tu dois reconnecter");
          setErrorMessage("Tu dois reconnecter pour modifier vos coordonneés: " + error.message);
        }
        else {
          console.log("Unknown error:", error);
        }
      });
      return errorMessage
  };
  


const deleteuser =()=>{
  deleteUser(user).then(() => {
    console.log("User Deleted")
  }).catch((error) => {
    console.log(error)
  });
}
  return (
    <AuthContext.Provider
      value={{ isuser,errorMessage, login, signup, logout, signinGoogle, signinFaceBook,email,deleteuser  }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
