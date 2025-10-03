import io from "socket.io-client";
import {TOKEN} from "../asyncStorage/Constants";
import { getValueIntoAsyncStorage } from "../asyncStorage/Functions";
import { socketUrl } from "../intercepter";

let socket = null;

const setGlobalSocketConnection = (data) => {
    socket = data;
};

const connectionSocket = async () => {
    let token = await getValueIntoAsyncStorage(TOKEN);
    let options = { withCredentials: false, transports: ['websocket'], query: {"Authorization": token} };
    socket = io.connect(`${socketUrl}`, options);
};



export { connectionSocket, socket, setGlobalSocketConnection }
