import { useEffect, useState } from "react";
import { useUser } from "../../hooks/user";
import { Link, useNavigate } from "react-router-dom";
function Login({ handleClick }) {
	const navigate = useNavigate();
	const { user, checkLogin } = useUser();
	const [userObj, setUserObj] = useState({ username: "", password: "" });
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserObj({ ...userObj, [name]: value });
	};
	const handleSubmit = async (e) => {
		if (user._id) {
			navigate("/channels");
		}
		e.preventDefault();
		await fetch(`${process.env.REACT_APP_public_url || ""}api/login`, {
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
	useEffect(() => {
		if (user._id) {
			navigate("/channels/@me");
		}
	});
	return (
		<div className="container">
			{!user._id && (
				<div className="form-card login">
					<h2 className="main-title">Welcome back to CloneCord</h2>
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
							<Link to="/register">
								<span className="link-text" onClick={handleClick} id="register">
									{" "}
									Register
								</span>
							</Link>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default Login;
