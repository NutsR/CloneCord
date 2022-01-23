import styled from "styled-components";
const Header = styled.div`
	position: fixed;
	left: 23%;
	display: flex;
	align-items: center;
	font-weight: 600;
	height: 9.45%;
	background-color: #2f3136;
	color: #ffffff;
	width: 61%;
	border-bottom: 3px solid #2b2e33;
	top: 0;
	vertical-align: bottom;
	@media (max-width: 800px) {
		width: 100%;
		left: 0%;
	}
`;

const DmHeader = styled(Header)`
	width: 77%;
	@media (max-width: 800px) {
		width: 100%;
		z-index: 1;
	}
`;
const ChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	min-width: 61%;
	background-color: #36393f;
	color: #dcddde;
	margin-right: 20%;
	margin-left: 23%;
	min-height: 0;
	@media (max-width: 800px) {
		min-width: 100%;
		margin-left: 0%;
	}
`;
const DmContainer = styled(ChatContainer)`
	margin-right: unset;
	margin-left: 23%;
	min-width: 77%;
	width: 100%;
	@media (max-width: 800px) {
		margin-left: 0%;
		margin-right: 0;
		position: absolute;
		min-width: 100%;
	}
`;
const ChatMessages = styled.div`
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
	margin-top: 10px;
	scrollbar-color: #202225 #2f3136;
	height: 90vh;
	@media (max-width: 800px) {
		height: 87vh;
		margin-right: 10px;
		margin-bottom: 20px;
	}
`;
const ChatInput = styled.form`
	position: fixed;
	bottom: 0;
	background-color: #36393f;
	width: 59.7%;

	& > input {
		width: 80%;
		box-sizing: border-box;
		margin: 5px 0px;
		margin-top: none;
		margin-bottom: 7px;
		height: 6vh;
		border-radius: 5px;
		background-color: #40444b;
		border: none;
		color: white;
		padding-left: 10px;
		padding-right: 5px;
		overflow-wrap: break-word;
		margin-left: 10px;
	}

	& > input:focus {
		outline: none;
	}
	@media (max-width: 800px) {
		height: 6vh;
		width: 99%;
		bottom: 0;
	}
`;
const DmInput = styled(ChatInput)`
	width: 77%;

	@media (max-width: 800px) {
		width: 100%;
		height: 10vh;
	}
`;
const NoMessages = styled.div`
	font-size: 25px;
	text-align: center;
	vertical-align: middle;
	margin-top: 50%;
	font-weight: 600;
`;

export {
	DmHeader,
	DmContainer,
	Header,
	ChatContainer,
	ChatMessages,
	ChatInput,
	DmInput,
	NoMessages,
};
