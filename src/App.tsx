import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { ErrorPage, HomePage, Login, NotFound, ProfilePage } from "./pages";
import { SearchFriends } from "./pages/search-friends";
import { UserDetails } from "./pages/user-details";
import { SideBar } from "./pages/side-bar";
import MessagingPage from "./components/message";
import { ProtectedRoute } from "./Protection";
import "normalize.css";

const Layout = () => {
  const location = useLocation();

  // Routes where the sidebar should be hidden
  const hideSidebarRoutes = ["/", "/login", "/profile", "/not-found"];

  // Check if the current route is not found
  const isNotFound =
    location.pathname !== "/" &&
    !["/login", "/profile", "/search", "/user-details", "/chat"].includes(
      location.pathname
    ) &&
    !hideSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      {/* Hide sidebar if on a hideSidebarRoute or Not Found */}
      {!hideSidebarRoutes.includes(location.pathname) && !isNotFound && (
        <div style={{ width: "250px", flexShrink: 0 }}>
          <SideBar />
        </div>
      )}
      <div style={{ flex: 1, overflowX: "hidden" }}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/search" element={<SearchFriends />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/chat" element={<MessagingPage />} />
          </Route>
          {/* Catch-all route for Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
