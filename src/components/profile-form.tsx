import React from "react";
import { Form, InputGroup } from "react-bootstrap";

interface ProfileDetailsProps {
    formData: {
        fullName: string;
        homeTown: string;
        age: string;
        school: string;
        interests: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ formData, handleChange }) => {
    return (
        <Form.Group>
            {/* Full Name & Home Town */}
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="rounded-pill"
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Home Town"
                    name="homeTown"
                    value={formData.homeTown}
                    onChange={handleChange}
                    required
                    className="rounded-pill"
                />
            </InputGroup>

            {/* Age, School & Interests */}
            <InputGroup className="mb-3">
                <Form.Control
                    type="number"
                    placeholder="Age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="rounded-pill"
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="School"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="rounded-pill"
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="rounded-pill"
                />
            </InputGroup>
        </Form.Group>
    );
};
