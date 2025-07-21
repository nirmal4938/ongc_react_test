import * as ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import setupAxios from "./axios/axios";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
setupAxios(store);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
