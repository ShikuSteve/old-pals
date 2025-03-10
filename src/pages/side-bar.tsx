import { Link } from "react-router-dom";
import { FaUser, FaComment, FaUsers, FaSignOutAlt } from "react-icons/fa";
import "../css/side-bar.css";
import { BiTrash } from "react-icons/bi";
import { useState } from "react";
import { NotificationModal } from "../components/notification-bar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useDeleteAccount } from "../hooks/delete-user";
import { resetAuth } from "../store/slice/auth-slice";

export const SideBar = () => {
  // const user = auth.currentUser;
  const user = useSelector((state: RootState) => state.auth.user);
  const deleteAccountHandler = useDeleteAccount();

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
    setLoading(true);
  
    try {
      if (!user) return;
      if (action === "Logging out") {
        resetAuth();
        console.log("logged out");
        navigate("/");
      } else {
        await deleteAccountHandler(user.email, password);
        console.log("User account deleted");
        navigate("/");
      }
      setShowNotification(false)
    } catch (error) {
      console.error("Error:", error);
      alert("Incorrect password. Please try again."); // Show error
      return; // Stop execution
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="sidebar">
      {showNotification && (
        <NotificationModal
          handleConfirm={handleConfirm}
          action={action}
          fullName={user?.fullName}
          setShowNotification={setShowNotification}
          showNotification={showNotification}
          loading={loading} // Pass loading state
        />
      )}
      <h2 className="logo">{user?.fullName}</h2>
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
