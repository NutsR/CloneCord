import { useParams, Link } from "react-router-dom";
import { SocketContext } from "../../hooks/socket.io.context";
import { useContext, useEffect, useState, useRef, createRef } from "react";
import { useSelect } from "../../hooks/channel";
import Chat from "../chat/chat";
import { useServer } from "../../hooks/server";
import CreateChannelModal from "./channelModal";
import ProfileDropdown from "../dropdowns/profile";
function Channels() {
	const { id } = useParams();
	const { server } = useServer();
	const { selected, setSelected } = useSelect();
	const [channel, setChannel] = useState([]);
	const channelsRef = useRef();
	const [menu, setMenu] = useState({});
	const [profile, showProfile] = useState({});
	const socket = useContext(SocketContext);
	const handleClick = (chan) => {
		socket.emit("join-channel", chan._id);
		if (channelsRef.current) {
			setMenu({});
			channelsRef.current.style.display = "none";
		}
		setSelected(chan);
	};
	const closeMenu = (e) => {
		if (channelsRef.current && !channelsRef.current.contains(e.target)) {
			setMenu({});
			channelsRef.current.style.display = "none";
		}
	};
	useEffect(() => {
		if (server.length) {
			const getCorrectServer = server.filter((serv) =>
				serv.channels.some((chan) => chan._id === id)
			);
			if (getCorrectServer.length) {
				setChannel(getCorrectServer);
			}
		}
		document.addEventListener("mousedown", closeMenu);
		return () => {
			document.removeEventListener("mousedown", closeMenu);
		};
	}, [selected]);
	const handleDelete = async () => {
		const res = await fetch(
			`${process.env.REACT_APP_public_url}/api/channels/delete`,
			{
				method: "delete",
				mode: "cors",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: menu.id }),
			}
		);
		const data = await res.json();
		if (data.deleted) {
			setChannel((chan) => {
				const newChan = chan.map((server) => {
					server.channels = server.channels.filter((channel) => {
						if (channel._id !== data.deleted_id) {
							return channel;
						}
					});
					return server;
				});
				return newChan;
			});
		}
	};
	return (
		<>
			<div className="channels-container">
				<div className="channel-title">
					{channel.length && (
						<div>
							<div>{channel[0].server_name}</div>
							<div>id: {channel[0]._id}</div>
						</div>
					)}
				</div>
				<div className="channel-subtitle">
					<span className="category-name"> {" >"}Text Channels</span>{" "}
					<CreateChannelModal
						server_id={channel.length && channel[0]._id}
						handleClick={handleClick}
						setChannel={setChannel}
					/>
				</div>
				{channel
					? channel.length && (
							<>
								{channel[0].channels.map((chan, i) => (
									<div
										key={chan._id}
										onClick={() => handleClick(chan)}
										onContextMenu={(e) => {
											e.preventDefault();
											if (channelsRef.current) {
												channelsRef.current.style.left = `${
													e.pageX > 200 ? e.pageX - 70 : e.pageX - 25
												}px`;
												channelsRef.current.style.top = e.pageY + "px";
												channelsRef.current.style.display = "block";
												setMenu({ id: chan._id });
											}
										}}
										className="transi-in"
									>
										<Link to={`/channels/${chan._id}`}>
											<span
												className={`channel-link ${
													selected._id === chan._id ? "channel-selected" : ""
												}`}
											>
												<span className="hashtag">#</span>
												{chan.name}
											</span>
										</Link>
									</div>
								))}
								<div ref={channelsRef} className="context-menu">
									{menu.id && (
										<div onClick={handleDelete}>
											Delete Channel (instantly deletes and all messages)
											{menu.id}
										</div>
									)}
								</div>
							</>
					  )
					: null}
			</div>
			{selected._id && <Chat />}
			<div className="server-users">
				<div className="online">
					Users- {channel.length && channel[0].users.length}
				</div>
				<div>
					{channel.length &&
						channel[0].users.map((userObj) => (
							<div key={userObj._id}>
								<div
									className="user"
									onClick={() =>
										showProfile((u) => (u._id === userObj._id ? {} : userObj))
									}
								>
									{userObj.username}
									{channel[0].creator === userObj._id ? (
										<span>&#128081;</span>
									) : (
										""
									)}
								</div>
							</div>
						))}
					{profile._id && (
						<ProfileDropdown userObj={profile} showProfile={showProfile} />
					)}
				</div>
			</div>
		</>
	);
}
export default Channels;
