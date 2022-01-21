import { useParams, Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../../hooks/socket.io.context";
import { useContext, useEffect, useState, useRef, Suspense, lazy } from "react";
import { useSelect } from "../../hooks/channel";
import Chat from "../chat/chat";
import { useServer } from "../../hooks/server";
import ProfileDropdown from "../dropdowns/profile";
import { useUser } from "../../hooks/user";
import useLongPress from "../../hooks/Longpress";
const CreateChannelModal = lazy(() => import("./channelModal"));
function Channels() {
	const { id } = useParams();
	const { server, setServer } = useServer();
	const { user, setUser } = useUser();
	const { selected, setSelected } = useSelect();
	const navigate = useNavigate();
	const [channel, setChannel] = useState([]);
	const [menu, setMenu] = useState({});
	const [servMenu, setServMenu] = useState(false);
	const [profile, showProfile] = useState({});

	const channelsRef = useRef();
	const serverRef = useRef();

	const channelDelete = useLongPress(handleDelete, () => {}, {
		delay: 1990,
	});

	const serverDelete = useLongPress(handleServerDel, () => {}, {
		delay: 1990,
	});

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
		if (serverRef.current && !serverRef.current.contains(e.target)) {
			setServMenu(false);
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

	async function handleDelete(e) {
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
			setMenu({});
			channelsRef.current && (channelsRef.current.style.display = "none");
		}
	}

	async function handleServerDel() {
		if (channel.length) {
			const id = channel[0]._id;
			console.log(id);
			const res = await fetch(
				`${process.env.REACT_APP_public_url}/api/server/delete`,
				{
					mode: "cors",
					method: "delete",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id }),
				}
			);
			const data = await res.json();
			if (data.success) {
				setServMenu(false);
				setUser((u) => {
					u.server = u.server.filter((s) => {
						if (s._id !== id) {
							return s;
						}
					});
					return u;
				});
				setServer((s) => {
					const newServers = s.filter((serv) => {
						if (serv._id !== id) {
							return serv;
						}
					});
					return newServers;
				});
				navigate("/channels/@me");
			}
		}
	}

	return (
		<>
			<div className="channels-container">
				<div className="channel-title">
					{channel.length && (
						<div>
							<div
								className="server-info"
								onClick={(e) => {
									setServMenu(!servMenu);
									if (serverRef.current) {
										serverRef.current.style.left = `${e.pageX}px`;
										serverRef.current.style.top = e.pageY + "px";
									}
								}}
							>
								&#8942;
							</div>

							<div>{channel[0].server_name}</div>
							<div>id: {channel[0]._id}</div>
						</div>
					)}
					{servMenu && user._id === channel[0].creator ? (
						<div ref={serverRef} className="context-menu serv-info">
							<div {...serverDelete}>Delete Server (hold)</div>
						</div>
					) : null}
				</div>
				<div className="channel-subtitle">
					<span className="category-name"> {" >"}Text Channels</span>{" "}
					<Suspense fallback={<div>Loading</div>}>
						<CreateChannelModal
							server_id={channel.length && channel[0]._id}
							handleClick={handleClick}
							setChannel={setChannel}
						/>
					</Suspense>
				</div>

				{channel
					? channel.length && (
							<>
								{channel[0].channels.map((chan, i) => (
									<div
										key={i}
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
										<div {...channelDelete}>Delete Channel (Hold)</div>
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
