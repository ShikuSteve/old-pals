import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, FloatingLabel, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
// import { saveAdditionalUserInfo } from "../backend/services/user-service";
import { uploadImage } from "../utils/upload-image";
import { useUpdateProfileMutation } from "../api/public";
import { interestOptions } from "../utils/types";

interface FormData {
  fullName: string;
  homeTown: string;
  age: string;
  country: string;
  countryCode?: string;
  school: string;
  interest: string[];
  email: string;
  profilePicture: File | null;
}



interface CountrySuggestion {
  name: string;
  code: string;
}
const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    homeTown: "",
    age: "",
    country: "",
    school: "",
    interest: [],
    email: "",
    profilePicture: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInterestSuggestions, setShowInterestSuggestions] =
    useState<boolean>(false);
  const [showCountrySuggestions, setShowCountrySuggestions] =
    useState<boolean>(false);
  const [countrySuggestions, setCountrySuggestions] = useState<
    CountrySuggestion[]
  >([]);
  const [showHometownSuggestions, setShowHometownSuggestions] =
    useState<boolean>(false);
  const [hometownSuggestions, setHometownSuggestions] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [updateProfile,{isLoading,isError}]=useUpdateProfileMutation()

  // Retrieve user info from Redux store.
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (storedUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: storedUser.fullName,
        email: storedUser.email,
      }));
    }
  }, [storedUser]);

  // Fetch country suggestions from the Rest Countries API and store both name and code.
  useEffect(() => {
    const fetchCountries = async () => {
      if (formData.country.trim() === "") {
        setCountrySuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${formData.country}`
        );
        if (response.ok) {
          const data = await response.json();
          const suggestions: CountrySuggestion[] = data.map((country: any) => ({
            name: country.name.common,
            code: country.cca2, // ISO 3166-1 alpha-2 code
          }));
          setCountrySuggestions(suggestions);
        } else {
          setCountrySuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountrySuggestions([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCountries();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.country]);

  // Fetch hometown suggestions using the countryCode (if available) from GeoDB Cities API.
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ country: formData.country }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          // data.data is assumed to be an array of city names.
          setAllCities(data.data);
        } else {
          setAllCities([]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setAllCities([]);
      }
    };

    fetchCities();
  }, [formData.country]);

  useEffect(() => {
    // Reduce debounce delay to 100ms
    const debounceFn = setTimeout(() => {
      if (formData.homeTown.trim() === "") {
        setHometownSuggestions(allCities.slice(0, 5));
      } else {
        const filteredCities = allCities.filter((city) =>
          city.toLowerCase().startsWith(formData.homeTown.toLowerCase())
        );
        setHometownSuggestions(filteredCities.slice(0, 5));
      }
    }, 100);

    return () => clearTimeout(debounceFn);
  }, [formData.homeTown, allCities]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // If the user manually types in a country, clear any previously stored country code.
    if (name === "country") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        countryCode: undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // const filteredInterestOptions = interestOptions.filter((option) =>
  //   option.toLowerCase().includes(formData.interest.toLowerCase())
  // );

  const handleCountryOptionClick = (suggestion: CountrySuggestion) => {
    setFormData((prev) => ({
      ...prev,
      country: suggestion.name,
      countryCode: suggestion.code,
    }));
    setShowCountrySuggestions(false);
  };

  const handleHometownOptionClick = (option: string) => {
    setFormData((prev) => ({ ...prev, homeTown: option }));
    setShowHometownSuggestions(false);
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
  // const handleBlur = () =>
  //   setTimeout(() => setShowInterestSuggestions(false), 150);

  const handleCountryFocus = () => setShowCountrySuggestions(true);
  const handleCountryBlur = () =>
    setTimeout(() => setShowCountrySuggestions(false), 150);

  const handleHometownFocus = () => {
    setShowHometownSuggestions(true);
    // If there are cached cities and no input yet, show the first 5 immediately.
    if (allCities.length > 0 && formData.homeTown.trim() === "") {
      setHometownSuggestions(allCities.slice(0, 5));
    }
  };
  const handleHometownBlur = () =>
    setTimeout(() => setShowHometownSuggestions(false), 150);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setPreview(URL.createObjectURL(file));
    }
  };
  console.log(formData.profilePicture, "picture");

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true)

      if (!formData.profilePicture) {
        return `No picture selected`;
      }

      const uploadedImageUrl = await uploadImage(formData.profilePicture);

      if (!uploadedImageUrl) {
        console.log("Image upload failed");
        return;
      }

      const data = {
        school: formData.school,
        profilePhoto: uploadedImageUrl,
        interest: formData.interest,
        country: formData.country,
        hometown: formData.homeTown,
        age: Number(formData.age),
      };
      console.log(data);
      console.log("Form Data Submitted:", formData);
     
      if (!storedUser?.uid) {
        console.error("No stored user ID found");
        return;
      }
      const response = await updateProfile({
        userId:storedUser?.uid,
        profileData:data
      }).unwrap();
      console.log("Profile update response:", response);
      navigate("/search");
    } catch (err) {
      console.log(err, "error from updating user details");
    }finally{
      setLoading(false)
    }
  };

  if (isError) {
    return (
      <Container className="text-center mt-5">
        <h2 className="text-danger">Error loading user data.</h2>
        <p>Please try again later.</p>
      </Container>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      {/* First Row: Full Name, Country, and Home Town */}
      <Row>
        <Col md={4}>
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
        <Col md={4}>
          <FloatingLabel label="Country" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Select or type your country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              onFocus={handleCountryFocus}
              onBlur={handleCountryBlur}
            />
            {showCountrySuggestions && countrySuggestions.length > 0 && (
              <div
                className="list-group position-absolute"
                style={{ zIndex: 1000, width: "100%" }}
              >
                {countrySuggestions.map((suggestion) => (
                  <button
                    type="button"
                    className="list-group-item list-group-item-action"
                    key={suggestion.code}
                    onMouseDown={() => handleCountryOptionClick(suggestion)}
                  >
                    {suggestion.name}
                  </button>
                ))}
              </div>
            )}
          </FloatingLabel>
        </Col>
        <Col md={4}>
          <FloatingLabel label="Home Town" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Select or type your hometown"
              name="homeTown"
              value={formData.homeTown}
              onChange={handleChange}
              onFocus={handleHometownFocus}
              onBlur={handleHometownBlur}
              required
            />
            {showHometownSuggestions && hometownSuggestions.length > 0 && (
              <div
                className="list-group position-absolute"
                style={{ zIndex: 1000, width: "100%" }}
              >
                {hometownSuggestions.map((option) => (
                  <button
                    type="button"
                    className="list-group-item list-group-item-action"
                    key={option}
                    onMouseDown={() => handleHometownOptionClick(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </FloatingLabel>
        </Col>
      </Row>

      {/* Second Row: Age, School, and Interests */}
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
  <FloatingLabel label="Interest" className="mb-3">
    <Form.Control
      type="text"
      placeholder="Select Interests"
      name="interest"
      value={formData.interest.join(", ")}
      onFocus={handleFocus}
      readOnly
    />
  </FloatingLabel>
  {showInterestSuggestions && (
    <div className="dropdown-menu show">
      {interestOptions.map((option) => (
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

      <Form.Group controlId="formFile" className="mb-4">
        <Form.Label>Upload Profile Picture</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Form.Group>

      <Button
        type="submit"
        className="w-100 rounded-pill btn-primary"
        onClick={handleSubmit}
        disabled={isLoading||loading}
      >
       {isLoading||loading ? "Registering..." : "Register"} 
      </Button>
    </Form>
  );
};

export default RegistrationForm;
