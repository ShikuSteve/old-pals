import React, { useEffect, useState } from "react";
import reconnect from "../assets/reconnect.jpg";
import OverlayPanel from "../components/overlay-panel";
import LoginForm from "../components/login-form";
import SignUp from "../components/signup-form";
import Loader from "../components/loader";

// Global background style.
const backgroundStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${reconnect})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundAttachment: "fixed",
  backgroundSize: "cover",
  position: "relative",
};

const containerStyle: React.CSSProperties = {
  width: "750px",
  height: "500px",
  padding: "20px",
};

// Base style for sliding panels.
const panelBaseStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  width: "50%",
  height: "100%",
  transition: "transform 0.5s ease-in-out",
};

export const Login: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const panelLeftStyle: React.CSSProperties = {
    ...panelBaseStyle,
    left: 0,
    transform: isActive ? "translateX(100%)" : "translateX(0)",
  };

  const panelRightStyle: React.CSSProperties = {
    ...panelBaseStyle,
    left: "50%",
    transform: isActive ? "translateX(-100%)" : "translateX(0)",
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      style={backgroundStyle}
      className="d-flex justify-content-center align-items-center"
    >
      <div
        className="position-relative overflow-hidden bg-white shadow-lg rounded-3"
        style={containerStyle}
      >
        <div style={panelLeftStyle}>
          {isActive ? (
            <OverlayPanel
              title="Hello, Friend!"
              description="If you already have an account login here and continue with your rekindling journey, "
              buttonText="Login"
              onButtonClick={() => setIsActive(false)}
            />
          ) : (
            <LoginForm onRegisterClick={() => setIsActive(true)} />
          )}
        </div>
        <div style={panelRightStyle}>
          {isActive ? (
            <SignUp onLoginClick={() => setIsActive(false)} />
          ) : (
            <OverlayPanel
              title="Start Your Journey Now!"
              description="If you don't have an account yet, join us today and start rekindling your journey."
              buttonText="Register"
              onButtonClick={() => setIsActive(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
