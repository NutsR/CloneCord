import { lazy, Suspense } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Login = lazy(() => import("./component/Login-register/login"));
const Main = lazy(() => import("./component/main/main"));
const Channels = lazy(() => import("./component/channel/Channels"));
const HomeChannel = lazy(() => import("./component/channel/HomeChannel"));
const Conversation = lazy(() => import("./component/chat/conversation"));
const Register = lazy(() => import("./component/Login-register/register"));
function App() {
	const location = useLocation();
	const navigate = useNavigate();
	useEffect(() => {
		if (location.pathname === "/") {
			navigate("/login");
		}
	});
	return (
		<div className="App">
			<Routes>
				<Route
					path="/channels"
					element={
						<Suspense fallback={<div className="loading-div">Loading</div>}>
							<Main />
						</Suspense>
					}
				>
					<Route
						path="/channels/@me"
						element={
							<Suspense fallback={<div className="loading-div">Loading</div>}>
								<HomeChannel />
							</Suspense>
						}
					>
						<Route
							path="/channels/@me/:id"
							element={
								<Suspense fallback={<div className="loading-div">Loading</div>}>
									<Conversation />
								</Suspense>
							}
						></Route>
					</Route>
					<Route
						path=":id"
						element={
							<Suspense fallback={<div className="loading-div">Loading</div>}>
								<Channels />
							</Suspense>
						}
					/>
				</Route>
				<Route
					path="/login"
					element={
						<Suspense fallback={<div className="loading-div">Loading</div>}>
							<Login />
						</Suspense>
					}
				/>
				<Route
					path="/register"
					element={
						<Suspense fallback={<div className="loading-div">Loading</div>}>
							<Register />
						</Suspense>
					}
				/>
			</Routes>
		</div>
	);
}

export default App;
