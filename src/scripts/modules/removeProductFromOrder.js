export default function removeProductFromOrder() {
	const productColumn = document.querySelectorAll('.order-product-column');

	productColumn.forEach((column) => {
		const removeButton = column.querySelector('.btn-order-remove');

		if (!removeButton) return;

		const divider = column.nextElementSibling;

		removeButton.addEventListener('click', function () {
			column.remove();
			if (divider.classList.contains('divider')) divider.remove();
		});
	});
}
