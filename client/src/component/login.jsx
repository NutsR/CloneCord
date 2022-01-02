import { useState } from "react";
import { useUser } from "../hooks/user";
function Login() {
	const { user, checkLogin } = useUser();
	const [userObj, setUserObj] = useState({ username: "", password: "" });
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserObj({ ...userObj, [name]: value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("http://localhost:3001/api/login", {
			method: "POST",
			mode: "cors",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userObj),
		});
		checkLogin();
	};
	return (
		<>
			{!user.id && (
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="username">
							<input
								type="text"
								name="username"
								onChange={handleChange}
								value={userObj.username}
							/>
							<span>Username</span>
						</label>
					</div>
					<div>
						<label htmlFor="password">
							<input
								type="password"
								name="password"
								onChange={handleChange}
								value={userObj.password}
							/>
							<span>Password</span>
						</label>
					</div>
					<button>Login</button>
				</form>
			)}
		</>
	);
}

export default Login;
