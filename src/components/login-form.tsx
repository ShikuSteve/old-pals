import React, { useState } from "react";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { PasswordField } from "./password-field";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setUser } from "../store/slice/auth-slice";
import { useSigninMutation } from "../api/public";

type LoginFormProps = {
  onRegisterClick: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser,{isLoading,isError}]=useSigninMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const extractErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object") {
      if ("data" in error && typeof error.data === "object" && error.data !== null) {
        return (error.data as { message?: string }).message || "The Email or Password is incorrect.";
      }
      if ("message" in error && typeof error.message === "string") {
        return error.message;
      }
    }
    return "Failed to login. Please try again.";
  };

  const handleLoginFirebase = async () => {
    try {
      // const response = await login(email, password);
      const response=await loginUser({
        email,
        password
      }).unwrap()
      console.log(response, "response from login");

      if (!response?.user?._id) {
        return `No user uid found`;
      }

      const idToken = await response.token;
      if (!response.user.fullName) {
        return;
      }
      const user = {
        refreshToken: response.user.refreshToken,
        uid:response.user._id,
        refreshTknExpTime: Date.now() + 3600 * 1000,
        accessTknExpTime: Date.now() + 1800 * 1000,
        email: email,
        fullName: response.user.fullName,
        accessToken: idToken,
      };
      console.log("User in Redux:", user);


      console.log(user, "user login details");

      dispatch(setUser(user));
      dispatch(setIsLoggedIn(true));

      navigate("/search");
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
      console.log(err, "errorrr");
    }
  };
 
  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-white h-100 p-3">
      <h2 className="text-center mb-4">Login</h2>
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
      {isError && errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Button
        variant="primary"
        className="w-100 mb-3"
        onClick={handleLoginFirebase}
        disabled={isLoading}
      >
       {isLoading ? "Login..." : "Login"} 
      </Button>
      <p className="mb-0 text-center">
        Don't have an account?
        <Button variant="link" onClick={onRegisterClick}>
          Register
        </Button>
      </p>
    </div>
  );
};

export default LoginForm;
