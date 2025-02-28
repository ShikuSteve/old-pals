import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { PasswordField } from "./password-field";

type SignUpProps = {
  onLoginClick: () => void;
};

export const SignUp: React.FC<SignUpProps> = ({ onLoginClick }) => (
  <div className="d-flex flex-column justify-content-center align-items-center bg-white h-100 p-3">
     <h2 className="text-center mb-4">Register</h2>
     <InputGroup className="mb-3">
     <Form.Control type="text" placeholder="Full Name" />
     </InputGroup>
     <InputGroup className="mb-3">
     <Form.Control type="email" placeholder="Email" />
     </InputGroup>
     <InputGroup className="mb-3">
     <PasswordField placeholder="Password" />
     </InputGroup>
     <Button variant="primary" className="w-100 mb-3" >Register</Button>
     <p className="mb-0 text-center">
      Already have an account?
      <Button variant="link" onClick={onLoginClick}>
        Login
      </Button>
    </p>
     
  </div>
);

export default SignUp;
