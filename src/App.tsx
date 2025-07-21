import "./index.css";
import RouterComponent from "./router/RouterComponent";
import ToastNotification from "./components/toastNotification/ToastNotification";
import { PermissionProvider } from "./context/PermissionProvider";
import SocketComponent from "./components/socketComponent/SocketComponent";

function App() {
  return (
    <>
      <SocketComponent />
      <ToastNotification />
      <PermissionProvider>
        <RouterComponent />
      </PermissionProvider>
    </>
  );
}

export default App;
