import { useState } from "react";
import { useUser } from "../../hooks/user";
import { Link, useNavigate } from "react-router-dom";

import {
	Container,
	RegisterCard,
	Input,
	Label,
	MainTitle,
	BtnLogin,
	LinkText,
	TermService,
} from "./login-styled";
function Register({ handleClick }) {
	const navigate = useNavigate();
	const { user, checkLogin } = useUser();
	const objState = {
		username: "",
		email: "",
		password: "",
	};
	const [userObj, setUserObj] = useState(objState);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserObj({ ...userObj, [name]: value });
	};
	const handleSubmit = async (e) => {
		if (user._id) {
			navigate("/channels");
		}
		e.preventDefault();
		await fetch(`${process.env.REACT_APP_public_url}/api/register`, {
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
		<Container>
			{!user._id && (
				<RegisterCard>
					<MainTitle>Create an Account</MainTitle>
					<form onSubmit={handleSubmit} autoComplete="off">
						<Label>EMAIL</Label>
						<Input
							type="email"
							value={userObj.email}
							name="email"
							onChange={handleChange}
						/>

						<Label htmlFor="username">USERNAME</Label>
						<Input
							type="text"
							value={userObj.username}
							name="username"
							onChange={handleChange}
						/>

						<Label htmlFor="password">PASSWORD</Label>
						<Input
							type="password"
							value={userObj.password}
							name="password"
							onChange={handleChange}
						/>

						<Label>DATE OF BIRTH</Label>

						<BtnLogin>Continue</BtnLogin>
						<Link to="/login">
							<LinkText
								className="have-an-account"
								onClick={handleClick}
								id="login"
							>
								Already have an account?
							</LinkText>
						</Link>
						<TermService>
							By registering, you agree to{" "}
							<LinkText style={{ display: "inline" }}>Nothing</LinkText>
						</TermService>
					</form>
				</RegisterCard>
			)}
		</Container>
	);
}

export default Register;
