import { configureStore } from "@reduxjs/toolkit";
import ModalReducer from "./ModalSlice/ModalSlice.js";
import VehicleReducer from "./ProductSlice/ProductsSlice.js";
import stationReducer from "./StationSlice/StationSlice.js";
import locationReducer from "./LocationSlice/LocationSlice.js";
import userReducer from "./UserSlice/UserSlice.js";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import errorReducer from "./ErrorSlice/ErrorSlice.js";
import filterReducer from "./FiltersSlice/FiltersSlice.js";

const userPersistConfig = {
  key: "user",
  version: "1",
  storage,
  whitelist: ["user"],
  blacklist: ["currentUser", "loading", "error"],
};

const locationPersistConfig = {
  key: "location",
  version: "1",
  storage,
  whitelist: ["selectedLocation"],
};

const stationPersistConfig = {
  key: "station",
  version: "1",
  storage,
  whitelist: ["station"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedStationReducer = persistReducer(
  stationPersistConfig,
  stationReducer
);
const persistedLocationReducer = persistReducer(
  locationPersistConfig,
  locationReducer
);

const store = configureStore({
  reducer: {
    modals: ModalReducer,
    vehicles: VehicleReducer,
    station: persistedStationReducer,
    user: persistedUserReducer,
    selectedLocation: persistedLocationReducer,
    error: errorReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
const persistor = persistStore(store);

export { store, persistor };
