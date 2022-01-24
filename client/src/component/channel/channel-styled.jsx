import styled from "styled-components";
const ChannelContainer = styled.div`
	width: 17%;
	background-color: #2f3136;
	color: #ffffff;
	position: absolute;
	margin-left: 6%;
	height: 100%;
	> a {
		color: #ffffff !important;
		text-decoration: none !important;
	}
	@media (max-width: 800px) {
		position: fixed;
		left: 0;
		margin-left: 20%;
		width: 80%;
		transform: translateX(-100vw);
		transition: transform 300ms ease-out;
	}
`;
const ChannelTitle = styled.div`
	padding: 15px 32px;
	padding-left: 12px;
	font-size: 16px;
	line-height: 16px;
	font-weight: 600;
	border-bottom: 3px solid #2b2e33;
`;

const ServerInfo = styled.div`
	position: relative;
	font-size: 35px;
	margin-top: 10px;
	font-weight: 700;
	float: right;
	cursor: pointer;
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
const ServerDetailed = styled(ContextMenu)`
	position: absolute;
	display: block !important;
`;
const ServerId = styled(ServerDetailed)`
	background: #18191c;
	cursor: default;
`;

const ChannelSubtitle = styled.div`
	color: #8e9297;
	margin-top: 10px;
	margin-bottom: 5px;
	text-transform: uppercase;
	font-size: 13px;
	font-weight: 600;
	outline: #393c42;
	display: flex;
	justify-content: space-between;
`;
const CategoryName = styled.span`
	margin-left: 5px;
	&:hover {
		color: #dcddde;
	}
`;
const ChannelLink = styled.span`
	color: #8e9297;
	text-decoration: none !important;
	display: block;
	text-transform: lowercase;
	font-size: 16px;
	margin: 5px 10px;
	padding: 10px;
	font-weight: 600;

	&:hover {
		background-color: #393c42;
		transition: margin-right, margin-left 0.2s linear;
		border-radius: 5px;
	}
	&.channel-selected {
		color: #ffffff;
		background-color: #393c42;
		border-radius: 5px;
		font-weight: 600;
		transition: margin-right, margin-left 0.2s linear;
	}
`;
const Hashtag = styled.span`
	font-size: 22px;
	margin: 0 5px;
	color: #8e8e8e;
	font-weight: 600;
`;
const ServerUsers = styled.div`
	position: fixed;
	right: 0;
	height: 100%;
	bottom: 0;
	background-color: #2f3136;
	width: 16%;
	color: #ffffff;
	@media (max-width: 800px) {
		transform: translateX(100vw);
		width: 50%;
		transition: transform 300ms ease-out;
	}
`;
const User = styled.div`
	font-size: 16px;
	color: #8e8e8e;
	padding: 15px 32px;
	font-weight: 600;
	line-height: 16px;
	border-radius: 5px;

	&:hover {
		background-color: #393c42;
		color: #ffffff;
	}
`;
const Online = styled.div`
	font-size: 16px;
	color: #8e8e8e;
	font-weight: 600;
	line-height: 16px;
	padding: 12px 28px;
`;

const ContactTitle = styled.div`
	padding: 10px 10px;
	font-size: 13px;
	color: #8e9297;
	text-transform: uppercase;
	font-weight: 600;
	margin-left: 10px;
`;
const DirectMessages = styled.div`
	position: absolute;
	margin-left: 6%;
	background-color: #2f3136;
	height: 100%;
	color: #ffffff;
	width: 17%;
	@media (max-width: 800px) {
		transform: translateX(-100vw);
		position: fixed;
		width: 80%;
		margin-left: 20%;
		transition: transform 300ms linear;
	}
`;
const DmLists = styled.div`
	padding: 5px 5px;
	color: #8e9297;
	font-weight: 600;
	font-size: 14px;
`;
const DmUsers = styled.div`
	display: flex;
	align-items: center;
	height: 50px;
	&:hover {
		background-color: rgba(57, 60, 66, 0.7);
		border-radius: 5px;
		cursor: pointer;
	}
`;
const ProfilePic = styled.div`
	margin-left: 5px;
	> img {
		width: 35px;
	}
`;
const ChatEmpty = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 77%;
	font-weight: 600;
	background-color: #36393f;
	color: #dcddde;
	margin-left: 23%;
	min-height: 0;
	@media (max-width: 800px) {
		position: absolute;
		height: 100%;
		margin-left: 0%;
		width: 100%;
	}
`;
export {
	ChannelContainer,
	ChannelTitle,
	ServerInfo,
	ServerDetailed,
	ServerId,
	ContextMenu,
	ChannelSubtitle,
	CategoryName,
	ChannelLink,
	Hashtag,
	ServerUsers,
	Online,
	User,
	ContactTitle,
	DirectMessages,
	DmLists,
	DmUsers,
	ProfilePic,
	ChatEmpty,
};
