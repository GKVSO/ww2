export default function setCSSVariables() {
	const containerWidth = document.querySelector('#headerNav').offsetWidth;
	document.documentElement.style.setProperty(
		'--container-width',
		`${containerWidth}px`
	);

	const navDropdownTop = document.querySelector('.navbar-drop').offsetHeight;
	document.documentElement.style.setProperty(
		'--nav-dropdown-top',
		`${navDropdownTop}px`
	);

	const navDropdownLeft = document.querySelector('#headerNav').offsetLeft;
	document.documentElement.style.setProperty(
		'--nav-dropdown-left',
		`${navDropdownLeft}px`
	);
}
