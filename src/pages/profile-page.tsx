
import React from "react";
import { Container, Card } from "react-bootstrap";
import RegistrationForm from "../components/profile-form";

const backgroundStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  backgroundColor: "#f8f9fa", // removed extra quotes
};

export const ProfilePage: React.FC = () => {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 py-5"
      style={backgroundStyle}
    >
      <Card
        className="shadow-lg border-0"
        style={{
          width: "60vw",
          maxWidth: "800px",
          borderRadius: "12px",
        }}
      >
        <Card.Header className="bg-white text-center">
          <h2 className="text-primary mb-0">User Registration</h2>
          <p className="text-muted fs-6">
            Create an account to enjoy our services.
          </p>
        </Card.Header>
        <Card.Body>
          <RegistrationForm />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
