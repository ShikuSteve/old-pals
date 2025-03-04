import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { PasswordField } from "./password-field";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setUser } from "../store/slice/auth-slice";

type LoginFormProps = {
  onRegisterClick: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const navigate = useNavigate();

  function handleLogin() {
    // Perform your login validation, API calls, etc. here.
    const dummyUser = {
      accessToken: "dummy-access-token",
      refreshToken: "dummy-refresh-token",
      email: "user@example.com",
      fullName: "John Doe",
      phoneNumber: "1234567890",
      imageUrl: "https://example.com/avatar.jpg",
      refreshTknExpTime: Date.now() + 3600 * 1000,
      accessTknExpTime: Date.now() + 1800 * 1000,
    };
    dispatch(setUser(dummyUser));
    dispatch(setIsLoggedIn(true));
    // If successful, navigate to the ProfilePage:
    navigate("/profile");
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-white h-100 p-3">
      <h2 className="text-center mb-4">Login</h2>
      <InputGroup className="mb-3">
        <Form.Control type="email" placeholder="Email" />
      </InputGroup>
      <InputGroup className="mb-3">
        <PasswordField placeholder="Password" />
      </InputGroup>
      <Button variant="primary" className="w-100 mb-3" onClick={handleLogin}>
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
