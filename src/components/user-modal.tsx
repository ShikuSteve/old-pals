import { Button, Modal, Spinner } from "react-bootstrap";
import { User } from "../pages/search-friends";
import "../css/modal.css";
import { addFriend, checkIfFriend } from "../backend/services/user-service";
import { useEffect, useState } from "react";

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

  // Check if the selected user is already a friend
  useEffect(() => {
    if (user?.id) {
      checkIfFriend(user.id).then(setFriendStatus);
    }
  }, [user?.id]);

  const handleAddFriend = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        console.log("No user ID found");
        setLoading(false);
        return;
      }

      await addFriend(user.id);
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
          <Modal.Title>{user?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={user?.imageUrl}
            alt="Profile picture"
            className="profile-img"
          />
          <p>School: {user?.school}</p>
          <p>Country located in: {user?.country}</p>
          <p>Age: {user?.age}</p>
          <p>Email: {user?.email}</p>
          <p>Hobbies: {user?.Interests}</p>
          <p>Home town raised in: {user?.homeTown}</p>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant={friendStatus ? "success" : "primary"}
              disabled={friendStatus}
              onClick={friendStatus ? undefined : handleAddFriend}
            >
              {friendStatus ? "Already a Friend" : "Add Friend"}
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      {/* Loading Modal */}
      <Modal className="custom-modal" show={loading} centered backdrop="static">
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status" />
          <p>Adding {user?.name} to your friends list...</p>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal
        className="custom-modal"
        show={successModal}
        onHide={() => setSuccessModal(false)}
        centered
      >
        <Modal.Body className="text-center">
          <p>You can now go to the chats section to chat with {user?.name}!</p>
          <Button variant="success" onClick={() => setSuccessModal(false)}>
            Okay
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};
