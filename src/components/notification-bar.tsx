import { Button, Modal } from "react-bootstrap";
import "../css/notification.css";

interface Props {
  action: string;
  name: string | undefined | null;
  showNotification: boolean;
  setShowNotification: (x: boolean) => void;
  handleConfirm: () => void;
}

export const NotificationModal = ({
  action,
  name,
  showNotification,
  setShowNotification,
  handleConfirm,
}: Props) => {
  return (
    <Modal
      show={showNotification}
      onHide={() => setShowNotification(false)}
      centered
      className="custom-modal" // Add a class here
    >
      <Modal.Header closeButton>
        <Modal.Title>{action}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {action === "Logging out" ? (
          <p>{name}, are you sure you want to log out?</p>
        ) : (
          <p>
            {name}, your account will be deleted permanently. This action cannot
            be undone.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowNotification(false)}>
          Cancel
        </Button>
        <Button
          variant={action === "Logging out" ? "primary" : "danger"}
          onClick={handleConfirm}
        >
          {action === "Logging out" ? "Log Out" : "Delete Account"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
