import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import UserProvider from "./hooks/user";
import { BrowserRouter as Router } from "react-router-dom";
import { SocketContext, socket } from "./hooks/socket.io.context";
import ChannelProvider from "./hooks/channel";

ReactDOM.render(
	<React.StrictMode>
		<SocketContext.Provider value={socket}>
			<Router>
				<UserProvider>
					<ChannelProvider>
						<App />
					</ChannelProvider>
				</UserProvider>
			</Router>
		</SocketContext.Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
