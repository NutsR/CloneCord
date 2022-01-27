import { useUser } from "../../hooks/user";
import { useEffect, useState, useCallback, useContext } from "react";
import { SocketContext } from "../../hooks/socket.io.context";
function Logout() {
	const { user, checkLogin } = useUser();
	const socket = useContext(SocketContext);
	const [logoutReq, setLogoutReq] = useState(false);
	const handleLogout = useCallback(async () => {
		await fetch(`${process.env.REACT_APP_public_url}/api/logout`, {
			method: "POST",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});
		if (logoutReq) {
			socket.close();
		}
	}, [user, logoutReq, socket]);
	useEffect(() => {
		if (logoutReq) {
			handleLogout();
			checkLogin();
		}
	}, [logoutReq, handleLogout]);
	return (
		<div className="logout">
			<div className="title">{user.username}</div>
			<button onClick={() => setLogoutReq(true)}>Logout</button>
		</div>
	);
}
export default Logout;
