
import React, { useState } from "react";
import { Form, Button, Container, Card, Row, Col, FloatingLabel } from "react-bootstrap";

const backgroundStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  backgroundColor: `"#f8f9fa"`,
};

export const ProfilePage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    homeTown: "",
    age: "",
    school: "",
    interests: "",
    email: "",
    password: "",
    profilePicture: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 py-5"
      style={backgroundStyle}
    >
      <Card className="shadow-lg border-0" style={{ width: "60vw", maxWidth: "800px", borderRadius: "12px" }}>
        <Card.Header className="bg-white text-center">
          <h2 className="text-primary mb-0">User Registration</h2>
          <p className="text-muted fs-6">Create an account to enjoy our services.</p>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FloatingLabel label="Full Name" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel label="Home Town" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Home Town"
                    name="homeTown"
                    value={formData.homeTown}
                    onChange={handleChange}
                    required
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <FloatingLabel label="Age" className="mb-3">
                  <Form.Control
                    type="number"
                    placeholder="Age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </FloatingLabel>
              </Col>
              <Col md={4}>
                <FloatingLabel label="School" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="School"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>
              <Col md={4}>
                <FloatingLabel label="Interests" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <FloatingLabel label="Email" className="mb-3">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FloatingLabel>

            <FloatingLabel label="Password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FloatingLabel>

            {preview && (
              <div className="text-center mb-3">
                <img
                  src={preview}
                  alt="Profile Preview"
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%" }}
                />
              </div>
            )}

            <Form.Group controlId="formFile" className="mb-4">
              <Form.Label>Upload Profile Picture</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>

            <Button type="submit" className="w-100 rounded-pill btn-primary">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};


// import React, { useState } from "react";
// import { Form, Button, Card, Row, Col, FloatingLabel } from "react-bootstrap";

// const centeredContainerStyle: React.CSSProperties = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   width: "100vw",
//   height: "100vh",
//   background: "#f8f9fa",
// };

// export const ProfilePage: React.FC = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     homeTown: "",
//     age: "",
//     school: "",
//     interests: "",
//     email: "",
//     password: "",
//     profilePicture: null as File | null,
//   });

//   const [preview, setPreview] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setFormData((prev) => ({ ...prev, profilePicture: file }));
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form Data Submitted:", formData);
//   };

//   return (
//     <div style={centeredContainerStyle}>
//       <Card style={{ width: "60vw", maxWidth: "800px", borderRadius: "12px", boxShadow: "0 0 15px rgba(0,0,0,0.3)" }}>
//         <Card.Header style={{ backgroundColor: "#fff", textAlign: "center" }}>
//           <h2 style={{ color: "#007bff", marginBottom: 0 }}>User Registration</h2>
//           <p style={{ color: "#6c757d", fontSize: "0.875rem" }}>Create an account to enjoy our services.</p>
//         </Card.Header>
//         <Card.Body>
//           <Form onSubmit={handleSubmit}>
//             <Row>
//               <Col md={6}>
//                 <FloatingLabel label="Full Name" style={{ marginBottom: "1rem" }}>
//                   <Form.Control
//                     type="text"
//                     placeholder="Full Name"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleChange}
//                     required
//                   />
//                 </FloatingLabel>
//               </Col>
//               <Col md={6}>
//                 <FloatingLabel label="Home Town" style={{ marginBottom: "1rem" }}>
//                   <Form.Control
//                     type="text"
//                     placeholder="Home Town"
//                     name="homeTown"
//                     value={formData.homeTown}
//                     onChange={handleChange}
//                     required
//                   />
//                 </FloatingLabel>
//               </Col>
//             </Row>
//             <Row>
//               <Col md={4}>
//                 <FloatingLabel label="Age" style={{ marginBottom: "1rem" }}>
//                   <Form.Control
//                     type="number"
//                     placeholder="Age"
//                     name="age"
//                     value={formData.age}
//                     onChange={handleChange}
//                     required
//                   />
//                 </FloatingLabel>
//               </Col>
//               <Col md={4}>
//                 <FloatingLabel label="School" style={{ marginBottom: "1rem" }}>
//                   <Form.Control
//                     type="text"
//                     placeholder="School"
//                     name="school"
//                     value={formData.school}
//                     onChange={handleChange}
//                   />
//                 </FloatingLabel>
//               </Col>
//               <Col md={4}>
//                 <FloatingLabel label="Interests" style={{ marginBottom: "1rem" }}>
//                   <Form.Control
//                     type="text"
//                     placeholder="Interests"
//                     name="interests"
//                     value={formData.interests}
//                     onChange={handleChange}
//                   />
//                 </FloatingLabel>
//               </Col>
//             </Row>
//             <FloatingLabel label="Email" style={{ marginBottom: "1rem" }}>
//               <Form.Control
//                 type="email"
//                 placeholder="name@example.com"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </FloatingLabel>
//             <FloatingLabel label="Password" style={{ marginBottom: "1rem" }}>
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </FloatingLabel>
//             {preview && (
//               <div style={{ textAlign: "center", marginBottom: "1rem" }}>
//                 <img
//                   src={preview}
//                   alt="Profile Preview"
//                   style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%" }}
//                 />
//               </div>
//             )}
//             <Form.Group controlId="formFile" style={{ marginBottom: "1rem" }}>
//               <Form.Label>Upload Profile Picture</Form.Label>
//               <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
//             </Form.Group>
//             <Button type="submit" style={{ width: "100%", borderRadius: "50px", backgroundColor: "#007bff" }}>
//               Register
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default ProfilePage;


