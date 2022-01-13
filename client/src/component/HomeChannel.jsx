import { SocketContext } from "../hooks/socket.io.context";
import { useContext, useState, useEffect } from "react";
import { useUser } from "../hooks/user";
import { useNavigate } from "react-router-dom";

function HomeChannel() {
	const [contacts, setContacts] = useState([]);
	const { user } = useUser();
	const navigate = useNavigate();
	const socket = useContext(SocketContext);
	const handleClick = (joined) => {
		if (user.socket_id !== joined) {
			socket.emit("create-join-room", joined);
			navigate(`/channels/${user._id}`);
		}
	};
	useEffect(() => {
		socket.on("users", (users) => {
			setContacts(users);
		});
		return () => socket.off("users");
	});
	return (
		<>
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
		</>
	);
}
export default HomeChannel;
