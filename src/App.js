import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';


// firebase.initializeApp(firebaseConfig)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
function App() {
  const [user, setUser] = useState({
    isSignIn: false,
    name: "",
    email: "",
    password : "",
    photo: "",
    error : "",
    success : false
  })
  const [newUser , setNewUser] = useState(false)

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user
        const signedInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser)
        console.log(displayName, photoURL, email);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
  }
  const handelSignOut = () => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      const signOutUser = {
        isSignIn: false,
        name: "",
        email: "",
        photo: ""
      }
      setUser(signOutUser)
    }).catch((error) => {
      // An error happened.
    });
  }

  const handelBlur = (event) => {
    let isFormValid = true
    if (event.target.name === "email"){
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value)
    }
    if(event.target.name === "password"){
      isFormValid = event.target.value.length > 6
    }
    if(isFormValid){
      const newUserInfo = {...user}
      newUserInfo[event.target.name] = event.target.value
      setUser(newUserInfo)
  
    }
  }
  
  const handelSubmit = (event) => {
    console.log(user.name , user.password ,user.email)

    if(newUser && user.password && user.email){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        // Signed in 
        const newUserInfo = {...user}
        newUserInfo.error = ''
        newUserInfo.success = true
        setUser(newUserInfo)
        updateUserName(user.name)
        // ...
      })
      .catch((error) => {
        const newUserInfo = {...user}
        newUserInfo.error = error.message
        newUserInfo.success = false
        setUser(newUserInfo)
      });
    }
    if(!newUser && user.password && user.email){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        const newUserInfo = {...user}
        newUserInfo.error = ''
        newUserInfo.success = true
        setUser(newUserInfo)
      })
      .catch((error) => {
        const newUserInfo = {...user}
        newUserInfo.error = error.message
        newUserInfo.success = false
        setUser(newUserInfo)
      });
    }

    event.preventDefault()
  }

  const updateUserName = name =>{
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(function() {
      console.log("User name updated Successfully");
    }).catch(function(error) {
      console.log(error);
    });
  }
  return (
    <div className="container">
      {
        user.isSignIn ? <button onClick={handelSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignIn && <div>
          <h1 className="">Welcome {user.name}</h1>
          <p>Your Email : {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      {/* <h1>Name : {user.name}</h1>
      <h3>User Email:{user.email}</h3>
      <h3>Password : {user.password}</h3> */}
      

      <div>
        <form style = {{width: '500px'}} onSubmit = {handelSubmit}>
          <h1>Our own Authentication</h1>
          <input type="checkbox" onChange ={()=>setNewUser(!newUser)} name="newUser" id=""/>
          <label htmlFor="newUser">  New User Sign Up</label>
          <div className="mb-3">
            {
              newUser && <div>
                <label htmlFor="name">Enter Your name</label>
                <input onBlur={handelBlur} name = "name" type="text" className="form-control" id="" aria-describedby="" placeholder = "Enter your name" required></input>

              </div>
            }
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input onBlur={handelBlur}name = "email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required></input>

            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input onBlur={handelBlur} name = "password" type="password" className="form-control" id="exampleInputPassword1" required></input>

          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1"></input>

            <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
          </div>
          <input type="submit" value = {newUser ? "Sign up" : "Sign in"} name="submit" id=""></input>
        </form>
        
      </div>
      <p style = {{color:"red"}}>{user.error}</p>
      {
        user.success && <p style = {{color:"green"}}>User {newUser ? "Created" : "Logged In"} Success</p>
      }

    </div>
  );
}

export default App;
