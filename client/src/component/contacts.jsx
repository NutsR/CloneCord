import { useState } from "react";
import { socket } from "../App";
import { useUser } from "../hooks/user";
import { io } from "socket.io-client";
function Contacts() {
	const { user } = useUser();
	const [contacts, setContacts] = useState([]);
	const [selected, setSelected] = useState("");
	socket.on("users", (users) => {
		setContacts(users);
	});
	const handleClick = (joined) => {
		if (user.socket_id !== joined) {
			socket.emit("create-join-room", joined);
			setSelected(joined);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const serverName = e.currentTarget.serverName.value;
		const res = await fetch("http://localhost:3001/api/server/create", {
			method: "post",
			credentials: "include",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ serverName, user: user.id }),
		});
		const data = await res.json();

		if (data.server._id) {
			console.log(data.server.server_name);
			let newsocket = io(`/${data.server.server_name}`, { autoConnect: false });
			newsocket.connect();
			newsocket.on("receive-message", (message) => {
				console.log(message);
			});
		}
	};
	return (
		<div className="contacts-container">
			<span className="contact-title">Direct Message</span>
			{contacts.map((contact) => (
				<div
					key={contact.userID}
					onClick={() => handleClick(contact.userID)}
					className="contacts-item"
				>
					{contact.username === user.username
						? `${contact.username}(You)`
						: contact.username}
					{selected === contact.userID ? "Joined" : ""}
				</div>
			))}
			<form onSubmit={handleSubmit} className="chat-input">
				<input type="text" name="serverName" />
				<button className="btn">Create a new server</button>
			</form>
		</div>
	);
}
export default Contacts;
