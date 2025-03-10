import { Button, Modal, Spinner } from "react-bootstrap";
import { User } from "../pages/search-friends";
import "../css/modal.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useAddFriendMutation, useLazyCheckFriendStatusQuery } from "../api/public";

interface Props {
  showModal: boolean;
  setShowModal: (x: boolean) => void;
  user: User | undefined;
}

export const UserModal = (data: Props) => {
  const { showModal, setShowModal, user } = data;
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [friendStatus, setFriendStatus] = useState(false); // Single friend check
  const [addFriend, { isLoading }] = useAddFriendMutation();
  const [checkFriendStatusTrigger, {isFetching }] = useLazyCheckFriendStatusQuery();
  const storedUser= useSelector((state: RootState) => state.auth.user);
  console.log(user,"user")

  // Check if the selected user is already a friend
  // useEffect(() => {
  //   if (user?._id) {
  //     checkIfFriend(user._id).then(setFriendStatus);
  //   }
  // }, [user?._id]);

  useEffect(() => {
    if (user?._id && storedUser?.uid) {
      checkFriendStatusTrigger({ userId: storedUser?.uid, friendId: user._id })
        .unwrap()
        .then((data) => {
          console.log("Friend status response:", data);
          setFriendStatus(data?.isFriend || false); // Assuming API returns { isFriend: true/false }
        })
        .catch((error) => console.error("Error checking friend status:", error));
    }
  }, [user?._id, storedUser?.uid]);
  

  const handleAddFriend = async () => {
    try {
      setLoading(true);

      if (!user?._id||!storedUser?.uid) {
        console.log("No user ID found");
        setLoading(false);
        return;
      }

      await addFriend({userId:storedUser?.uid,friendId:user._id}).unwrap();
      setFriendStatus(true); // Mark as friend
      setSuccessModal(true);
    } catch (err) {
      console.error("Error adding friend:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{user?.fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={user?.profilePhoto}
            alt="Profile picture"
            className="profile-img"
          />
          <p>School: {user?.school}</p>
          <p>Country located in: {user?.country}</p>
          <p>Age: {user?.age}</p>
          <p>Email: {user?.email}</p>
          <p>Hobbies: {user?.interest}</p>
          <p>Home town raised in: {user?.hometown}</p>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant={friendStatus ? "success" : "primary"}
              disabled={friendStatus||isLoading||isFetching}
              onClick={friendStatus ? undefined : handleAddFriend}
            >
             {isLoading ? "Adding Friend..." : friendStatus ? "Already a Friend" : "Add Friend"}

            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      {/* Loading Modal */}
      <Modal show={loading} centered backdrop="static">
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status" />
          <p>Adding {user?.fullName} to your friends list...</p>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal show={successModal} onHide={() => setSuccessModal(false)} centered>
        <Modal.Body className="text-center">
          <p>You can now go to the chats section to chat with {user?.fullName}!</p>
          <Button variant="success" onClick={() => setSuccessModal(false)}>
            Okay
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};
