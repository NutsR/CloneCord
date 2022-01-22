import styled from "styled-components";

const ServerContainer = styled.div`
	display: flex;
	position: fixed;
	height: 100%;
	flex-direction: column;
	width: 6%;
	background-color: #202225;
	color: #8e9297;
	font-size: 16px;
	line-height: 16px;
	font-weight: 600;
	overflow-y: scroll;
	align-items: flex-end;
	scrollbar-width: none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		display: none;
	}
`;
const ServerIcon = styled.div`
	text-transform: capitalize;
	display: block;
	font-size: 1em;
	width: 3.1em;
	height: 3.1em;
	line-height: 3em;
	text-align: center;
	border-radius: 50%;
	background: #36393f;
	vertical-align: middle;
	color: white;
	margin: 5px 0;
	margin-right: 15px;
`;
const ContextMenu = styled.div`
	position: absolute;
	display: none;
	border-radius: 5px;
	width: 120px;
	padding: 10px 10px;
	background-color: #18191c;
	text-align: center;
	color: #ffffff;
	border: 3px solid #18191c;
	background: linear-gradient(to left, #18191c 50%, #ed424e 50%) right;
	background-size: 200%;
	transition: 1s ease-out;
	cursor: pointer;
	z-index: 10000;
	&:active {
		background-position: left;
		transition: 2s ease-out;
	}
	&.creator {
		background: #18191c;
	}
`;
export { ServerContainer, ServerIcon, ContextMenu };
