import { useRef, useEffect } from "react";
function DropDown({
	valueArray,
	divClass,
	handleClick,
	handleClose,
	divId,
	selected,
}) {
	const resultsRef = useRef();
	useEffect(() => {
		const handler = (event) => {
			if (!resultsRef.current.contains(event.target)) {
				handleClose({ year: false, month: false, day: false });
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	});
	return (
		<div className={divClass} ref={resultsRef}>
			<ul className="dropdown-ul">
				{valueArray.map((value, i) => (
					<li
						key={i}
						className={`dropdown-item ${
							value.toString() === selected ? "selection" : ""
						}`}
						id={value}
						onClick={(e) => handleClick(e, divId)}
					>
						{value}
					</li>
				))}
			</ul>
		</div>
	);
}

export default DropDown;
