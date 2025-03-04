import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { PasswordField } from "./password-field";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setUser } from "../store/slice/auth-slice";
import { signup } from "../backend/services/auth-service";
import { addUser } from "../backend/services/user-service";

type SignUpProps = {
  onLoginClick: () => void;
};

export const SignUp: React.FC<SignUpProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await signup(name, email, password);
      console.log(response, "response from signup");

      if (!response?.user?.uid) {
        return `No user uid found`;
      }
      const idToken = await response.user.getIdToken();
      if (!response.user.displayName) {
        return;
      }
      if (!response.user.email) {
        return;
      }
      const user = {
        refreshToken: response.user.refreshToken,
        uid: response.user?.uid,
        email: response.user.email,
        fullName: response.user.displayName,
        refreshTknExpTime: Date.now() + 3600 * 1000,
        accessTknExpTime: Date.now() + 1800 * 1000,
        accessToken: idToken,
      };

      console.log(user, "user login details");

      dispatch(setUser(user));
      dispatch(setIsLoggedIn(true));

      console.log(user, "user data");
      const addUserResponse = await addUser(response.user.uid, name, email);
      console.log(addUserResponse, "response from adding a user");
      console.log(name, email, password);

      navigate("/profile");
    } catch (err) {
      if (err) {
        console.log("Signup error", err);
        return;
      }
    }
  };
  // function handleRegistartion() {
  //   // Perform your login validation, API calls, etc. here.
  //   // Simulate a new user registration using dummy data.
  //   const dummyUser = {
  //     accessToken: "dummy-access-token",
  //     refreshToken: "dummy-refresh-token",
  //     email: "newuser@example.com",
  //     fullName: "Jane Doe",
  //     phoneNumber: "0987654321",
  //     imageUrl: "https://example.com/avatar2.jpg",
  //     refreshTknExpTime: Date.now() + 3600 * 1000,
  //     accessTknExpTime: Date.now() + 1800 * 1000,
  //   };

  //   // Dispatch actions to store the user data and update login status.
  //   dispatch(setUser(dummyUser));
  //   dispatch(setIsLoggedIn(true));
  //   // If successful, navigate to the ProfilePage:
  //   navigate("/profile");
  // }

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
      <Button variant="primary" className="w-100 mb-3" onClick={handleSignup}>
        Register
      </Button>
      <p className="mb-0 text-center">
        Already have an account?
        <Button variant="link" onClick={onLoginClick}>
          Login
        </Button>
      </p>
    </div>
  );
};

export default SignUp;
