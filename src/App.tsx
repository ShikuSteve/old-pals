import "./App.css";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/search" element={<SearchFriends />} />
        <Route path="/user-details" element={<UserDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
