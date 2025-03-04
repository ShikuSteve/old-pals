import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {
  ErrorPage,
  HomePage,
  Login,
  NotFound,
  ProfilePage,
  SignIn,
} from "./pages";
import { SearchFriends } from "./pages/search-friends";
import { UserDetails } from "./pages/user-details";
import { useLocation } from "react-router-dom";
import { SideBar } from "./pages/side-bar";

const Layout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/login", "/profile"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      {!hideSidebarRoutes.includes(location.pathname) && (
        <div style={{ width: "250px", flexShrink: 0 }}>
          <SideBar />
        </div>
      )}
      <div style={{ flex: 1, overflowX: "hidden" }}>
        <Routes>
          {/* <Route path="/" element={<Layouts />} /> */}
          <Route index element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/search" element={<SearchFriends />} />
          <Route path="/user-details" element={<UserDetails />} />
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
