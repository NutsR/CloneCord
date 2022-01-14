import { useState } from "react";
import Modal from "react-modal";

function CreateChannelModal() {
	const [modalIsOpen, setIsOpen] = useState(false);
	const openModal = () => {
		setIsOpen(true);
	};
	const closeModal = () => {
		setIsOpen(false);
		console.log("click");
	};
	Modal.setAppElement(document.getElementById("add-opener"));
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
				<form>
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
