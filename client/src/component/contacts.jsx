import { useState } from "react";
import { socket } from "../App";
import { useUser } from "../hooks/user";
function Contacts() {
	const { user } = useUser();
	const [contacts, setContacts] = useState([]);
	socket.on("users", (users) => {
		console.log(users);
		setContacts(users);
	});
	return (
		<div>
			Users
			{contacts.map((contact) => (
				<div key={contact.userID}>
					{contact.username === user.username
						? `${contact.username}(You)`
						: contact.username}
				</div>
			))}
		</div>
	);
}
export default Contacts;
