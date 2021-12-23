import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  getAuth,
} from "firebase/auth";
import "./Auth.css";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState();
  const auth = getAuth();

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = async(event) => {
    const {target: { name },} = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(auth, provider);
  };

  return (
    <div className="authContainer">
      <h2 className="authTitle">Swingger</h2>
      <h6 className="authSubTitle">More Think, Less Write</h6>
      <form onSubmit={onSubmit} className="loginContainer">
        <div className="loginBlank">
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        </div>
        <input
          type="submit"
          className="loginButton"
          value={newAccount ? "Create Account" : "Sign In"}
        />
      </form>
      {error}
      <span onClick={toggleAccount} className="loginSwitching">
        {newAccount ? "Sign in" : "Create Account"}
      </span>
      <div className="otherLoginContainer">
        <button onClick={onSocialClick} name="google" className="otherButton">
          Continue with Google <i class="fab fa-google"></i>
        </button>
        <button onClick={onSocialClick} name="github" className="otherButton">
          Continue with Github <i class="fab fa-github"></i>
        </button>
      </div>
    </div>
  );
};

export default Auth;
