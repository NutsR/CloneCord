import { useContext, useEffect, useState, useRef } from "react";
import { SocketContext } from "../../hooks/socket.io.context";
import ProfilePng from "../../dist/user.png";
import { useUser } from "../../hooks/user";
import { useSelect } from "../../hooks/channel";
import { useParams } from "react-router-dom";
function Conversations() {
	const [messages, setMessages] = useState([]);
	const { id } = useParams();
	const { user } = useUser();
	const { selected } = useSelect;
	const messagesEndRef = useRef();
	const socket = useContext(SocketContext);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	useEffect(() => {
		socket.on("dm-history", (history) => {
			const updateMsgs = history.messages.map((msg) => {
				msg.time = new Date(msg.time);
				return msg;
			});
			setMessages(updateMsgs);
		});
		socket.on("receive-dm", (message) => {
			message.time = new Date(message.time);
			setMessages((u) => [...u, message]);
		});
		scrollToBottom();
		return () => {
			socket.off("dm-history");
			socket.off("receive-dm");
		};
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		let message = e.currentTarget.inputMsg.value;
		if (message) {
			if (user._id) {
				socket.emit("send-dm", {
					message,
					user_id: user._id,
					username: user.username,
					channel_id: id,
				});
				e.currentTarget.inputMsg.value = "";
			}
		}
	};
	return (
		<>
			<div className="header">Direct Messaging</div>
			<div className="chat-container">
				<div className="chat-messages">
					{messages.length
						? messages.map((element, i) => (
								<div
									key={i}
									className={` ${
										i !== 0 &&
										(element.username === messages[i - 1].username) &
											(element.time.getTime() <
												messages[i - 1].time.getTime() + 2 * 60000)
											? "continue"
											: "message-container"
									}`}
								>
									<div className="profile-pic">
										<img src={ProfilePng} alt="profile" />
									</div>
									<div className="messages">
										<span className="username">
											{element.username}
											<span className="time">
												{element.time.toLocaleTimeString()}{" "}
											</span>
										</span>
										<p key={i} className="msg">
											{element.message}
										</p>
									</div>
								</div>
						  ))
						: null}
					<div ref={messagesEndRef} className="endRef" />
				</div>
				<form className="chat-input" onSubmit={handleSubmit}>
					<input type="text" name="inputMsg" />
				</form>
			</div>
		</>
	);
}

export default Conversations;
