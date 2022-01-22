import { useState, useEffect, useContext, useRef } from "react";
import { useUser } from "../../hooks/user";
import { SocketContext } from "../../hooks/socket.io.context";
import { useSelect } from "../../hooks/channel";
import ProfilePng from "../../dist/user.png";
import {
	ChatContainer,
	ChatInput,
	ChatMessages,
	Header,
	NoMessages,
} from "./chat-styled";
function Chat() {
	const socket = useContext(SocketContext);
	const { user } = useUser();
	const messagesEndRef = useRef(null);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
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
			const msgs = historyMsg.map((el) => {
				el.time = new Date(el.time);
				el.date = new Date(el.date);
				return el;
			});
			setMessages(msgs);
		});
		socket.on("receive-message", (message) => {
			message.time = new Date(message.time);
			setMessages((msg) => [...msg, message]);
		});

		scrollToBottom();
		return () => {
			socket.off("receive-message");
			socket.off("history");
		};
	}, [messages]);
	return (
		<>
			<Header>#{selected.name}</Header>
			<ChatContainer>
				<ChatMessages>
					{messages.length ? (
						messages.map((element, i) => (
							<div
								key={i}
								className={` ${
									i !== 0 &&
									(element.user_id === messages[i - 1].user_id) &
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
											{element.time.toLocaleDateString()}
										</span>
									</span>
									<p key={i} className="msg">
										{element.message}
									</p>
								</div>
							</div>
						))
					) : (
						<NoMessages>Create history! Send the first message</NoMessages>
					)}
					<div ref={messagesEndRef} className="endRef" />
				</ChatMessages>
				<ChatInput onSubmit={handleSubmit}>
					<input type="text" name="inputMsg" />
				</ChatInput>
			</ChatContainer>
		</>
	);
}
export default Chat;
