import { socket } from "../App";
import { useState } from "react";
function CreateRoom() {
	const [value, setValue] = useState("");
	const createRoom = () => {
		socket.emit("create-join-room", value);
	};
	return (
		<div>
			<input
				type="text"
				onChange={(e) => setValue(e.target.value)}
				value={value}
			/>
			<button onClick={createRoom}>Create a room</button>
		</div>
	);
}
export default CreateRoom;
