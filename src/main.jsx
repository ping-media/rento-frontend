import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./Redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import PreLoader from "./components/skeleton/PreLoader.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<PreLoader />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
