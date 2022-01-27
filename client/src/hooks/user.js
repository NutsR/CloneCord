import { useContext, useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "./socket.io.context";
import { useLocation } from "react-router-dom";
const UserContext = createContext();
export const initState = {
	username: `guest${Math.floor(Math.random() * 12000) + 1}`,
	id: "",
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
		const res = await fetch(`${process.env.REACT_APP_public_url}/api/user`, {
			method: "GET",
			credentials: "include",
		});

		const data = await res.json();
		if (data._id) {
			setUser(data);
			setLoader(false);
			if (!location.pathname.includes("channels")) {
				navigate("/channels/@me");
			}
			return socket.connect(process.env.REACT_APP_public_url);
		}
		setUser(initState);
		setLoader(false);
	};
	useEffect(() => {
		checkLogin();
	}, [checkLogin]);
	return (
		<UserContext.Provider value={{ user, checkLogin, setUser, loader }}>
			{children}
		</UserContext.Provider>
	);
}
export default UserProvider;
