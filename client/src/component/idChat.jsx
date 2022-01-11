import { useParams } from "react-router-dom";
import { SocketContext } from "../hooks/socket.io.context";
import { useUser } from "../hooks/user";
import { useContext, useState } from "react";
import { useSelect } from "../hooks/channel";
function ChatChannel() {
	const { id } = useParams();
	const { user, loader } = useUser();
	const { selected, setSelected } = useSelect();
	const [channel, setChannel] = useState(() => {
		if (!loader && user._id) {
			const getCorrectServer = user.server.filter((serv) =>
				serv.channels.some((chan) => chan._id === id)
			);
			if (getCorrectServer.length) {
				return getCorrectServer;
			}
			return [];
		}
	});
	const socket = useContext(SocketContext);
	const handleClick = (chan) => {
		socket.emit("join-channel", chan._id);
		setSelected(chan);
	};
	return (
		<>
			{channel
				? channel.length &&
				  channel[0].channels.map((chan) => (
						<span key={chan._id} onClick={() => handleClick(chan)}>
							{chan.name}
						</span>
				  ))
				: null}
		</>
	);
}
export default ChatChannel;
