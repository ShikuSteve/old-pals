import { Button, Container, Form, Spinner, Card } from "react-bootstrap";
import "../css/search.css";
import { useState } from "react";
import pic5 from "../assets/pic5.jpeg";

interface Friend {
  id: number;
  name: string;
  school: string;
  year: string;
  location: string;
}

export const mockData = [
  {
    id: 1,
    name: "John Doe",
    school: "Sunshine High",
    year: "2010",
    location: "New York",
  },
  {
    id: 2,
    name: "Jane Smith",
    school: "Bright Future Academy",
    year: "2008",
    location: "Los Angeles",
  },

  {
    id: 3,
    name: "Michael Johnson",
    school: "Sunshine High",
    year: "2010",
    location: "New York",
  },
  {
    id: 4,
    name: "Jane Smith",
    school: "Bright Future Academy",
    year: "2008",
    location: "Los Angeles",
  },
  {
    id: 5,
    name: "Jane Smith",
    school: "Bright Future Academy",
    year: "2008",
    location: "Los Angeles",
  },
  {
    id: 6,
    name: "Jane Smith",
    school: "Bright Future Academy",
    year: "2008",
    location: "Los Angeles",
  },
  {
    id: 7,
    name: "Jane Smith",
    school: "Bright Future Academy",
    year: "2008",
    location: "Los Angeles",
  },
];

export const SearchFriends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    const filteredResults = mockData.filter(
      (friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setTimeout(() => {
      setResults(filteredResults);
      setLoading(false);
    }, 1000);
  };
  return (
    <Container
      fluid
      className="p-0 m-0 d-flex flex-column align-items-center justify-content-center"
      style={{
        background: "radial-gradient(circle, #070c12, #383939, #292a2b)",
        width: "100vw",
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
        <Button variant="primary" className="ms-2" onClick={handleSearch}>
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            "Search"
          )}
        </Button>
      </Form>
      <div
        className="d-flex flex-wrap justify-content-center mt-3"
        style={{ gap: "15px", width: "80%" }}
      >
        {results &&
          results.map((friend) => (
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
                src={`${pic5}`}
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
                <Card.Text>Location :{friend.location}</Card.Text>
                <Button variant="primary">Connect</Button>
              </Card.Body>
            </Card>
          ))}
        {/* {results.length === 0 && <p>No results found</p>} */}
      </div>
    </Container>
  );
};
