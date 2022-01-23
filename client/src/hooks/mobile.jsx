const handleMenuShow = (show, setShow, str) => {
	const server = document.getElementById("server");
	const channel = document.getElementById(str);
	if (!show) {
		setShow(true);
		server.style.transform = "translateX(0%)";

		channel.style.transform = "translateX(0%)";
		channel.style.zIndex = "100000";

		return;
	}
	server.style.transform = "translateX(-100vw)";

	channel.style.transform = "translateX(-100vw)";

	setShow(false);
};
export default handleMenuShow;

export const handleUserShow = (showUsers, setShowUsers) => {
	const users = document.getElementById("users");
	if (!showUsers) {
		setShowUsers(true);
		users.style.transform = "translateX(0%)";
		return;
	}
	users.style.transform = "translateX(100vw)";
	setShowUsers(false);
};
