import { io } from "socket.io-client";
import Register from "./component/register";
import Login from "./component/login";
import Chat from "./component/chat";
import CreateRoom from "./component/room";
import Contacts from "./component/contacts";
import { useUser } from "./hooks/user";
const socket = io({ autoConnect: false });

function App() {
	const { user } = useUser();

	return (
		<div className="App">
			<CreateRoom />
			<Register />
			<Login />
			<h1>Hello socket</h1>
			{user.socket_id ? (
				<>
					<Contacts />
					<Chat />
				</>
			) : null}
		</div>
	);
}
export { socket };
export default App;
