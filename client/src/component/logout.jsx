import { useUser } from "../hooks/user";
import { useEffect, useState, useCallback } from "react";
import { socket } from "../App";
function Logout() {
	const { user, checkLogin } = useUser();
	const [logoutReq, setLogoutReq] = useState(false);
	const handleLogout = useCallback(async () => {
		await fetch("http://localhost:3001/api/logout", {
			method: "POST",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});
		if (logoutReq) {
			socket.disconnect();
		}
	}, [user, logoutReq]);
	useEffect(() => {
		if (logoutReq) {
			handleLogout();
			checkLogin();
		}
	}, [logoutReq, handleLogout]);
	return (
		<div>
			<button onClick={() => setLogoutReq(true)}>Logout</button>
		</div>
	);
}
export default Logout;
