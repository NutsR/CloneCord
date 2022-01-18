import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../hooks/socket.io.context";
import { useUser } from "../../hooks/user";
function ProfileDropdown({ userObj, showProfile }) {
	const socket = useContext(SocketContext);
	const navigate = useNavigate();
	const { user } = useUser();
	const handleSubmit = (e) => {
		e.preventDefault();
		if (user._id === userObj._id) {
			return;
		}
		const obj = {
			message: e.currentTarget.message.value,
			sender: user._id,
			username: user.username,
			channel_id: userObj._id,
		};
		socket.emit("sent-dm", obj);
	};
	const resultsRef = useRef();
	const handler = (event) => {
		if (!resultsRef.current.contains(event.target)) {
			showProfile({});
		}
	};
	useEffect(() => {
		socket.on("dm-join", (dm) => {
			socket.emit("join-dm", dm._id);
			navigate(`/channels/@me/${dm._id}`);
		});

		document.addEventListener("mousedown", handler);
		return () => {
			document.removeEventListener("mousedown", handler);
			socket.off("dm-history");
		};
	}, [socket]);
	return (
		<div className="profile-dropdown" ref={resultsRef}>
			<div className="close-dropdown" onClick={() => showProfile({})}>
				X
			</div>
			<div className="username">{userObj.username}</div>
			{user._id === userObj._id ? null : (
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder={`message user`}
						className="input"
						name="message"
					/>
				</form>
			)}
		</div>
	);
}

export default ProfileDropdown;
