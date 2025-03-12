import { Collapse } from 'bootstrap';

export default function toggleCurrentOrder() {
	const itemsWrapper = document.querySelectorAll('.order-item-wrapper');

	itemsWrapper.forEach((itemWrapper) => {
		const orderItem = document.querySelector('.order-item');
		const orderItemFull = document.querySelector('.order-item-full');

		orderItem.collapse = new Collapse(orderItemFull, { toggle: false });
		orderItemFull.classList.add('collapse');

		orderItem.addEventListener('click', function (event) {
			this.classList.toggle('active');
			this.collapse.toggle();
		});
	});
}
