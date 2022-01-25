import { useEffect, useState } from "react";
import { useUser } from "../../hooks/user";
import { Link, useNavigate } from "react-router-dom";
import {
	BtnLogin,
	Container,
	LoginCard,
	Input,
	Label,
	FormItem,
	MainTitle,
	LinkText,
	LinkPara,
} from "./login-styled";
function Login() {
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
		await fetch(`${process.env.REACT_APP_public_url || ""}/api/login`, {
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
		<Container>
			{!user._id && (
				<LoginCard>
					<MainTitle>Welcome back to CloneCord</MainTitle>
					<form onSubmit={handleSubmit} autoComplete="off">
						<FormItem>
							<Label htmlFor="username">USERNAME</Label>
							<Input
								type="text"
								name="username"
								onChange={handleChange}
								value={userObj.username}
								className="input"
							/>
						</FormItem>
						<FormItem>
							<Label htmlFor="password">PASSWORD</Label>
							<Input
								type="password"
								name="password"
								onChange={handleChange}
								value={userObj.password}
								className="input"
							/>

							<LinkText>Forget your password?</LinkText>
						</FormItem>

						<BtnLogin>Login</BtnLogin>
						<LinkPara>
							Need an account?
							<Link to="/register">
								<LinkText style={{ display: "inline" }}> Register</LinkText>
							</Link>
						</LinkPara>
					</form>
				</LoginCard>
			)}
		</Container>
	);
}

export default Login;
