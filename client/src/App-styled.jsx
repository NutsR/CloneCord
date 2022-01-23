import styled from "styled-components";

const LoadingDiv = styled.div`
	width: 100vw;
	height: 100vh;
	position: absolute;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #202225;
	color: white;
`;

const CloseMenu = styled.div`
	z-index: 100001;
	position: absolute;
	width: 10%;
	font-weight: 600;
	padding: 2px;
	color: #ffffff;
	right: 20px;
	cursor: pointer;
`;
const Trigram = styled.div`
	font-weight: 600;
	margin-right: 20px;
	margin-left: 10px;
	padding: 5px;
	cursor: pointer;
	display: inline;
	z-index: 10;
	color: #ffffff;
`;
export default LoadingDiv;
export { Trigram, CloseMenu };
