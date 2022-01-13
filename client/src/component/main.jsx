import { useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/user";
import Servers from "./servers";
import { SocketContext } from "../hooks/socket.io.context";
import "../styles/styles.css";

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
		<div className="main-container">
			<Servers />
			<Outlet />
		</div>
	);
}

export default Main;
