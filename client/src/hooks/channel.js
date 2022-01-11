import { useContext, createContext, useState } from "react";
const ChannelContext = createContext();
export function useSelect() {
	return useContext(ChannelContext);
}
function ChannelProvider({ children }) {
	const [selected, setSelected] = useState({});
	console.log(selected);
	return (
		<ChannelContext.Provider value={{ selected, setSelected }}>
			{children}
		</ChannelContext.Provider>
	);
}
export default ChannelProvider;
