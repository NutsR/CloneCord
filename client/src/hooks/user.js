import { useContext, useState, createContext, useEffect } from "react";
import { socket } from "../App";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "./socket.io.context";
import { useLocation } from "react-router-dom";
const UserContext = createContext();
export const initState = {
	username: `guest${Math.floor(Math.random() * 12000) + 1}`,
	id: "",
	socket_id: "",
};
export function useUser() {
	return useContext(UserContext);
}
function UserProvider({ children }) {
	const socket = useContext(SocketContext);
	const navigate = useNavigate();
	const location = useLocation();
	const [user, setUser] = useState(initState);
	const [loader, setLoader] = useState(true);

	const checkLogin = async () => {
		const res = await fetch("http://localhost:3001/api/user", {
			method: "GET",
			credentials: "include",
		});

		const data = await res.json();
		if (data._id) {
			setUser(data);
			setLoader(false);
			const sessionID = localStorage.getItem(`${data.username}`);
			if (sessionID) {
				socket.auth = { username: data.username, sessionID: sessionID };
				if (!location.pathname.includes("channels")) {
					navigate("/channels");
				}
				return socket.connect();
			}
			socket.auth = { username: data.username, sessionID: "" };
			if (!location.pathname.includes("channels")) {
				navigate("/channels");
			}
			return socket.connect();
		}
		setUser(initState);
		setLoader(false);
	};
	useEffect(() => {
		socket.on("connect", () => {
			setUser((u) => ({ ...u, socket_id: "" }));
		});
		checkLogin();
	}, []);
	return (
		<UserContext.Provider value={{ user, checkLogin, setUser, loader }}>
			{children}
		</UserContext.Provider>
	);
}
export default UserProvider;
