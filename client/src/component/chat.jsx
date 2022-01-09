import { useState, useEffect, useContext } from "react";
import { useUser } from "../hooks/user";
import { SocketContext } from "../hooks/socket.io.context";
function Chat() {
	const socket = useContext(SocketContext);

	const { user } = useUser();
	const [messages, setMessages] = useState([]);
	const handleSubmit = (e) => {
		e.preventDefault();
		let message = e.currentTarget.inputMsg.value;
		if (user._id) {
			socket.emit("sent-message", {
				message,
				user: user.socket_id,
				name: user.username,
			});
			e.currentTarget.inputMsg.value = "";
		}
	};
	useEffect(() => {
		socket.on("receive-message", (message) => {
			setMessages(() => [...messages, message]);
		});
		return () => {
			socket.off("receive-message");
		};
	}, [messages]);
	return (
		<div className="chat-container">
			<div className="chat-messages">
				{messages.length
					? messages.map((element, i) => (
							<div className="messages" key={i}>
								<span className="username">
									{element.name} at {element.time}
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
