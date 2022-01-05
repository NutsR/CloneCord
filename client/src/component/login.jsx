import { useState } from "react";
import { useUser } from "../hooks/user";
function Login({ handleClick }) {
	const { user, checkLogin } = useUser();
	const [userObj, setUserObj] = useState({ username: "", password: "" });
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserObj({ ...userObj, [name]: value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		await fetch("http://localhost:3001/api/login", {
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
					<div className="form-item">
						<label htmlFor="username">
							<span className="placeholderText">USERNAME</span>
							<input
								type="text"
								name="username"
								onChange={handleChange}
								value={userObj.username}
								className="input"
							/>
						</label>
					</div>
					<div className="form-item">
						<label htmlFor="password">
							<span className="placeholderText">PASSWORD</span>
							<input
								type="password"
								name="password"
								onChange={handleChange}
								value={userObj.password}
								className="input"
							/>
						</label>
						<div className="link-text">Forget your password?</div>
					</div>
					<button className="btn btn-login">Login</button>
					<div className="link-para">
						Need an account?
						<span className="link-text" onClick={handleClick} id="register">
							{" "}
							Register
						</span>
					</div>
				</form>
			)}
		</>
	);
}

export default Login;
