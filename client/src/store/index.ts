import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/auth";
import authAPI from "./services/authAPI";
import aiAPI from "./services/aiAPI";
import storeAPI from "./services/storeAPI";
import aiStudioAPI from "./services/aiStudioAPI";

const rootReducer = combineReducers({
  authReducer,
  [authAPI.reducerPath]: authAPI.reducer,
  [aiAPI.reducerPath]: aiAPI.reducer,
  [storeAPI.reducerPath]: storeAPI.reducer,
  [aiStudioAPI.reducerPath]: aiStudioAPI.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authAPI.middleware, aiAPI.middleware, storeAPI.middleware, aiStudioAPI.middleware),
    devTools: true,
  });
};

export type TRootState = ReturnType<typeof rootReducer>;
export type TAppStore = ReturnType<typeof setupStore>;
export type TAppDispatch = TAppStore["dispatch"];

export const useAppDispatch = () => useDispatch<TAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
