import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { PasswordField } from "./password-field";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setUser } from "../store/slice/auth-slice";
import { login } from "../backend/services/auth-service";

type LoginFormProps = {
  onRegisterClick: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginFirebase = async () => {
    try {
      const response = await login(email, password);
      console.log(response, "response from login");

      if (!response?.user?.uid) {
        return `No user uid found`;
      }

      const idToken = await response.user.getIdToken();
      if (!response.user.displayName) {
        return;
      }
      const user = {
        refreshToken: response.user.refreshToken,
        refreshTknExpTime: Date.now() + 3600 * 1000,
        accessTknExpTime: Date.now() + 1800 * 1000,
        email: email,
        fullName: response.user.displayName,
        accessToken: idToken,
      };

      console.log(user, "user login details");

      dispatch(setUser(user));
      dispatch(setIsLoggedIn(true));

      navigate("/search");
    } catch (err) {
      console.log(err, "errorrr");
    }
  };
  // function handleLogin() {
  //   // Perform your login validation, API calls, etc. here.
  //   const dummyUser = {
  //     accessToken: "dummy-access-token",
  //     refreshToken: "dummy-refresh-token",
  //     email: "user@example.com",
  //     fullName: "John Doe",
  //     phoneNumber: "1234567890",
  //     imageUrl: "https://example.com/avatar.jpg",
  //     refreshTknExpTime: Date.now() + 3600 * 1000,
  //     accessTknExpTime: Date.now() + 1800 * 1000,
  //   };
  //   dispatch(setUser(dummyUser));
  //   dispatch(setIsLoggedIn(true));
  //   // If successful, navigate to the ProfilePage:
  //   navigate("/profile");
  // }

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
      <Button
        variant="primary"
        className="w-100 mb-3"
        onClick={handleLoginFirebase}
      >
        Login
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
