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
import RideReducer from "./RidesSlice/RideSlice.js";
import BookingReducer from "./BookingSlice/BookingSlice.js";
import CouponReducer from "./CouponSlice/CouponSlice.js";
import AddOnReducer from "./AddOnSlice/AddOnSlice.js";
import GeneralReducer from "./SettingSlice/SettingSlice.js";

const userPersistConfig = {
  key: "user",
  version: "1",
  storage,
  whitelist: ["user"],
  blacklist: ["currentUser", "tempContact", "userDocument", "loading", "error"],
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
  whitelist: ["station", "selectedStation"],
};

const vehiclePersistConfig = {
  key: "vehicles",
  version: "1",
  storage,
  whitelist: ["tempDate"],
  blacklist: ["vehicles", "loading", "error"],
};

const bookingPersistConfig = {
  key: "booking",
  version: "1",
  storage,
  whitelist: ["tempBookingData", "isBookingDetailsActive"],
  blacklist: ["loading"],
};

const addonPersistConfig = {
  key: "addon",
  version: "1",
  storage,
  whitelist: ["selectedAddOn"],
};

const couponPersistConfig = {
  key: "coupon",
  version: "1",
  storage,
  whitelist: [
    "tempTotalPrice",
    "tempCouponName",
    "tempCouponId",
    "tempCouponDiscount",
    "tempCouponDiscountType",
    "tempCouponDiscountTotal",
    "tempCouponExtra",
  ],
  blacklist: ["loading"],
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

const persistedVehiclesReducer = persistReducer(
  vehiclePersistConfig,
  VehicleReducer
);

const persistedBookingReducer = persistReducer(
  bookingPersistConfig,
  BookingReducer
);
const persistedCouponReducer = persistReducer(
  couponPersistConfig,
  CouponReducer
);
const addonCouponReducer = persistReducer(addonPersistConfig, AddOnReducer);

const store = configureStore({
  reducer: {
    modals: ModalReducer,
    vehicles: persistedVehiclesReducer,
    booking: persistedBookingReducer,
    station: persistedStationReducer,
    user: persistedUserReducer,
    selectedLocation: persistedLocationReducer,
    error: errorReducer,
    filter: filterReducer,
    rides: RideReducer,
    addon: addonCouponReducer,
    coupon: persistedCouponReducer,
    general: GeneralReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
const persistor = persistStore(store);

export { store, persistor };
