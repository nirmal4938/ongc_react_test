import { Middleware } from "redux";
import { persistStore } from "redux-persist";

import { configureStore } from "@reduxjs/toolkit";
import { CurriedGetDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware";

import rootReducer from "./rootReducers";

const Middlewares: Middleware[] = [];

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: CurriedGetDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(Middlewares),
  devTools: process.env.NODE_ENV === "development",
});

export const persistor = persistStore(store);
const exportStore = { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default exportStore;
