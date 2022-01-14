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
			<button className="join-btn" id="opener" onClick={openModal}>
				+
			</button>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				className="server-modal"
				contentLabel="Create or Join a server"
			>
				<button onClick={closeModal} className="close-modal">
					X
				</button>
				<div className="modal-title">Create a server</div>
				<div className="modal-subtitle">
					Your server is where you and your friends hang out. Make yours and
					start talking
				</div>

				<form onSubmit={handleCreate} className="create-server">
					<div className="create-div">
						<label htmlFor="serverName">Server name</label>
					</div>
					<div className="create-input-div">
						<input type="text" name="serverName" />
					</div>
					<button className="modal-btn">Create a server</button>
				</form>
				<form onSubmit={handleJoin} className="join-server">
					<div className="join-div">
						<label className="join-server-label" htmlFor="server_id">
							Server Name
						</label>
					</div>
					<div className="join-input-div">
						<input type="text" name="server_id" placeholder="Server ID" />
					</div>
					<button className="modal-btn">Join A server</button>
				</form>
			</Modal>
		</>
	);
}
export default JoinServer;
// <input type="text" name="server_id" />
