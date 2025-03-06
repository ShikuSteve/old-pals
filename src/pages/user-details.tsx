import { Button, Card, Col, Container, Row } from "react-bootstrap";
import {
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPaintBrush,
  FaPencilAlt,
} from "react-icons/fa";
import pinterest from "../assets/pinterest.png";
import email from "../assets/email.png";
import facebook from "../assets/facebook.png";
import ig from "../assets/ig.png";
import linkedin from "../assets/linkedin.png";
import phone from "../assets/phone.png";
import x from "../assets/x.png";
import { useEffect, useRef, useState } from "react";
import { EditProfileModal } from "./edit-profile";
import { auth } from "../firebase";
import { fetchFriends, getUser } from "../backend/services/user-service";
import { DocumentData } from "firebase/firestore";
import Loader from "../components/loader";
import "../css/modal.css";
import { User } from "./search-friends";
import { BookFill, EnvelopeFill, PersonFill } from "react-bootstrap-icons";

export const UserDetails = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<DocumentData | null>({});
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<User[]>([]);

  const user = auth.currentUser;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getUserFn = async () => {
      if (!user || !user.uid) return;

      try {
        const userDetails = await getUser(user.uid);
        setUserInfo(userDetails);
        console.log(
          JSON.stringify(userDetails, null, 2),
          "Fetched user details"
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserFn();
  }, [user]); // Runs only when `user` changes

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const loadFriends = async () => {
      const friendsData = await fetchFriends();
      setFriends(friendsData);
    };

    loadFriends();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const showEditModal = () => {
    setEditProfile(!editProfile);
    console.log("pressed");
  };

  return (
    <Container
      fluid
      className="m-0 d-flex flex-column scrollable-container "
      style={{
        backgroundColor: "#76abdf",
        flex: 1,
        minHeight: "100vh",
        padding: "30px",
        overflow: "auto",
        scrollBehavior: "smooth",
      }}
    >
      {/* Profile Header */}
      <Card
        className="p-4 text-center shadow-sm "
        style={{ backgroundColor: "#AFDBF5" }}
      >
        <Row className="align-items-center">
          <Col md={3} className="text-center">
            <img
              src={userInfo?.imageUrl}
              alt="Profile"
              className="rounded-circle img-fluid"
            />
          </Col>
          <Col md={6}>
            <h2>{userInfo?.name}</h2>
            <p className="text-muted">{userInfo?.email}</p>
            <p>"Passionate about building impactful solutions."</p>
          </Col>
          <Col md={3} className="text-center">
            <Button
              variant="primary"
              className="me-2"
              onClick={() => showEditModal()}
            >
              <FaPencilAlt size={20} style={{ margin: "5px" }} color="black" />
              Edit Profile
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Stats Section */}
      <Row className="mt-4 text-center">
        <Col md={4}>
          <Card
            className="p-3 mb-4 shadow-sm hover-card"
            style={{ backgroundColor: "#AFDBF5" }}
          >
            <h4>
              <FaGraduationCap size={40} color=" #60a5fa" />
              ABOUT
            </h4>
            <p>School attended: {userInfo?.school}</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            style={{ backgroundColor: "#AFDBF5" }}
            className="p-3 mb-4 shadow-sm hover-card"
          >
            <h4>
              <FaMapMarkerAlt size={40} color=" #60a5fa" />
              LOCATION
            </h4>
            <p>
              Country: {userInfo?.country},{userInfo?.homeTown}
            </p>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            style={{ backgroundColor: "#AFDBF5" }}
            className="p-3 mb-4 shadow-sm hover-card"
          >
            <h4>
              <FaPaintBrush size={40} color=" #60a5fa" />
              Hobbies
            </h4>
            <p>{userInfo?.Interests} </p>
            {/* <p>Crochet</p>
            <p>Hockey</p> */}
          </Card>
        </Col>
      </Row>
      {/* Recent Activity */}
      <Card
        style={{ backgroundColor: "#AFDBF5", alignItems: "center" }}
        className="mt-4 p-3 shadow-sm"
      >
        <div className="container mt-4">
          <h2 className="mb-3 text-center"> {user?.displayName}'s friends</h2>
          {friends.length === 0 ? (
            <p className="text-muted text-center">
              You have not added any friends yet
            </p>
          ) : (
            <div className="row">
              {friends.map((friend) => (
                <div key={friend.id} className="col-md-4 mb-4">
                  {/* Bootstrap Grid System */}
                  <Card
                    className="p-3 shadow-sm profile-img"
                    style={{
                      backgroundColor: "#AFDBF5",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={friend?.imageUrl}
                      width="100px"
                      height="100px"
                      style={{ borderRadius: "100px", alignSelf: "center" }}
                    />
                    <h5 className="mb-2">
                      <PersonFill className="me-2" color="blue" />
                      {friend.name}
                    </h5>
                    <p className="text-muted" style={{ fontSize: "13px" }}>
                      <EnvelopeFill className="me-2" color="blue" />
                      {friend.email}
                    </p>
                    <p>
                      <BookFill className="me-2" color="blue" />
                      Went to {friend.school} school
                    </p>
                    <ul className="list-unstyled mt-2"></ul>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ margin: "10px", marginTop: "20px" }}>
          <img src={`${pinterest}`} width="30" className="m-2 footer" />
          <img src={`${email}`} width="30" className="m-2 footer" />
          <img src={`${linkedin}`} width="30" className="m-2 footer" />
          <img src={`${x}`} width="30" className="m-2 footer" />
          <img src={`${facebook}`} width="30" className="m-2 footer" />
          <img src={`${ig}`} width="30" className="m-2 footer" />
          <img src={`${phone}`} width="30" className="m-2 footer" />
        </div>
      </Card>
      {editProfile && (
        <EditProfileModal
          editProfile={editProfile}
          setEditProfile={setEditProfile}
        />
      )}
    </Container>
  );
};
