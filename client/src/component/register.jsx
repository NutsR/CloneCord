import { useState } from "react";
import { useUser } from "../hooks/user";
import SelectLogo from "../dist/downarrow.png";
import DropDown from "./dropdown-component";
import { Link } from "react-router-dom";
import { months, days, years } from "../utils/item.js";
function Register({ handleClick }) {
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
	const [state, setState] = useState({
		month: false,
		year: false,
		day: false,
	});
	const [dobstate, setDobState] = useState({ month: "", day: 0, year: 0 });
	const handleDobClick = (e) => {
		switch (e.target.id) {
			case "month":
				setState({ month: !state.month, day: false, year: false });
				break;
			case "year":
				setState({ month: false, day: false, year: !state.year });
				break;
			case "day":
				setState({ month: false, day: !state.day, year: false });
				break;
			default:
				setState({ month: false, day: false, year: false });
				break;
		}
	};
	const handleDobChange = (e, id) => {
		if (id === "months") {
			setDobState({ ...dobstate, month: e.target.id });
			return setState({ ...state, month: false });
		} else if (id === "years") {
			setDobState({ ...dobstate, year: e.target.id });
			return setState({ ...state, year: false });
		}
		setDobState({ ...dobstate, day: e.target.id });
		setState({ ...state, day: false });
	};
	return (
		<>
			{!user.id && (
				<div className="form-card register">
					<h2 className="main-title">Create an Account</h2>
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
							<div
								className="select-opt-mm"
								id="month"
								onClick={handleDobClick}
							>
								{!dobstate.month ? (
									"Select"
								) : (
									<span className="selected">{dobstate.month}</span>
								)}
								<div className="select-arrow" id="month">
									<img src={SelectLogo} alt="select" id="month" />
								</div>
								{state.month && (
									<DropDown
										valueArray={months}
										divClass={"dropdown-mm"}
										divId={"months"}
										handleClose={setState}
										handleClick={handleDobChange}
										selected={dobstate.month}
									/>
								)}
							</div>
							<div className="select-opt-dd" id="day" onClick={handleDobClick}>
								{!dobstate.day ? (
									"Select"
								) : (
									<span className="selected">{dobstate.day}</span>
								)}
								<div className="select-arrow" id="day">
									<img src={SelectLogo} alt="select" id="day" />
								</div>
								{state.day && (
									<DropDown
										valueArray={days}
										divClass={"dropdown-dd"}
										divId={"days"}
										handleClose={setState}
										selected={dobstate.day}
										handleClick={handleDobChange}
									/>
								)}
							</div>
							<div className="select-opt-yy" id="year" onClick={handleDobClick}>
								{!dobstate.year ? (
									"Select"
								) : (
									<span className="selected">{dobstate.year}</span>
								)}
								<div className="select-arrow" id="year">
									<img src={SelectLogo} alt="select" id="year" />
								</div>
								{state.year && (
									<DropDown
										valueArray={years}
										divClass={"dropdown-yy"}
										divId={"years"}
										selected={dobstate.year}
										handleClose={setState}
										handleClick={handleDobChange}
									/>
								)}
							</div>
						</div>
						<button className="btn btn-login">Continue</button>
						<Link to="/login">
							<div
								className="have-an-account link-text"
								onClick={handleClick}
								id="login"
							>
								Already have an account?
							</div>
						</Link>
						<div className="terms-service">
							By registering, you agree to{" "}
							<span className="link-text">Nothing</span>
						</div>
					</form>
				</div>
			)}
		</>
	);
}

export default Register;
