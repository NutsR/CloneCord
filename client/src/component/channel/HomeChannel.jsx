import { SocketContext } from "../../hooks/socket.io.context";
import { useContext, useState, useEffect } from "react";
import { useUser } from "../../hooks/user";
import ProfilePng from "../../dist/user.png";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
	ChatEmpty,
	ContactTitle,
	DirectMessages,
	DmLists,
	DmUsers,
	ProfilePic,
} from "./channel-styled";
function HomeChannel() {
	const [contacts, setContacts] = useState([]);
	const [selected, setSelected] = useState("");
	const { user } = useUser();
	const location = useLocation();
	const navigate = useNavigate();
	const socket = useContext(SocketContext);
	const handleJoin = (dm, userObj) => {
		setSelected(dm._id);
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
			<DirectMessages>
				<ContactTitle>Direct Message</ContactTitle>
				<div>
					{contacts.length ? (
						contacts.map((dm, i) => {
							return (
								<DmLists key={i}>
									{dm.users.map((userObj, i) => {
										if (userObj._id !== user._id) {
											return (
												<DmUsers
													key={i + 500}
													onClick={() => handleJoin(dm, userObj)}
													className={selected === dm._id ? "dm-selected" : ""}
												>
													<ProfilePic>
														<img src={ProfilePng} alt="profile" />
													</ProfilePic>
													<div className="dm-username">{userObj.username}</div>
												</DmUsers>
											);
										}
										return null;
									})}
								</DmLists>
							);
						})
					) : (
						<div>You have no contacts</div>
					)}
				</div>
			</DirectMessages>
			{location.pathname === "/channels/@me" ? (
				<ChatEmpty>
					<span>Select a user to chat or Create/Join a server</span>
				</ChatEmpty>
			) : (
				<Outlet />
			)}
		</>
	);
}
export default HomeChannel;
