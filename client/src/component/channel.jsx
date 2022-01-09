import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/user";
import Contacts from "./contacts";
import { SocketContext } from "../hooks/socket.io.context";
import "../styles/styles.css";

import Chat from "./chat";
function Channel() {
	const socket = useContext(SocketContext);
	const { user, loader, checkLogin } = useUser();
	const navigate = useNavigate();
	useEffect(() => {
		checkLogin();
		if (!loader) {
			if (!user._id) {
				navigate("/login");
			}
		}
	}, [loader, user._id, navigate]);
	const createRoom = (e) => {
		socket.emit("create-join-room", e.currentTarget.channel.value);
	};
	return (
		<div className="channel-container">
			<Contacts />
			<Chat />
		</div>
	);
}

export default Channel;
