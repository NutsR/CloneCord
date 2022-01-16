import { useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/user";
import Servers from "../server/servers";
import { SocketContext } from "../../hooks/socket.io.context";
import "../../styles/styles.css";
import Logout from "../Login-register/logout";

function Main() {
	const socket = useContext(SocketContext);
	const { user, loader, checkLogin } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		checkLogin();
		if (!loader) {
			if (!user._id) {
				navigate("/login");
			}
		}
	}, [loader, user._id, navigate]);
	return (
		<>
			{loader ? (
				<div className="loading-div">Loading</div>
			) : (
				<div className="main-container">
					<Servers />
					<Outlet />
					<Logout />
				</div>
			)}
		</>
	);
}

export default Main;
