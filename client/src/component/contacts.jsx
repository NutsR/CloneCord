import { useContext, useEffect, useState } from "react";
import { useUser } from "../hooks/user";
import { SocketContext } from "../hooks/socket.io.context";
import { useNavigate, Outlet, Link } from "react-router-dom";
import JoinServer from "./joinServer";

function Contacts() {
	const socket = useContext(SocketContext);
	const { user } = useUser();
	const [contacts, setContacts] = useState([]);
	const navigate = useNavigate();
	const [selected, setSelected] = useState("");
	socket.on("users", (users) => {
		setContacts(users);
	});
	const handleClick = (joined) => {
		if (user.socket_id !== joined) {
			socket.emit("create-join-room", joined);
			navigate(`/channels/${user._id}`);
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
			body: JSON.stringify({ serverName, user: user._id }),
		});
		const data = await res.json();
		if (data._id) {
			setSelected(data);
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
				</div>
			))}
			<form onSubmit={handleSubmit} className="chat-input">
				<input type="text" name="serverName" />
				<button className="btn">Create a new server</button>
			</form>
			<JoinServer />
			{user._id
				? user.server.length &&
				  user.server.map((server) => (
						<div key={server._id}>
							<Link to={`/channels/${server.channels[0]._id}`}>
								<div onClick={() => setSelected(server._id)}>
									{server.server_name}
								</div>
							</Link>
							{server._id === selected ? <Outlet /> : ""}
						</div>
				  ))
				: null}
		</div>
	);
}
export default Contacts;
