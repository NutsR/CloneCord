import { useState, useContext, useRef, useEffect, Suspense, lazy } from "react";
import { useUser } from "../../hooks/user";
import { useSelect } from "../../hooks/channel";
import { Link } from "react-router-dom";
import { ContextMenu, ServerContainer, ServerIcon } from "./server-styled";
import { SocketContext } from "../../hooks/socket.io.context";
import { useServer } from "../../hooks/server";
import useLongPress from "../../hooks/Longpress";
const JoinServer = lazy(() => import("./joinServer"));
function Servers() {
	const { user, setUser } = useUser();
	const { server, setServer } = useServer();
	const socket = useContext(SocketContext);
	const { setSelected } = useSelect();
	const serverRef = useRef();
	const [menu, setMenu] = useState({});
	const longPress = useLongPress(handleLeave, () => console.log("nothing"), {
		delay: 1950,
	});
	const handleServerSel = (server) => {
		setSelected(server.channels[0]);
		socket.emit("join-channel", server.channels[0]._id);
	};
	const closeMenu = (e) => {
		if (serverRef.current && !serverRef.current.contains(e.target)) {
			setMenu({});
			serverRef.current.style.display = "none";
		}
	};
	useEffect(() => {
		document.addEventListener("mousedown", closeMenu);
		return () => {
			document.removeEventListener("mousedown", closeMenu);
		};
	});
	async function handleLeave() {
		const id = menu._id;
		if (id) {
			const res = await fetch(
				`${process.env.REACT_APP_public_url}/api/server/leave`,
				{
					mode: "cors",
					headers: { "Content-Type": "application/json" },
					method: "post",
					body: JSON.stringify({ id, user }),
				}
			);
			const data = await res.json();
			if (data.success) {
				setMenu({});
				serverRef.current.style.display = "none";
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
			}
		}
	}
	return (
		<>
			<ServerContainer id="server">
				<Link to="/channels/@me">
					<ServerIcon>Home</ServerIcon>
					<hr className="home" />
				</Link>

				{user._id
					? server.length &&
					  server.map((s, i) => (
							<div
								key={i}
								onClick={() => {
									setMenu({});
									if (serverRef.current) {
										serverRef.current.style.display = "none";
									}
								}}
								onContextMenu={(e) => {
									e.preventDefault();
									if (serverRef.current) {
										serverRef.current.style.left = `${
											e.pageX > 200 ? e.pageX - 70 : e.pageX - 25
										}px`;
										serverRef.current.style.top = e.pageY + "px";
										serverRef.current.style.display = "block";
										setMenu(s);
									}
								}}
							>
								<Link to={`/channels/${s.channels[0]._id}`}>
									<ServerIcon onClick={() => handleServerSel(s)}>
										{s.server_name.indexOf(" ") >= 1
											? s.server_name.split(" ")[1].charAt(0)
											: s.server_name.charAt(0)}
									</ServerIcon>
								</Link>
							</div>
					  ))
					: null}
				<Suspense fallback={<div>Loading</div>}>
					<JoinServer handleServerSel={handleServerSel} />
				</Suspense>
			</ServerContainer>

			<ContextMenu
				ref={serverRef}
				className={`${menu.creator === user._id && "creator"}`}
			>
				{menu._id && menu.creator === user._id ? (
					<div>Creator</div>
				) : (
					<div {...longPress}>Leave Server</div>
				)}
			</ContextMenu>
		</>
	);
}
export default Servers;
