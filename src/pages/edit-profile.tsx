import {
  Button,
  Modal,
  Form,
  FloatingLabel,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { DocumentData } from "firebase/firestore";
import { updateUserInfo } from "../backend/services/user-service";
import { uploadImage } from "../utils/upload-image";

interface ModalProps {
  setEditProfile: (x: boolean) => void;
  editProfile: boolean;
  user: DocumentData | null;
  setIsLoading: (x: boolean) => void;
}
interface UserProfile {
  name: string;
  school: string;
  age: number;
  email: string;
  country: string;
  homeTown: string;
  Interests: string;
  imageUrl?: string; // Use undefined instead of null
}

export const EditProfileModal = ({
  user,
  editProfile,
  setEditProfile,
  setIsLoading,
}: ModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    age: "",
    email: "",
    country: "",
    homeTown: "",
    Interests: "",
    imageUrl: undefined,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Update formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        school: user?.school || "",
        age: user?.age ? String(user.age) : "",
        email: user?.email || "",
        country: user?.country || "",
        homeTown: user?.homeTown || "",
        Interests: user?.interests || "",
        imageUrl: user?.imageUrl || undefined,
      });
      setPreview(user?.imageUrl || undefined);
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    setEditProfile(false);
    setFormData({
      name: "",
      school: "",
      age: "",
      email: "",
      country: "",
      homeTown: "",
      Interests: "",
      imageUrl: undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loader

    try {
      let uploadedImageUrl: string | null | undefined = formData.imageUrl;

      if (profileImage) {
        uploadedImageUrl = await uploadImage(profileImage);
        console.log(uploadedImageUrl, "image url");
        if (!uploadedImageUrl) {
          console.log("Image upload failed");
          setLoading(false); // Stop loader

          return;
        }
      }
      const updatedData: UserProfile = {
        ...formData,
        age: Number(formData.age),
        imageUrl: uploadedImageUrl ?? undefined, // Convert null to undefined
      };

      await updateUserInfo(updatedData);
      console.log("Profile updated successfully!");
      handleClose();

      setIsLoading(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={editProfile} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">Edit Your Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FloatingLabel label="Full Name" className="mb-3">
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="Email" className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FloatingLabel>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FloatingLabel label="Country" className="mb-3">
                <Form.Control
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="Home Town" className="mb-3">
                <Form.Control
                  type="text"
                  name="homeTown"
                  value={formData.homeTown}
                  onChange={handleChange}
                />
              </FloatingLabel>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FloatingLabel label="Age" className="mb-3">
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="School" className="mb-3">
                <Form.Control
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                />
              </FloatingLabel>
            </Col>
          </Row>

          <FloatingLabel label="Interests" className="mb-3">
            <Form.Control
              type="text"
              name="interests"
              value={formData.Interests}
              onChange={handleChange}
            />
          </FloatingLabel>

          {preview && (
            <div className="text-center mb-3">
              <img
                src={preview}
                alt="Profile Preview"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
          )}

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Profile Picture</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
