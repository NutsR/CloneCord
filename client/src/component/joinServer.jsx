import { useSelect } from "../hooks/channel";
import { useState } from "react";
import Modal from "react-modal";
import { useUser } from "../hooks/user";
function JoinServer() {
	const { user } = useUser();
	const { setSelected } = useSelect();
	const [modalIsOpen, setIsOpen] = useState(false);
	Modal.setAppElement(document.getElementById("opener"));
	const handleJoin = async (e) => {
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
		setSelected(data[0]);
	};
	const handleCreate = async (e) => {
		e.preventDefault();
		const serverName = e.currentTarget.serverName.value;
		const res = await fetch("http://localhost:3001/api/server/create", {
			method: "post",
			credentials: "include",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ serverName, user: user._id }),
		});
		const data = await res.json();
		if (data._id) {
			setSelected(data[0]);
		}
	};
	const openModal = () => {
		setIsOpen(true);
	};
	const closeModal = () => {
		setIsOpen(false);
	};
	return (
		<>
			{" "}
			<button
				className="btn"
				className="join-btn"
				id="opener"
				onClick={openModal}
			>
				+
			</button>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				contentLabel="Create or Join a server"
			>
				<button onClick={closeModal}>Close</button>
				<form onSubmit={handleCreate}>
					<input type="text" name="serverName" />
					<button className="btn">Create a server</button>
				</form>
				<form onSubmit={handleJoin} className="chat-input">
					<input type="text" name="server_id" />
					<button className="btn">Join</button>
				</form>
			</Modal>
		</>
	);
}
export default JoinServer;
// <input type="text" name="server_id" />
