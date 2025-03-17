export default function dynamicMenu() {
	const verticalMenu = document.querySelector('.list-group-widget');
	const backgroundItem = verticalMenu.querySelector('.background-item');
	let activeMenuItem = verticalMenu.querySelector('.active') || false;

	function setBackgroundItem(activeItem) {
		if (!activeMenuItem) return;

		const top = activeItem.offsetTop;
		const left = activeItem.offsetLeft;
		const width = activeItem.offsetWidth;
		const height = activeItem.offsetHeight;

		backgroundItem.style.setProperty('--top-active', top + 'px');
		backgroundItem.style.setProperty('--left-active', left + 'px');
		backgroundItem.style.setProperty('--width-active', width + 'px');
		backgroundItem.style.setProperty('--height-active', height + 'px');
	}

	function handleMenuItemClick(e) {
		const target = e.target;
		if (target.tagName !== 'A') return;

		activeMenuItem.classList.remove('active');
		activeMenuItem = target;
		activeMenuItem.classList.add('active');

		setBackgroundItem(activeMenuItem);
	}

	function handleMenuItemIn(e) {
		const target = e.target;
		if (target.tagName !== 'A') return;

		activeMenuItem.classList.remove('active');
		setBackgroundItem(target);
	}

	function handleMenuItemOut(e) {
		const target = e.target;
		if (target.tagName !== 'A') return;

		activeMenuItem.classList.add('active');
		setBackgroundItem(activeMenuItem);
	}

	setBackgroundItem(activeMenuItem);
	verticalMenu.addEventListener('click', handleMenuItemClick);
	verticalMenu.addEventListener('mouseover', handleMenuItemIn);
	verticalMenu.addEventListener('mouseout', handleMenuItemOut);

	const observer = new ResizeObserver((entries) => {
		for (let entry of entries) {
			console.log('Новая ширина:', entry.contentRect.width);
			setBackgroundItem(activeMenuItem);
		}
	});

	observer.observe(verticalMenu);
}
