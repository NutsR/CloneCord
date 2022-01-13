import Register from "./component/register";
import Login from "./component/login";
import { useUser } from "./hooks/user";
import Main from "./component/main";
import {
	Outlet,
	Route,
	Routes,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { useEffect, useContext } from "react";
import { SocketContext } from "./hooks/socket.io.context";
import Channels from "./component/Channels";
import HomeChannel from "./component/HomeChannel";
function App() {
	const socket = useContext(SocketContext);

	const { user, setUser } = useUser();
	const location = useLocation();
	const navigate = useNavigate();
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
	useEffect(() => {
		if (location.pathname === "/") {
			navigate("/login");
		}
	});
	return (
		<div className="App">
			<Routes>
				<Route path="/channels" element={<Main />}>
					<Route path=":id" element={<Channels />} />
				</Route>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>

			<Outlet />
		</div>
	);
}

export default App;
