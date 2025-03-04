import { Link } from "react-router-dom";
import { FaUser, FaComment, FaUsers, FaSignOutAlt } from "react-icons/fa"; // Import icons
import "../css/side-bar.css"; // Styling

export const SideBar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">JANE SMITH</h2>
      <ul>
        <li>
          <Link to="/search">
            <FaUsers className="icon" />
            <span>Search Friends</span>
          </Link>
        </li>

        <li>
          <Link to="/user-details">
            <FaComment className="icon" />
            <span>Chats</span>
          </Link>
        </li>
        <li>
          <Link to="/user-details">
            <FaUser className="icon" />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/">
            <FaSignOutAlt className="icon" />
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};
