import { Button, Container, Form, Card, Alert } from "react-bootstrap";
import "../css/search.css";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import { FaSadTear } from "react-icons/fa";
import { motion } from "framer-motion"; // Import animation
import { UserModal } from "../components/user-modal";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useLazyGetUsersExcludingQuery } from "../api/public";

export interface User {
  _id: string;
  fullName: string;
  school: string;
  country: string;
  age: number;
  createdAt: string;
  email: string;
  hometown: string;
  profilePhoto: string;
  interest: string;
}

export const SearchFriends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get current user from Redux to exclude them from results.
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = storedUser?.uid || "";

  // RTK Query hook for fetching users excluding the current user.
  const [triggerFetch, { isLoading: isFetching, error: fetchError }] =
    useLazyGetUsersExcludingQuery();

    const extractErrorMessage = (error: unknown): string => {
      if (error && typeof error === "object") {
        if ("data" in error && typeof error.data === "object" && error.data !== null) {
          return (error.data as { message?: string }).message || "An error occurred.";
        }
        if ("message" in error && typeof error.message === "string") {
          return error.message;
        }
      }
      return "Failed to serch friends. Please try again.";
    };

  const handleModal = (user: User) => {
    setShowModal(true);
    setSelectedUser(user);
  };

  // Trigger the API call when search is executed.
  const handleSearch = async (showLoader = false) => {
    if (!searchQuery.trim() || !currentUserId) return;
    if (showLoader) setIsLoading(true);

    try {
      // Trigger the API call using the lazy hook.
      const response = await triggerFetch(currentUserId).unwrap();
      // Assuming response shape is { users: User[] }
      let users = response.users;
      
      // Filter results by search query
      const lowerQuery = searchQuery.toLowerCase();
      const filteredResults = users.filter((friend: User) => {
        const name = friend.fullName?.toLowerCase() || "";
        const school = friend.school?.toLowerCase() || "";
        const homeTown = friend.hometown?.toLowerCase() || "";
        return (
          name.includes(lowerQuery) ||
          school.includes(lowerQuery) ||
          homeTown.includes(lowerQuery)
        );
      });
      setResults(filteredResults);
    } catch (err) {
      console.error("Error fetching users:", err);
      setErrorMessage(extractErrorMessage(err));

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
      {showModal && selectedUser && (
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
          background: "radial-gradient(circle, #070c12, #383939, #292a2b)",
          minHeight: "100vh",
          color: "white",
          padding: "30px",
        }}
      >
        <h2 className="text-center mb-4">Find Your Childhood Friends</h2>
        {/** Search Form */}
        <Form
          style={{ height: "50px", width: "100vw" }}
          className="d-flex justify-content-center mb-4"
        >
          <Form.Control
            type="text"
            placeholder="Enter name, school or location"
            className="w-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="primary" className="ms-2" onClick={() => handleSearch(true)}>
            {isLoading ? <Loader /> : "Search"}
          </Button>
        </Form>

        {isLoading || isFetching ? (
          <Loader />
        ) : (
          results.length > 0 && (
            <div
              className="d-flex flex-wrap justify-content-center mt-3"
              style={{ gap: "15px", width: "80%" }}
            >
              {results.map((friend) => (
                <Card
                  key={friend._id}
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
                    src={friend.profilePhoto}
                    style={{
                      width: "150px",
                      height: "150px",
                      alignSelf: "center",
                      borderRadius: "75px",
                      margin: "10px",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{friend.fullName}</Card.Title>
                    <Card.Text>Home Town: {friend.hometown}</Card.Text>
                    <Button variant="primary" onClick={() => handleModal(friend)}>
                      View More
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )
        )}

        {!isLoading && !isFetching && results.length === 0 && searchQuery.trim() && (
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            style={{ textAlign: "center", marginTop: "30px" }}
          >
            <FaSadTear size={60} style={{ color: "#3498db" }} />
            <p style={{ color: "lightgray", fontSize: "18px", marginTop: "10px" }}>
              😕 No results found. Try searching using other factors.
            </p>
          </motion.div>
        )}
      </Container>
      {fetchError && errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </>
  );
};
