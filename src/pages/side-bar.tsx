import { Link } from "react-router-dom";
import { FaUser, FaComment, FaUsers, FaSignOutAlt } from "react-icons/fa";
import "../css/side-bar.css";
import { auth } from "../firebase";
import { BiTrash } from "react-icons/bi";
import { useState } from "react";
import { NotificationModal } from "../components/notification-bar";
import { deleteAccount, logout } from "../backend/services/auth-service";
import { useNavigate } from "react-router-dom";

export const SideBar = () => {
  const user = auth.currentUser;

  const [showNotification, setShowNotification] = useState(false);
  const [action, setAction] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    setAction("Logging out");
    setShowNotification(true);
  };

  const handleDelete = () => {
    setAction("Deleting Account");
    setShowNotification(true);
  };

  const handleConfirm = (password: string) => {
    if (action === "Logging out") {
      logout(); // Call the logout function
      console.log("logged out");
    } else {
      deleteAccount(password); // Call delete function
      console.log("User account deleted");
    }
    setShowNotification(false);
    navigate("/"); // Navigate only after confirmation
  };

  return (
    <div className="sidebar">
      {showNotification && (
        <NotificationModal
          handleConfirm={handleConfirm}
          action={action}
          name={user?.displayName}
          setShowNotification={setShowNotification}
          showNotification={showNotification}
        />
      )}
      <h2 className="logo">{user?.displayName}</h2>
      <ul>
        <li>
          <Link to="/search" className="sidebar-item">
            <FaUsers className="icon" />
            <span>Search Friends</span>
          </Link>
        </li>
        <li>
          <Link to="/chat" className="sidebar-item">
            <FaComment className="icon" />
            <span>Chats</span>
          </Link>
        </li>
        <li>
          <Link to="/user-details" className="sidebar-item">
            <FaUser className="icon" />
            <span>Profile</span>
          </Link>
        </li>
        {/* Changed <Link> to <button> to prevent unwanted navigation */}
        <li>
          <div
            style={{ marginLeft: "0px", padding: "10px" }}
            className="sidebar-item"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="icon" />
            <span>Logout</span>
          </div>
        </li>
        <li>
          <div
            style={{ marginLeft: "0px", padding: "10px" }}
            className="sidebar-item"
            onClick={handleDelete}
          >
            <BiTrash className="icon" />
            <span>Delete account</span>
          </div>
        </li>
      </ul>
    </div>
  );
};
