import { useSelect } from "../hooks/channel";

function JoinServer() {
	const { setSelected } = useSelect();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const serverId = e.currentTarget.server_id.value;
		const res = await fetch("http://localhost:3001/api/server/join", {
			mode: "cors",
			credentials: "include",
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ serverId }),
		});
		const data = await res.json();
		setSelected(data);
	};

	return (
		<form onSubmit={handleSubmit} className="chat-input">
			<input type="text" name="server_id" />
			<button className="btn">Join a server</button>
		</form>
	);
}
export default JoinServer;
