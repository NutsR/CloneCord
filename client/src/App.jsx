import { io } from "socket.io-client";
import Register from "./component/register";
import Login from "./component/login";
import Chat from "./component/chat";
import CreateRoom from "./component/room";
import Contacts from "./component/contacts";
import Logout from "./component/logout";
import { useUser } from "./hooks/user";
import { useState, useRef } from "react";
const socket = io({ autoConnect: false });

function App() {
	const { user, setUser } = useUser();
	const [form, showForm] = useState({ selection: "register" });

	socket.on("session", ({ sessionID, userID }) => {
		if (!user.username.includes("guest")) {
			const existingSession = localStorage.getItem(`${user.username}`);
			if (!existingSession) {
				localStorage.setItem(`${user.username}`, sessionID);
				socket.auth = { sessionID };
				socket.userID = userID;
				setUser((u) => ({ ...u, socket_id: userID }));
			}
			setUser((u) => ({ ...u, socket_id: userID }));
			socket.auth = { sessionID: existingSession };
		}
	});
	const handleClick = (e) => {
		if (e.target.id !== form.selection) {
			return showForm({ selection: e.target.id });
		}
	};
	return (
		<div className="App">
			<div className="container">
				<div className={`form-card ${form.selection}`}>
					<h2 className="main-title">
						{form.selection === "login"
							? "Welcome to Clone cord"
							: "Create an account"}
					</h2>
					{form.selection === "register" ? (
						<Register handleClick={handleClick} />
					) : (
						<Login handleClick={handleClick} />
					)}
				</div>
			</div>
		</div>
	);
}
export { socket };
export default App;
