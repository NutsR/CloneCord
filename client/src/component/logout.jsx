import { useUser } from "../hooks/user";
import { socket } from "../App";
function Logout() {
	const { user, setUser } = useUser();
	const handleLogout = async () => {
		await fetch("http://localhost:3001/api/logout", {
			method: "POST",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});
		setUser({});
		socket.close();
		localStorage.removeItem("sessionID");
	};
	return (
		<div>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}
export default Logout;
