import { useState } from "react";
import { useUser } from "../hooks/user";
function Register({ handleClick }) {
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
		await fetch("http://localhost:3001/api/register", {
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
						<label htmlFor="email" className="placeholderText">
							EMAIL
						</label>
						<input
							type="email"
							value={userObj.email}
							name="email"
							onChange={handleChange}
							className="input"
						/>
					</div>
					<div>
						<label htmlFor="username" className="placeholderText">
							USERNAME
						</label>
						<input
							type="text"
							value={userObj.username}
							name="username"
							onChange={handleChange}
							className="input"
						/>
					</div>

					<div>
						<label htmlFor="password" className="placeholderText">
							PASSWORD
						</label>
						<input
							type="password"
							value={userObj.password}
							name="password"
							onChange={handleChange}
							className="input"
						/>
					</div>
					<div className="placeholderText">DATE OF BIRTH</div>
					<div className="container-dob">
						<div className="select-opt-mm">Select</div>
						<div className="select-opt-dd">Select</div>
						<div className="select-opt-yy">Select</div>
					</div>
					<button className="btn btn-login">Continue</button>
					<div
						className="have-an-account link-text"
						onClick={handleClick}
						id="login"
					>
						Already have an account?
					</div>
					<div className="terms-service">
						By registering, you agree to Discord's
						<span className="link-text"> Terms of Service</span> and{" "}
						<span className="link-text">Privacy Policy</span>
					</div>
				</form>
			)}
		</>
	);
}

export default Register;
