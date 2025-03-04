import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaEyeSlash,FaEye } from "react-icons/fa";

interface PasswordFieldProps {
    placeholder: string;
  }
  
  
  export const PasswordField: React.FC<PasswordFieldProps> = ({ placeholder }) => {
  const [showPassword,setShowPassword]=  useState(false)
return(
    <InputGroup>
    <Form.Control type={showPassword?"text":"password"} placeholder={placeholder}/>
    <Button
    onClick={()=>setShowPassword(!showPassword)}
    >
        {showPassword?<FaEyeSlash/>:<FaEye/>}
    </Button>
    </InputGroup>
    
)
  };
  