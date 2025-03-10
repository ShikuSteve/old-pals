import { useSelector } from "react-redux";
import { auth } from "./firebase";
import { RootState } from "./store";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export const ProtectedRoute = () => {
  //   const currentUser = auth.currentUser;
  const storedToken = useSelector(
    (state: RootState) => state.auth.user?.accessToken
  );
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchToken = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken(); // Await token retrieval
        setFirebaseToken(token);
      }
      setLoading(false);
    };

    fetchToken();
  }, []);

  if (loading) return <div>Loading...</div>; // Prevent UI flicker while fetching token

  return storedToken === firebaseToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};
