import React from "react";
import { io } from "socket.io-client";
import parser from "socket.io-msgpack-parser";
const url = process.env.REACT_APP_public_url;

export const socket = io({ autoConnect: false, parser });
export const SocketContext = React.createContext();
