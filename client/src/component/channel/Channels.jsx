import { useParams, Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../../hooks/socket.io.context";
import { useContext, useEffect, useState, useRef, Suspense, lazy } from "react";
import { useSelect } from "../../hooks/channel";
import Chat from "../chat/chat";
import { useServer } from "../../hooks/server";
import ProfileDropdown from "../dropdowns/profile";
import { useUser } from "../../hooks/user";
import useLongPress from "../../hooks/Longpress";
import Logout from "../Login-register/logout";
import useWindowDimensions from "../../hooks/windowSize";
import {
	ChannelContainer,
	ChannelTitle,
	ServerInfo,
	ServerDetailed,
	ServerId,
	ContextMenu,
	ChannelSubtitle,
	CategoryName,
	ChannelLink,
	Hashtag,
	ServerUsers,
	User,
	Online,
} from "./channel-styled";
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
	const { width } = useWindowDimensions();
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
		} else {
			navigate("/channels/@me");
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
			<ChannelContainer id="channel">
				<ChannelTitle>
					{channel.length && (
						<div>
							<ServerInfo
								onClick={(e) => {
									setServMenu(!servMenu);
									if (serverRef.current) {
										serverRef.current.style.left = `${e.pageX}px`;
										serverRef.current.style.top = e.pageY + "px";
									}
								}}
							>
								&#8942;
							</ServerInfo>

							<div>{channel[0].server_name}</div>
							<div>id: {channel[0]._id}</div>
						</div>
					)}
					{servMenu && user._id === channel[0].creator ? (
						<ServerDetailed ref={serverRef}>
							<div {...serverDelete}>Delete Server (hold)</div>
						</ServerDetailed>
					) : servMenu ? (
						<ServerId ref={serverRef}>{channel[0]._id} Invite ID</ServerId>
					) : null}
				</ChannelTitle>
				<ChannelSubtitle>
					<CategoryName> {" >"} Text Channels</CategoryName>{" "}
					<Suspense fallback={<div>Loading</div>}>
						<CreateChannelModal
							server_id={channel.length && channel[0]._id}
							handleClick={handleClick}
							setChannel={setChannel}
						/>
					</Suspense>
				</ChannelSubtitle>

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
									>
										<Link to={`/channels/${chan._id}`}>
											<ChannelLink
												className={`${
													selected._id === chan._id ? "channel-selected" : ""
												}`}
											>
												<Hashtag>#</Hashtag>
												{chan.name}
											</ChannelLink>
										</Link>
									</div>
								))}
								<ContextMenu ref={channelsRef}>
									{menu.id && (
										<div {...channelDelete}>Delete Channel (Hold)</div>
									)}
								</ContextMenu>
							</>
					  )
					: null}
				<Logout />
			</ChannelContainer>

			{selected._id && <Chat />}
			<ServerUsers id="users">
				<Online>Users- {channel.length && channel[0].users.length}</Online>
				<div>
					{channel.length &&
						channel[0].users.map((userObj, i) => (
							<div key={i}>
								<User
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
								</User>
							</div>
						))}
					{profile._id && (
						<ProfileDropdown userObj={profile} showProfile={showProfile} />
					)}
				</div>
			</ServerUsers>
		</>
	);
}
export default Channels;
