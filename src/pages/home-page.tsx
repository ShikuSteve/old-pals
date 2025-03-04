import "../css/home-page.css";
import pic from "../assets/pic.jpeg";
import pic1 from "../assets/pic1.jpeg";
import pic2 from "../assets/pic2.jpeg";
import pic3 from "../assets/pic3.jpeg";
import pic5 from "../assets/pic5.jpeg";
import pic7 from "../assets/pic7.jpeg";
import pinterest from "../assets/pinterest.png";
import email from "../assets/email.png";
import facebook from "../assets/facebook.png";
import ig from "../assets/ig.png";
import linkedin from "../assets/linkedin.png";
import phone from "../assets/phone.png";
import x from "../assets/x.png";
import { FAQ } from "./faq";

export const HomePage = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  // const navigate = useNavigation();
  return (
    <div
      style={{
        background:
          "linear-gradient(to top right, rgb(95, 95, 97), rgb(44, 46, 49))",
        // minHeight: "100vh",
        // width: "100vw", // Ensures full width
        // display: "flex",
        // flexDirection: "column",
        // maxWidth: "1280px",
      }}
    >
      {/* Header Section */}
      <header
        style={{
          background: "linear-gradient(to left,rgb(51, 49, 54), #2575fc)",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "inherit",
          width: "100%",
          top: 0,
          zIndex: 1000,
        }}
      >
        <h1 className="h3">
          <img
            src="../public/oldpal2.png"
            alt="Reconnect"
            width="150"
            height="150"
            className="rounded-circle me-2 bouncy"
          />
          OldPal
        </h1>

        <nav>
          <a
            style={{ fontSize: "30px" }}
            onClick={() => scrollToSection("contact")}
            href="#contact"
            className="text-white mx-3 text-decoration-none"
          >
            Contact
          </a>
          <a
            style={{ fontSize: "30px" }}
            onClick={() => scrollToSection("about")}
            href="#about"
            className="text-white mx-3 text-decoration-none"
          >
            About
          </a>
          <a
            style={{ fontSize: "30px" }}
            onClick={() => scrollToSection("features")}
            href="#features"
            className="text-white mx-3 text-decoration-none"
          >
            Features
          </a>
          <a
            style={{ fontSize: "30px" }}
            onClick={() => scrollToSection("faqs")}
            href="#faqs"
            className="text-white mx-3 text-decoration-none"
          >
            FAQs
          </a>
        </nav>
      </header>

      {/* Body Section */}
      <main
        id="about"
        style={{ flex: 1, width: "100%" }}
        className="d-flex flex-column align-items-center justify-content-center text-center p-4"
      >
        <h2 className="display-5 text-primary fw-bold">
          Find and Reconnect with Your Childhood Friends
        </h2>
        <p
          style={{
            color: "black",
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            padding: "10px",
            borderRadius: "8px",
            animation: "bounce 2s infinite",
          }}
        >
          Imagine the joy of rediscovering childhood friends—the ones who shared
          your laughter, dreams, and unforgettable moments. OldPal is a
          heartwarming platform designed to bring back those precious
          connections, helping elderly individuals find, reconnect, and cherish
          friendships from their past. Join our community and rediscover
          friendships from your past. Search by hometown, school, or shared
          interests.
        </p>
        <div className="mt-4">
          <button
            className="btn btn-primary btn-hover-pop me-5 p-4 "
            // onClick={() => navigate("/login")}
          >
            Sign Up
          </button>
          <button className="btn btn-success btn-hover-pop p-4">Login</button>
        </div>
      </main>

      {/* Features Page Section */}
      <section className="my-5 text-center w-100" id="features">
        <h2 className="fw-bold text-primary">Features</h2>
        <div className="row mt-4">
          <div className="col-md-4">
            <div
              style={{ backgroundColor: "#ADD8E6" }}
              className="card p-3 w-80 shadow-sm mb-4 card-hover-pop"
            >
              <h3 className="h5 text-primary">User Profiles</h3>
              <img
                src={`${pic5}`}
                width="100"
                height="90"
                alt="MapSearch"
                style={{ alignSelf: "center" }}
                className="img"
              />
              <p>
                Create and customize your profile with details about your
                childhood, schools, and favorite memories to help friends
                recognize you.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              style={{ backgroundColor: "#ADD8E6" }}
              className="card p-3 shadow-sm mb-4 card-hover-pop"
            >
              <h3 className="h5 text-primary">Friend Matching</h3>
              <img
                src={`${pic7}`}
                width="100"
                height="100"
                alt="MapSearch"
                style={{ alignSelf: "center" }}
                className="img"
              />
              <p>
                Our smart algorithm helps you find and reconnect with childhood
                friends based on shared experiences, locations, and interests.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              style={{ backgroundColor: "#ADD8E6" }}
              className="card p-3 shadow-sm mb-4 card-hover-pop"
            >
              <h3 className="h5 text-primary">Secure Messaging</h3>
              <img
                src={`${pic2}`}
                width="105"
                height="100"
                alt="MapSearch"
                style={{ alignSelf: "center" }}
                className="img"
              />
              <p>
                Chat safely with your reconnected friends through private and
                secure messaging, ensuring your conversations remain
                confidential.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              style={{ backgroundColor: "#ADD8E6" }}
              className="card p-3 shadow-sm mb-4 card-hover-pop"
            >
              <h3 className="h5 text-primary"> Interactive Map Search</h3>
              <img
                src={`${pic1}`}
                width="100"
                height="90"
                alt="MapSearch"
                style={{ alignSelf: "center" }}
                className="img"
              />
              <p>
                Find friends geographically! Browse an interactive map to locate
                people from your hometown, previous schools, or past
                communities.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              style={{ backgroundColor: "#ADD8E6" }}
              className="card p-3 shadow-sm mb-4 card-hover-pop"
            >
              <h3 className="h5 text-primary">Memory Timeline</h3>
              <img
                src={`${pic}`}
                width="100"
                height="90"
                alt="MapSearch"
                style={{ alignSelf: "center" }}
                className="img"
              />
              <p>
                Upload old pictures and create a visual timeline of your
                childhood memories, allowing others to engage and relive moments
                with you.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              style={{ backgroundColor: "#ADD8E6" }}
              className="card p-3 shadow-sm mb-4 card-hover-pop"
            >
              <h3 className="h5 text-primary">Events & Meetups</h3>
              <img
                src={`${pic3}`}
                width="100"
                height="90"
                alt="MapSearch"
                style={{ alignSelf: "center" }}
                className="img"
              />
              <p>
                Plan reunion events with long-lost friends, receive reminders,
                and organize virtual or in-person meetups with ease.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/**FAQs section */}
      <section className="my-5 faq-container text-center" id="faqs">
        <h2 className="fw-bold mb-3 text-primary">
          Frequently Asked Questions
        </h2>
        <FAQ />
      </section>

      {/* Footer Section */}
      <footer className=" text-white text-center py-3" id="contact">
        <p className="mb-0">
          &copy; 2024 Reconnecting Childhood Friends. All rights reserved.
        </p>
        <div>
          <img src={`${pinterest}`} width="40" className="m-2 footer" />
          <img src={`${email}`} width="40" className="m-2 footer" />
          <img src={`${linkedin}`} width="40" className="m-2 footer" />
          <img src={`${x}`} width="40" className="m-2 footer" />
          <img src={`${facebook}`} width="40" className="m-2 footer" />
          <img src={`${ig}`} width="40" className="m-2 footer" />
          <img src={`${phone}`} width="40" className="m-2 footer" />
        </div>
      </footer>
    </div>
  );
};
