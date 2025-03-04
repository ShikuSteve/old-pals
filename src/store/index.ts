import storage from "redux-persist/lib/storage"
import { authReducer, resetAuth, User } from "./slice/auth-slice";
import { persistCombineReducers, persistStore } from "redux-persist";
import { Action, configureStore } from "@reduxjs/toolkit";

export const globalState: { user?: User } = { user: undefined };

const persistConfig = {
    key: "root",
    storage,
  };

  
  const rootReducer={
    auth:authReducer,

  }

  const persistedReducer = persistCombineReducers(persistConfig, rootReducer);

  const store=configureStore({
    reducer:persistedReducer,
    middleware:getDefaultMiddleware=>getDefaultMiddleware({serializableCheck: false, immutableCheck: false})
    .prepend((_: unknown) => (next: unknown) => (action: unknown) => clearOnLogOut(action as Action, next as Function))

  })

  function clearOnLogOut(action: Action, next: Function) {
    if (action.type === "CLEAR_APP") {
      persistor.purge().then(() => {
        globalState.user = undefined;
        next(resetAuth());
        localStorage.clear();
      });
    }
    return next(action);
  }

  export const persistor = persistStore(store);
export { store };


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type StoreType = typeof store;
