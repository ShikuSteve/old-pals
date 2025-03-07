import { Link } from "react-router-dom";
import notFound from "../assets/image.png"; // Make sure this is a transparent PNG

export const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        textAlign: "center",
        backgroundColor: "black", // Dark background for better contrast
        color: "#fff", // White text for readability
      }}
    >
      {/* Image */}
      <img
        src={notFound}
        alt="Page Not Found"
        style={{
          width: "500px",
          maxWidth: "80%",
          marginBottom: "20px",
          filter: "invert(1)",
        }}
      />

      {/* Heading */}
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
        404 - Page Not Found
      </h1>

      {/* Description */}
      <p style={{ fontSize: "18px", marginBottom: "20px", maxWidth: "600px" }}>
        Oops! The page you are looking for does not exist.
      </p>

      {/* Go Back Button */}
      <Link
        to="/"
        style={{
          textDecoration: "none",
          padding: "12px 24px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "5px",
          fontSize: "16px",
          transition: "background 0.3s",
        }}
      >
        Go back to Home
      </Link>
    </div>
  );
};
