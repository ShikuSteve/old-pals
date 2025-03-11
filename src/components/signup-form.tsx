import React, { useState } from "react";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { PasswordField } from "./password-field";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setUser } from "../store/slice/auth-slice";

import { useSignupMutation } from "../api/public";

type SignUpProps = {
  onLoginClick: () => void;
};

export const SignUp: React.FC<SignUpProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupMutation, { isLoading, isError }] = useSignupMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const extractErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object") {
      if ("data" in error && typeof error.data === "object" && error.data !== null) {
        return (error.data as { message?: string }).message || "An error occurred.";
      }
      if ("message" in error && typeof error.message === "string") {
        return error.message;
      }
    }
    return "Failed to create account. Please try again.";
  };
 

  const handleSignup = async () => {
    try {
      const response = await signupMutation({
        fullName: name,
        email,
        password,
      }).unwrap();
  
      if (!response?.user?._id) {
        console.error("No user uid found");
        
        return;
      }
  
      // Since response.user is a plain object, it doesn't have getIdToken().
      // Instead, use the token returned in the response.
      const idToken = response.token; 
  
      // Ensure necessary user fields exist before dispatching
      if (!response.user.fullName || !response.user.email) {
        return;
      }
  
      const user = {
        refreshToken: response.user.refreshToken,
        uid: response.user._id,
        token: idToken,
        email: response.user.email,
        fullName: response.user.fullName,
        refreshTknExpTime: Date.now() + 3600 * 1000,
        accessTknExpTime: Date.now() + 1800 * 1000,
        accessToken: idToken,
      };
  
      console.log(user, "user login details");
  
      dispatch(setUser(user));
      dispatch(setIsLoggedIn(true));
  
      
     
  
      navigate("/profile");
    } catch (err) {
      console.log("Signup error", err);
      setErrorMessage(extractErrorMessage(err));
    }
  };
  

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-white h-100 p-3">
      <h2 className="text-center mb-4">Register</h2>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <Form.Control
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <PasswordField
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </InputGroup>
      <Button variant="primary" className="w-100 mb-3" onClick={handleSignup} disabled={isLoading}>
      {isLoading ? "Registering..." : "Register"} 
      </Button>
      <p className="mb-0 text-center">
        Already have an account?
        <Button variant="link" onClick={onLoginClick}>
          Login
        </Button>
        
      </p>
      
      {isError && errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </div>
    
  );
};

export default SignUp;
