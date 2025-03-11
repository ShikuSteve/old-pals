import { useDispatch } from "react-redux";
import { useDeleteUserMutation } from "../api/public";
import { resetAuth } from "../store/slice/auth-slice";

export const useDeleteAccount = () => {
  const [deleteUser] = useDeleteUserMutation();
  const dispatch = useDispatch();

  const handleDeleteAccount = async (email: string, password: string) => {
    try {
      await deleteUser({ email, password }).unwrap(); // Ensure password is sent
      dispatch(resetAuth()); // Log the user out from Redux store
      console.log("User account deleted successfully!");
    } catch (error) {
      console.error(`Error deleting user: ${error}`);
      throw error
    }
  };

  return handleDeleteAccount;
};
