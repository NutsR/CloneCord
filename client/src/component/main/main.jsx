import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/user";
import Servers from "../server/servers";
import "../../styles/styles.css";

function Main() {
	const { user, loader, checkLogin } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		checkLogin();
		if (!loader) {
			if (!user._id) {
				navigate("/login");
			}
		}
	}, [loader, user._id, navigate, checkLogin]);
	return (
		<div className="main-container">
			<Servers />
			<Outlet />
		</div>
	);
}

export default Main;
