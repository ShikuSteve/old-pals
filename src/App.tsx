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
      </Routes>
    </Router>
  );
}

export default App;
