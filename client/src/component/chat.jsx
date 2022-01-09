import { useState, useEffect } from "react";
import { useUser } from "../hooks/user";
import { socket } from "../App.jsx";
function Chat() {
	const { user } = useUser();
	const [messages, setMessages] = useState([]);
	const handleSubmit = (e) => {
		e.preventDefault();
		let message = e.currentTarget.inputMsg.value;
		if (user.id) {
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
							<>
								<div className="messages">
									<span className="username">
										{element.name} at {element.time}
									</span>
									<p key={i} className="msg">
										{element.message}
									</p>
								</div>
							</>
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
