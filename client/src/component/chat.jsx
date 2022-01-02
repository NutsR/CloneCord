import { useState, useEffect } from "react";
import { useUser } from "../hooks/user";
import { socket } from "../App.jsx";
function Chat() {
	const { user } = useUser();
	const [msgSent, setMsgSent] = useState({
		message: "",
		user: "",
		name: `${user.username}`,
	});
	const [messages, setMessages] = useState([]);
	const onChange = (e) => {
		setMsgSent({ ...msgSent, message: e.target.value });
	};
	const handleSend = (e) => {
		if (e) {
			e.preventDefault();
		}
		socket.emit("sent-message", msgSent);
		setMsgSent({ ...msgSent, message: "" });
	};
	const handleKeyPress = (e) => {
		if (e.keyCode === 13) handleSend();
	};
	useEffect(() => {
		if (user.id) {
			setMsgSent((m) => {
				return { ...m, name: `${user.username}` };
			});
		}
		socket.on("receive-message", (message) => {
			setMessages(() => [...messages, message]);
		});
		return () => {
			socket.off("receive-message");
		};
	}, [messages]);
	return (
		<>
			{messages.length
				? messages.map((element, i) => (
						<p key={i}>
							{element.message} by {element.name}
						</p>
				  ))
				: null}
			<input
				type="text"
				value={msgSent.message}
				onChange={onChange}
				onKeyPress={handleKeyPress}
			/>
			<button onClick={handleSend}>Send</button>
		</>
	);
}
export default Chat;
