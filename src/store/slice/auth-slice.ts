import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { RootState } from "..";

export const CODE_VERIFIER_KEY = "codeVerifier";

export interface User {
  uid: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
  age?: string;
  country?: string;
  countryCode?: string;
  school?: string;
  interest?: string;
  homeTown?:string;
  phoneNumber?: string;
  imageUrl?: string;
  refreshTknExpTime: number;
  accessTknExpTime: number;
  profilePicture?: File | null;
}

interface AuthState {
  user?: User;
  isLoggedIn: boolean;
}
const initialState: AuthState = { isLoggedIn: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
      // clear code verifier if user is logged in.
      if (action.payload) localStorage.removeItem(CODE_VERIFIER_KEY);
    },
    resetAuth(state) {
      state.isLoggedIn = false;
      state.user = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

const selectAuth = (state: RootState) => state.auth;

export const getUser = () => createSelector([selectAuth], (auth) => auth.user);

export const { setUser, setIsLoggedIn, resetAuth,updateUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
