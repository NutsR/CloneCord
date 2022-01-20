import { useState } from "react";
import Modal from "react-modal";

function CreateChannelModal({ server_id, setChannel }) {
	const [modalIsOpen, setIsOpen] = useState(false);
	Modal.setAppElement(document.getElementById("add-opener"));
	const openModal = () => {
		setIsOpen(true);
	};
	const closeModal = () => {
		setIsOpen(false);
		console.log("click");
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const channel_name = e.currentTarget.channel_name.value;
		const res = await fetch(
			`${process.env.REACT_APP_public_url}/api/channels/create`,
			{
				mode: "cors",
				method: "post",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ channel_name, server_id }),
			}
		);
		const { channel, server } = await res.json();
		if (channel._id) {
			setChannel((chan) => (chan = [server]));
			setIsOpen(false);
		}
	};
	return (
		<>
			<div className="category-add" id="add-opener" onClick={openModal}>
				&#65291;<div className="tooltiptext">Create Channel</div>
			</div>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				className="channel-modal"
				contentLabel="Create a text channel"
			>
				<button className="close-modal" onClick={closeModal}>
					X
				</button>
				<form onSubmit={handleSubmit}>
					<div className="modal-title">Create a Text Channel</div>
					<div className="create-div">
						<label htmlFor="channel_name">Create a channel</label>
					</div>
					<div className="create-input-div">
						<input
							type="text"
							name="channel_name"
							placeholder="Enter Channel Name"
						/>
					</div>
					<button className="modal-btn">Create Channel</button>
				</form>
			</Modal>
		</>
	);
}
export default CreateChannelModal;
