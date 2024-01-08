import { React } from "react";
import ReactDOM from "react-dom/client";
import { registerLicense } from "@syncfusion/ej2-base";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import Modal from "react-modal";

Modal.setAppElement("#root");

registerLicense(process.env.REACT_APP_LICENSE_KEY);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
