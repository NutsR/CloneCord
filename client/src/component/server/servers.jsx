import { useState, useContext } from "react";
import { useUser } from "../../hooks/user";
import { useSelect } from "../../hooks/channel";
import { Link } from "react-router-dom";
import JoinServer from "./joinServer";
import { SocketContext } from "../../hooks/socket.io.context";
import { useServer } from "../../hooks/server";
function Servers() {
	const { user } = useUser();
	const { server } = useServer();
	const socket = useContext(SocketContext);
	const { selected, setSelected } = useSelect();
	const [serv, setServ] = useState({});
	const handleServerSel = (server) => {
		setServ(server);
		setSelected(server.channels[0]);
		socket.emit("join-channel", server.channels[0]);
	};
	return (
		<>
			<div className="contacts-container">
				<div>
					<Link to="/channels/@me">
						<div className="server-icon" data-letters="DS"></div>
						<hr className="home" />
					</Link>
				</div>
				{user._id
					? server.length &&
					  server.map((s) => (
							<div key={s._id} className="server-display">
								<Link to={`/channels/${s.channels[0]._id}`}>
									<div
										onClick={() => handleServerSel(s)}
										className="server-icon"
										data-letters={`${s.server_name.charAt(0)} 
											${s.server_name.indexOf(" ") >= 1 ? s.server_name.split(" ")[1].charAt(0) : ""}
									`}
									></div>
								</Link>
							</div>
					  ))
					: null}
				<JoinServer handleServerSel={handleServerSel} />
			</div>
		</>
	);
}
export default Servers;
