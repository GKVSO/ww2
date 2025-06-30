import { Collapse } from 'bootstrap';

export function toggleCatalogMenu() {
	const catalogMobileContainer = document.querySelector('.catalog-menu');
	const openMenuBtns = document.querySelectorAll('#open-menu');

	openMenuBtns.forEach((btn) => {
		btn.addEventListener('click', () => {
			console.log('test');
			catalogMobileContainer.classList.toggle('show');
		});
	});
}

export function createDropdownFunction(selector) {
	const nodeList = document.querySelectorAll(selector);
	if (!nodeList || nodeList.length === 0) return;

	const lastOpenTime = new Map();
	const subMenuMap = createSubMenuMap();

	return function () {
		nodeList.forEach((node) => {
			const targetSubMenu = subMenuMap.get(node);
			if (!targetSubMenu) return;

			const collapse = new Collapse(targetSubMenu, { toggle: false });
			targetSubMenu.classList.add('collapse');

			node.addEventListener('click', function (event) {
				if (event.target.parentElement !== node) return;
				if (!isPreventDefault(this)) return;

				event.preventDefault();

				collapse.toggle();

				collapseAll(targetSubMenu);
			});
		});
	};

	function collapseAll(targetSubMenu) {
		for (const [key, value] of subMenuMap) {
			if (value === targetSubMenu || !value) continue;

			Collapse.getInstance(value).hide();
		}
	}

	function createSubMenuMap() {
		const result = new Map();

		nodeList.forEach((node) => {
			const subMenu = node.querySelector('[data-dropdown]');
			result.set(node, subMenu);
		});

		return result;
	}

	function isPreventDefault(node) {
		if (!lastOpenTime.has(node)) {
			lastOpenTime.clear();
			lastOpenTime.set(node, Date.now());
			return true;
		}

		const timeDiff = Date.now() - lastOpenTime.get(node);

		if (timeDiff > 1500) {
			lastOpenTime.clear();
			return true;
		}

		console.log('prevent defult');
		return false;
	}
}
