import React from "react";
import { io } from "socket.io-client";
const url = process.env.REACT_APP_public_url;

export const socket = io({ autoConnect: false });
export const SocketContext = React.createContext();
