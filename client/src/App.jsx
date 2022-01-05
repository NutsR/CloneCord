import { io } from "socket.io-client";
import Register from "./component/register";
import Login from "./component/login";
import Chat from "./component/chat";
import CreateRoom from "./component/room";
import Contacts from "./component/contacts";
import Logout from "./component/logout";
import { useUser } from "./hooks/user";
import { useState } from "react";
const socket = io({ autoConnect: false });

function App() {
	const { user, setUser } = useUser();
	const [login, showLogin] = useState(false);

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
	return (
		<div className="App">
			<div className="container">
				<h2>Welcome to Clone cord</h2>
				<h3>Register/Login</h3>
				<LoginOrRegister login={login} />
			</div>
		</div>
	);
}
export { socket };
export default App;

function LoginOrRegister({ login }) {
	if (login) {
		return <Login />;
	}
	return <Register />;
}
