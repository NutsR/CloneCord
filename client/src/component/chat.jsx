import { useState, useEffect, useContext } from "react";
import { useUser } from "../hooks/user";
import { SocketContext } from "../hooks/socket.io.context";
import { useSelect } from "../hooks/channel";
function Chat() {
	const socket = useContext(SocketContext);

	const { user } = useUser();
	const [messages, setMessages] = useState([]);
	const { selected } = useSelect();
	const handleSubmit = (e) => {
		e.preventDefault();
		let message = e.currentTarget.inputMsg.value;
		if (message) {
			if (user._id) {
				socket.emit("sent-message", {
					message,
					user_id: user.socket_id,
					username: user.username,
					channel_id: selected._id,
				});
				e.currentTarget.inputMsg.value = "";
			}
		}
	};
	useEffect(() => {
		socket.on("history", (historyMsg) => {
			setMessages(historyMsg);
		});
		socket.on("receive-message", (message) => {
			setMessages((msg) => [...msg, message]);
		});
		return () => {
			socket.off("receive-message");
			socket.off("history");
		};
	}, [messages]);
	return (
		<div className="chat-container">
			<div className="chat-messages">
				{messages.length
					? messages.map((element, i) => (
							<div className="messages" key={i}>
								<span className="username">
									{element.username} at {element.time}
								</span>
								<p key={i} className="msg">
									{element.message}
								</p>
							</div>
					  ))
					: null}
			</div>
			<form className="chat-input" onSubmit={handleSubmit}>
				<input type="text" name="inputMsg" />
			</form>
		</div>
	);
}
export default Chat;
