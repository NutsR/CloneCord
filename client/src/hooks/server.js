import { useContext, createContext, useState, useEffect } from "react";
import { useUser } from "./user";
const ServerContext = createContext();
export const useServer = () => {
	return useContext(ServerContext);
};
function ServerProvider({ children }) {
	const [server, setServer] = useState({});
	const { user } = useUser();
	useEffect(() => {
		if (user._id) {
			setServer(user.server);
		}
	}, [user._id, user.server]);
	return (
		<ServerContext.Provider value={{ server, setServer }}>
			{children}
		</ServerContext.Provider>
	);
}
export default ServerProvider;
