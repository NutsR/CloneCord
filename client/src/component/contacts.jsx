import { useContext, useEffect, useState } from "react";
import { useUser } from "../hooks/user";
import { SocketContext } from "../hooks/socket.io.context";
import { useParams } from "react-router-dom";
function Contacts() {
	const { id } = useParams();
	const socket = useContext(SocketContext);
	const { user } = useUser();
	const [contacts, setContacts] = useState([]);
	const [selected, setSelected] = useState("");
	const [channel, setChannel] = useState({});
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
		await fetch("http://localhost:3001/api/server/create", {
			method: "post",
			credentials: "include",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ serverName, user: user._id }),
		});
	};
	useEffect(() => {});
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
			{user.server.length &&
				user.server.map((server) => (
					<div onClick={() => setChannel(server.channels)} key={server._id}>
						{server.server_name}
					</div>
				))}
			{channel.length &&
				channel.map((chan) => (
					<div key={chan._id} onClick={socket.emit("join-channel", chan._id)}>
						{chan.name}
					</div>
				))}
		</div>
	);
}
export default Contacts;
