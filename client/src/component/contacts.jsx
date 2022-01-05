import { useState } from "react";
import { socket } from "../App";
import { useUser } from "../hooks/user";
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
	return (
		<div>
			Users
			{contacts.map((contact) => (
				<div key={contact.userID} onClick={() => handleClick(contact.userID)}>
					{contact.username === user.username
						? `${contact.username}(You)`
						: contact.username}
					{selected === contact.userID ? "Joined" : ""}
				</div>
			))}
		</div>
	);
}
export default Contacts;
