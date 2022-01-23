import styled from "styled-components";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;
const FormCard = styled.div`
	background-color: #36393f;
	padding: 15px 32px;
	color: white;
	border-radius: 5px;
	border: 1px #222428 solid;
`;

const LoginCard = styled(FormCard)`
	margin-top: 100px;
`;

const RegisterCard = styled(FormCard)`
	margin-top: 50px;
	@media (max-width: 800px) {
		margin-top: 25px;
	}
`;

const MainTitle = styled.h2`
	text-align: center;
	margin-top: 5px;
`;

const FormItem = styled.div`
	margin: 10px 0px;
`;

const Input = styled.input`
	margin: 5px 0;
	margin-bottom: 7px;
	width: 30vw;
	height: 6vh;
	border-radius: 5px;
	background-color: #313339;
	border: 1px #222428 solid;
	color: white;
	padding-left: 10px;
	padding-right: 5px;
	&:focus {
		outline: none;
		border: 1px solid #00aff4;
	}
	@media (max-width: 800px) {
		width: 90% !important;
	}
`;

const Label = styled.label`
	display: block;
	font-size: 12px;
	color: #b9bbbe;
	line-height: 16px;
	font-weight: 600;
	margin: 15px 0 5px 0;
`;
const BtnLogin = styled.button`
	padding: 15px 32px;
	margin-top: 13px;
	width: 31vw;
	background-color: #5865f2;
	border-radius: 5px;
	border: none;
	color: white;
	font-weight: 600;
	font-size: small;
`;
const LinkPara = styled.div`
	color: #72767d;
	margin-bottom: 25px;
	font-size: small;
`;
const LinkText = styled.div`
	color: #00aff4;
	font-size: small;
	cursor: pointer;
	text-decoration: none !important;
`;

const ContainerDob = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	max-width: 100%;
`;

const Dob = styled.div`
	background-color: #313339;
	margin-right: 10px;
	display: flex;
	justify-content: space-between;
`;
const Month = styled(Dob)`
	width: 35%;
	height: 20px;
	color: #72767d;
	border: 1px solid #282a2e;
	border-radius: 5px;
	padding: 10px 10px;
`;
const TermService = styled.div`
	margin: 20px 0;
	font-size: 12px !important;
	line-height: 16px;
	color: #72767d;
`;
export {
	Container,
	LoginCard,
	RegisterCard,
	Input,
	Label,
	BtnLogin,
	FormItem,
	MainTitle,
	LinkText,
	LinkPara,
	ContainerDob,
	Month,
	TermService,
};
