import React from "react";

export interface OverlayPanelProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

const OverlayPanel: React.FC<OverlayPanelProps> = ({ title, description, buttonText, onButtonClick }) => (
  <div className="d-flex flex-column justify-content-center align-items-center bg-primary text-white h-100 p-3">
    <h2 className="text-center">{title}</h2>
    <p>{description}</p>
    <button className="btn btn-light" onClick={onButtonClick}>
      {buttonText}
    </button>
  </div>
);

export default OverlayPanel;
