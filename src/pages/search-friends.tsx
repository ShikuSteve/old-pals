import { Button, Container, Form, Card } from "react-bootstrap";
import "../css/search.css";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import { fetchUsers } from "../backend/services/user-service";
import { FaSadTear } from "react-icons/fa";
import { motion } from "framer-motion"; // Import animation
import { UserModal } from "../components/user-modal";

export interface User {
  id: string;
  name: string;
  school: string;
  country: string;
  age: number;
  createdAt: string;
  email: string;
  homeTown: string;
  imageUrl: string;
  Interests: string;
}

export const SearchFriends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();

  const handleModal = (user: User) => {
    setShowModal(true);
    setSelectedUser(user);
  };

  const handleSearch = async (showLoader = false) => {
    if (!searchQuery.trim()) return;

    if (showLoader) setIsLoading(true);
    setResults([]);

    try {
      const usersData = await fetchUsers();

      if (!Array.isArray(usersData)) {
        throw new Error("Invalid data received from fetchUsers");
      }

      const filteredResults = usersData.filter((friend) => {
        if (!friend || typeof friend !== "object") return false;

        const name = friend.name?.toLowerCase() || "";
        const school = friend.school?.toLowerCase() || "";
        const homeTown = friend.homeTown?.toLowerCase() || "";

        return (
          name.includes(searchQuery.toLowerCase()) ||
          school.includes(searchQuery.toLowerCase()) ||
          homeTown.includes(searchQuery.toLowerCase())
        );
      });

      setResults(filteredResults);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  // Debounced search effect (runs when user stops typing)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]); // Clear results if search is empty
      return;
    }

    const delay = setTimeout(() => {
      handleSearch(false); // Call search without loader
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(delay); // Cleanup timeout
  }, [searchQuery]);

  return (
    <>
      {showModal && (
        <UserModal
          setShowModal={setShowModal}
          showModal={showModal}
          user={selectedUser}
        />
      )}
      <Container
        fluid
        className="p-0 m-0 d-flex flex-column align-items-center justify-content-center"
        style={{
          alignSelf: "center",
          background: "radial-gradient(circle, #070c12, #383939, #292a2b)",
          // width: "100vw",
          minHeight: "100vh",
          color: "white",
          padding: "30px",
        }}
      >
        <h2 className="text-center mb-4 " style={{ alignSelf: "center" }}>
          Find Your Childhood Friends
        </h2>
        {/**Search Form */}
        <Form
          style={{ height: "50px", width: "100vw" }}
          className="d-flex justify-content-center  mb-4 "
        >
          <Form.Control
            type="text"
            placeholder="Enter name,school or location"
            className="w-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="primary"
            className="ms-2"
            onClick={() => handleSearch(true)}
          >
            {isLoading ? <Loader /> : "Search"}
          </Button>
        </Form>

        {isLoading ? (
          <Loader />
        ) : (
          results.length > 0 && (
            <div
              className="d-flex flex-wrap justify-content-center mt-3"
              style={{ gap: "15px", width: "80%" }}
            >
              {results.map((friend) => (
                <Card
                  style={{
                    backgroundColor: "#6C6C6C",
                    width: "230px",
                    margin: "10px",
                    borderRadius: "10px",
                  }}
                  className="hover-card"
                >
                  <Card.Img
                    variant="top"
                    src={`${friend.imageUrl}`}
                    style={{
                      width: "150px",
                      height: "150px",
                      alignSelf: "center",
                      borderRadius: "75px",
                      margin: "10px",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{friend.name}</Card.Title>
                    <Card.Text>Home Town: {friend.homeTown}</Card.Text>

                    <Button
                      variant="primary"
                      onClick={() => handleModal(friend)}
                    >
                      View More
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )
        )}
        {!isLoading && results.length === 0 && searchQuery.trim() && (
          <motion.div
            animate={{ y: [-10, 10, -10] }} // Bouncing animation
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            style={{ textAlign: "center", marginTop: "30px" }}
          >
            <FaSadTear size={60} style={{ color: "#3498db" }} />
            <p
              style={{
                color: "lightgray",
                fontSize: "18px",
                marginTop: "10px",
              }}
            >
              😕 results found..Try searching using other factors.
            </p>
          </motion.div>
        )}
      </Container>
    </>
  );
};
