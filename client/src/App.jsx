import { io } from "socket.io-client";
import Register from "./component/register";
import Login from "./component/login";
import { useUser } from "./hooks/user";
import Channel from "./component/channel";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
let socket = io({ autoConnect: false });

function App() {
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
				<Route path="/channels/:id" element={<Channel />} />
			</Routes>
			<div className="container">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</div>
		</div>
	);
}
export { socket };
export default App;
