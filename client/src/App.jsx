import { io } from "socket.io-client";
import Register from "./component/register";
import Login from "./component/login";
import Chat from "./component/chat";
import CreateRoom from "./component/room";
import Contacts from "./component/contacts";
import Logout from "./component/logout";
import { useUser } from "./hooks/user";
const socket = io({ autoConnect: false });

function App() {
	const { user, setUser } = useUser();
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
			<CreateRoom />
			<Register />
			<Login />
			<h1>Hello socket</h1>
			{user.id ? (
				<>
					<Logout />
					<Contacts />
					<Chat />
				</>
			) : null}
		</div>
	);
}
export { socket };
export default App;
