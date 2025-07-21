import { tokenSelector, userSelector } from "../../redux/slices/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import openSocket from "socket.io-client";
import { VITE_APP_API_URL } from "@/config";
import { setSocket } from "@/redux/slices/socketSlice";
const SocketComponent = () => {
  const dispatch = useDispatch();

  const token = useSelector(tokenSelector);

  const user = useSelector(userSelector);

  const connectSocket = async () => {
    if (token !== null) {
      const url = VITE_APP_API_URL;

      const socket = await openSocket(url as string, {
        forceNew: true,
        transports: ["websocket"],
        query: {
          token: token,
        },
      });
      dispatch(setSocket(socket));
    }
  };
  useEffect(() => {
    connectSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  return <></>;
};
export default SocketComponent;
