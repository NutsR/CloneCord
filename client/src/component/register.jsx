import { useState } from "react";
import { useUser } from "../hooks/user";
function Register() {
	const { user, checkLogin } = useUser();
	const objState = {
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	};
	const [userObj, setUserObj] = useState(objState);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserObj({ ...userObj, [name]: value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("http://localhost:3001/api/register", {
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
	console.log(user);
	return (
		<>
			{!user.id && (
				<form onSubmit={handleSubmit}>
					<div>
						<input
							type="text"
							value={userObj.username}
							name="username"
							onChange={handleChange}
						/>
						<label htmlFor="username">Username</label>
					</div>
					<div>
						<input
							type="email"
							value={userObj.email}
							name="email"
							onChange={handleChange}
						/>
						<label htmlFor="email">Email (Invalids Ok)</label>
					</div>
					<div>
						<input
							type="password"
							value={userObj.password}
							name="password"
							onChange={handleChange}
						/>
						<label htmlFor="password">Password (don't type real ones)</label>
					</div>
					<div>
						<input
							type="password"
							value={userObj.confirmPassword}
							name="confirmPassword"
							onChange={handleChange}
						/>
						<label htmlFor="confirmPassword">
							Password (don't type real ones)
						</label>
					</div>
					<button>Register</button>
				</form>
			)}
		</>
	);
}

export default Register;
