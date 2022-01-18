import { SocketContext } from "../../hooks/socket.io.context";
import { useContext, useState, useEffect } from "react";
import { useUser } from "../../hooks/user";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
function HomeChannel() {
	const [contacts, setContacts] = useState([]);
	const { user } = useUser();
	const location = useLocation();
	const navigate = useNavigate();
	const socket = useContext(SocketContext);
	const handleJoin = (dm) => {
		navigate(dm._id);
		socket.emit("join-dm", dm._id);
	};
	useEffect(() => {
		socket.emit("get-dms", user._id);
		socket.on("dms-list", (dm) => {
			setContacts(dm);
		});
		return () => {
			socket.off("dms-list");
		};
	}, [socket]);
	return (
		<>
			<div className="dms">
				<div className="contact-title">Direct Message</div>
				<div>
					{contacts.length ? (
						contacts.map((dm, i) => {
							return (
								<div key={i}>
									{dm.users.map((userObj, i) => {
										if (userObj._id !== user._id) {
											return (
												<div key={i + 500} onClick={() => handleJoin(dm)}>
													{userObj.username}
												</div>
											);
										}
										return null;
									})}
								</div>
							);
						})
					) : (
						<div>You have no contacts</div>
					)}
				</div>
				<div className="server-users">
					Active users
					<div></div>
				</div>
			</div>
			{location.pathname === "/channels/@me" ? (
				<div className="chat-empty">
					<span>Select a user to chat or Create/Join a server</span>
				</div>
			) : (
				<Outlet />
			)}
		</>
	);
}
export default HomeChannel;
