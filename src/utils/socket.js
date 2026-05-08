
import { io } from "socket.io-client";

// Replace with your backend URL
const { REACT_APP_BASE_URL } = './../../../utils/api';
const SOCKET_URL = REACT_APP_BASE_URL;

// Create socket instance
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true
});

export default socket;