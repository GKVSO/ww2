import { Collapse } from 'bootstrap';

export default function accountMenu(selectorNav) {
	const elNav = document.querySelector(selectorNav);
	const elNavItems = elNav.querySelectorAll('.left-bar__menu-item');

	elNavItems.forEach((navItem) => {
		const link = navItem.querySelector('a');
		const subList = navItem.querySelector('ul');

		const isToggle = hasActiveChildren(subList);

		link.collapse = new Collapse(subList, {
			toggle: isToggle,
		});
		if (!isToggle) subList.classList.add('collapse');

		link.addEventListener('click', function (event) {
			event.preventDefault();
			this.collapse.toggle();
		});
	});
}

function hasActiveChildren(targetList) {
	const isHasActive = targetList.querySelector('.active') ?? false;

	return isHasActive;
}
