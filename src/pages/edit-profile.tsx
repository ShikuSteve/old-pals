import {
  Button,
  Modal,
  Form,
  FloatingLabel,
  Row,
  Col,
  Spinner,
  Container,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { DocumentData } from "firebase/firestore";
import { uploadImage } from "../utils/upload-image";
import { useUpdateProfileMutation } from "../api/public";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { updateUser } from "../store/slice/auth-slice";
import { interestOptions } from "../utils/types";

interface ModalProps {
  setEditProfile: (x: boolean) => void;
  editProfile: boolean;
  user: DocumentData | null;
  setIsLoading: (x: boolean) => void;
}

export const EditProfileModal = ({
  user,
  editProfile,
  setEditProfile,
  setIsLoading,
}: ModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    school: "",
    age: "",
    email: "",
    country: "",
    hometown: "",
    interest: []as string[],
    profilePhoto: undefined,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [updateProfile,{isLoading:isUpdating,isError}]=useUpdateProfileMutation()
  const userDetails= useSelector((state: RootState) => state.auth.user);
  const dispatch=useDispatch()
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);
  

  // Update formData when user changes
  useEffect(() => {
    if (user) {
      console.log(user.profilePhoto, "profile photo from user");
      setFormData({
        fullName: user?.fullName || "",
        school: user?.school || "",
        age: user?.age ? String(user.age) : "",
        email: user?.email || "",
        country: user?.country || "",
        hometown: user?.hometown || "",
        interest: user?.interest || [],
        profilePhoto: user?.profilePhoto || undefined,
      });
      setPreview(user?.profilePhoto || undefined);
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
      fullName: "",
      school: "",
      age: "",
      email: "",
      country: "",
      hometown: "",
      interest: [],
      profilePhoto: undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loader

    try {
      let uploadedImageUrl: string | null | undefined = formData.profilePhoto;

      if (profileImage) {
        uploadedImageUrl = await uploadImage(profileImage);
        console.log(uploadedImageUrl, "image url");
        if (!uploadedImageUrl) {
          console.log("Image upload failed");
          setLoading(false); // Stop loader

          return;
        }
      }
      // const updatedData = {
      //   ...formData,
      //   age: Number(formData.age),
      //   imageUrl: uploadedImageUrl ?? undefined, // Convert null to undefined
      // };

      if (!userDetails?.uid) {
        console.error("User ID is missing");
        return; // Prevent further execution
      }
      const updatedData = {
        userId: userDetails?.uid, // Ensure userId is present
        profileData: {
          ...formData,
          age: Number(formData.age),
          profilePhoto: uploadedImageUrl ?? undefined,
        },
      };

      // await updateUserInfo(updatedData);
     const response= await updateProfile(updatedData)
     if (response.data) {
      dispatch(updateUser(response.data)); 
      console.log("Profile updated successfully!");
      handleClose();
    } else {
      console.error("Error updating profile:", response.error);
    }
      console.log("Profile updated successfully!");
      handleClose();

      setIsLoading(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    setFormData((prev) => {
      const updatedInterests = prev.interest.includes(option)
        ? prev.interest.filter((i) => i !== option) // Remove if already selected
        : [...prev.interest, option]; 
      return { ...prev, interest: updatedInterests };
    });
  };

  const handleOptionMouseDown = (option: string) => {
    handleOptionClick(option);
    // Prevent blur event from firing when clicking on an option
    setShowInterestSuggestions(false);
  };

  const handleFocus = () => setShowInterestSuggestions(true);
  

  if (isError) {
    return (
      <Container className="text-center mt-5">
        <h2 className="text-danger">Error loading user data.</h2>
        <p>Please try again later.</p>
      </Container>
    );
  }

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
                  name="fullName"
                  value={formData.fullName}
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
                  name="hometown"
                  value={formData.hometown}
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
              name="interest"
              value={formData.interest.join(", ")} 
              onFocus={handleFocus}
             readOnly

            />
          </FloatingLabel>

          {showInterestSuggestions && (
            <div className="dropdown-menu show">
              {interestOptions.map(option => (
                <div
                  key={option}
                  className="dropdown-item"
                  onClick={() => handleOptionMouseDown(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}


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
            <Button type="submit" variant="success" disabled={loading|| isUpdating}>
              {loading ||isUpdating? (
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
