import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/user";
import Contacts from "./contacts";
import { socket } from "../App";
import "../styles/styles.css";

import Chat from "./chat";
function Channel() {
	const { user, loader, checkLogin } = useUser();
	const navigate = useNavigate();
	useEffect(() => {
		checkLogin();
		if (!loader) {
			if (!user.id) {
				navigate("/login");
			}
		}
	}, [loader, user.id, navigate]);
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
