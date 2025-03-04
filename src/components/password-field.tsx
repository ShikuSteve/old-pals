import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaEyeSlash, FaEye } from "react-icons/fa";

interface PasswordFieldProps {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // ✅ Correct type
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  placeholder,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputGroup>
      <Form.Control
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        onChange={onChange}
      />
      <Button onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </Button>
    </InputGroup>
  );
};
