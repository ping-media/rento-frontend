import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./Redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import PreLoader from "./components/skeleton/PreLoader.jsx";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<PreLoader showLogo />} persistor={persistor}>
      <App />
      {import.meta.env.PROD && <Analytics />}
    </PersistGate>
  </Provider>,
);
