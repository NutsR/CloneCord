import React from "react";
import { io } from "socket.io-client";

export const socket = io({ autoConnect: false });
export const SocketContext = React.createContext();
