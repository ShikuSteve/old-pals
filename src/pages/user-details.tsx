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
// import { fetchFriends } from "../backend/services/user-service";
// import { DocumentData } from "firebase/firestore";
import Loader from "../components/loader";
import "../css/modal.css";
import { User } from "./search-friends";
import { BookFill, EnvelopeFill, PersonFill } from "react-bootstrap-icons";
import { useLazyGetFriendsQuery, useLazyGetUserByIdQuery } from "../api/public";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export const UserDetails = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<User[]>([]);
  const [getUserById,{isLoading:isFetching,isError:isUserError}]=useLazyGetUserByIdQuery()
  const [fetchFriends,{isLoading:isFetchingUser,isError:isFriendsError}]=useLazyGetFriendsQuery()
  

  const user= useSelector((state: RootState) => state.auth.user);
  console.log(user,"user")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   const getUserFn = async () => {
  //     if (!user || !user.uid) {
  //       console.log("no user")
  //       return
  //     };
  //     setIsLoading(true); // Start loading when fetching user

  //     try {
  //       console.log("Triggering API call...");
  //       const userDetails = await getUserById(user.uid);
  //       console.log(userDetails,"user Details")
  //       setUserInfo(userDetails);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     } finally {
  //       setIsLoading(false); // Stop loader after fetching
  //     }
  //   };

  //   getUserFn();
  // }, [user, editProfile]); // Add `editProfile` dependency to refetch after closing the modal

  useEffect(() => {
    const getUserFn = async () => {
        if (!user || !user.uid) {
            console.log("No user found");
            return;
        }

        setIsLoading(true); // Start loading when fetching user

        try {
            console.log("Triggering API call...");
            
            const { data, error } = await getUserById(user.uid); // Correct way to trigger
            if (error) {
                console.error("Error fetching user:", error);
            } else {
                console.log("User details:", data);
                setUserInfo(data); // Store data correctly
            }
        } catch (error) {
            console.error("Unexpected error fetching user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    getUserFn();
}, [user, editProfile]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (!user || !user.uid) {
      console.log("No user found");
      return;
  }
    const loadFriends = async () => {
      try {
        console.log("Fetching friends...");
        const { data, error } = await fetchFriends(user.uid); // Pass userId correctly

        if (error) {
          console.error("Error fetching friends:", error);
        } else {
          console.log("Friends data:", data);
          setFriends(Array.isArray(data?.friends) ? data.friends : [])
        }
      } catch (error) {
        console.error("Unexpected error fetching friends:", error);
      }
    };

    loadFriends();
  }, []);
  

  if (isLoading||isFetching||isFetchingUser) {
    return <Loader />;
  }

  if (isUserError || isFriendsError) {
    return (
      <Container className="text-center mt-5">
        <h2 className="text-danger">Error loading user data.</h2>
        <p>Please try again later.</p>
      </Container>
    );
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
              src={userInfo?.profilePhoto}
              alt="Profile"
              className="rounded-circle img-fluid"
            />
          </Col>
          <Col md={6}>
            <h2>{userInfo?.fullName}</h2>
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
              Country: {userInfo?.country},{userInfo?.hometown}
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
    {Array.isArray(userInfo?.interest) ? (
      userInfo?.interest.length > 0 ? (
        userInfo.interest.map((hobby, index) => (
          <p key={index}>{hobby}</p>
        ))
      ) : (
        <p className="text-muted">No hobbies listed</p>
      )
    ) : (
      <p>{userInfo?.interest || "No hobbies listed"}</p>
    )}
  </Card>
</Col>

      </Row>
      {/* Recent Activity */}
      <Card
        style={{ backgroundColor: "#AFDBF5", alignItems: "center" }}
        className="mt-4 p-3 shadow-sm"
      >
        <div className="container mt-4">
          <h2 className="mb-3 text-center"> {user?.fullName}'s friends</h2>
          {friends.length === 0 ? (
            <p className="text-muted text-center">
              You have not added any friends yet
            </p>
          ) : (
            <div className="row">
              {friends.map((friend) => (
                <div key={friend._id} className="col-md-4 mb-4">
                  {/* Bootstrap Grid System */}
                  <Card
                    className="p-3 shadow-sm profile-img"
                    style={{
                      backgroundColor: "#AFDBF5",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={friend?.profilePhoto}
                      width="100px"
                      height="100px"
                      style={{ borderRadius: "100px", alignSelf: "center" }}
                    />
                    <h5 className="mb-2">
                      <PersonFill className="me-2" color="blue" />
                      {friend.fullName}
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
          user={userInfo}
          editProfile={editProfile}
          setEditProfile={setEditProfile}
          setIsLoading={setIsLoading}
        />
      )}
    </Container>
  );
};
