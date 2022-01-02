import { useContext, useState, createContext, useEffect } from "react";
import { socket } from "../App";

const UserContext = createContext();
const initState = {
	username: `guest${Math.floor(Math.random() * 12000) + 1}`,
	id: "",
	socket_id: "",
};
export function useUser() {
	return useContext(UserContext);
}
function UserProvider({ children }) {
	const [user, setUser] = useState(initState);

	const checkLogin = async () => {
		const res = await fetch("http://localhost:3001/api/user", {
			method: "GET",
			credentials: "include",
		});
		const data = await res.json();

		if (data.id) {
			socket.auth = { username: data.username };
			socket.connect();
			setUser(data);
		}
	};
	useEffect(() => {
		socket.on("connect", () => {
			setUser((u) => ({ ...u, socket_id: "" }));
		});
		socket.on("session", ({ sessionID, userID }) => {
			const existingSession = localStorage.getItem("sessionID");
			console.log(existingSession);
			if (!existingSession) {
				localStorage.setItem("sessionID", sessionID);
				socket.auth = { sessionID };
				socket.userID = userID;
				setUser((u) => ({ ...u, socket_id: userID }));
			}
			setUser((u) => ({ ...u, socket_id: userID }));
			socket.auth = { sessionID: existingSession };
		});
		checkLogin();
	}, []);
	return (
		<UserContext.Provider value={{ user, checkLogin, setUser }}>
			{children}
		</UserContext.Provider>
	);
}
export default UserProvider;
