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
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  const handleLogout = () => {
    setAction("Logging out");
    setShowNotification(true);
  };

  const handleDelete = () => {
    setAction("Deleting Account");
    setShowNotification(true);
  };

  const handleConfirm = async (password: string) => {
    setLoading(true); // Start loading
    console.log(password);
    try {
      if (action === "Logging out") {
        await logout();
        console.log("logged out");
      } else {
        await deleteAccount(password);
        console.log("User account deleted");
      }
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading
      setShowNotification(false);
    }
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
          loading={loading} // Pass loading state
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
        <li>
          <div
            className="sidebar-item"
            onClick={handleLogout}
            style={{ padding: "10px" }}
          >
            <FaSignOutAlt className="icon" size={21} />
            <span>Logout</span>
          </div>
        </li>
        <li>
          <div
            className="sidebar-item"
            onClick={handleDelete}
            style={{ padding: "10px" }}
          >
            <BiTrash className="icon" size={22} />
            <span>Delete account</span>
          </div>
        </li>
      </ul>
    </div>
  );
};
