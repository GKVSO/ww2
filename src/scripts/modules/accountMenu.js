import { Collapse } from 'bootstrap';

export default function accountMenu(selectorNav) {
	const elNav = document.querySelector(selectorNav);
	const elNavItems = elNav.querySelectorAll('.left-bar__menu-item');

	elNavItems.forEach((navItem) => {
		const link = navItem.querySelector('a');
		const subList = navItem.querySelector('ul');

		link.collapse = new Collapse(subList, {
			toggle: false,
		});
		subList.classList.add('collapse');

		link.addEventListener('click', function (event) {
			event.preventDefault();
			this.collapse.toggle();
		});
	});
}
