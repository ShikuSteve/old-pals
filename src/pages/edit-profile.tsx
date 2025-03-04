import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";

interface modal {
  setEditProfile: (x: boolean) => void;
  editProfile: boolean;
}
export const EditProfileModal = ({ editProfile, setEditProfile }: modal) => {
  const [name, setName] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [age, setAge] = useState<number>();
  const [quote, setQuote] = useState<string>();

  const handleClose = () => {
    setEditProfile(false);
  };
  const handleSubmit = () => {
    const data = {
      name: name,
      occupation: occupation,
      age: age,
      quote: quote,
    };
    console.log(data, "input data");

    setName("");
    setOccupation("");
    setAge(0);
    setQuote("");

    handleClose();
  };
  return (
    <Modal show={editProfile} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          Edit your profile details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            onChange={(e) => setName(e.currentTarget.value)}
            required
          />
          <Form.Label> Occupation</Form.Label>
          <Form.Control
            type="text"
            name="occupation"
            placeholder="Enter your occupation"
            onChange={(e) => setOccupation(e.currentTarget.value)}
            required
          />
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            name="age"
            placeholder="Enter your age"
            onChange={(e) => setAge(Number(e.currentTarget.value))}
            required
          />
          <Form.Label>Quote</Form.Label>
          <Form.Control
            type="text"
            name="quote"
            placeholder="Enter an inspiring quote"
            onChange={(e) => setQuote(e.currentTarget.value)}
            required
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
