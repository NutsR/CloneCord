import { useState } from "react";
import { useUser } from "../../hooks/user";
import SelectLogo from "../../dist/downarrow.png";
import DropDown from "../dropdowns/dropdown-component";
import { Link, useNavigate } from "react-router-dom";
import { months, days, years } from "../../utils/item.js";
import {
	Container,
	RegisterCard,
	Input,
	Label,
	MainTitle,
	ContainerDob,
	Month,
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
		<Container>
			{!user._id && (
				<RegisterCard>
					<MainTitle>Create an Account</MainTitle>
					<form onSubmit={handleSubmit}>
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

						<ContainerDob>
							<Month id="month" onClick={handleDobClick}>
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
							</Month>
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
						</ContainerDob>
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
