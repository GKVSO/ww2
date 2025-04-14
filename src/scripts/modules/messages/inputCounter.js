export default function () {
	const nodeCounters = document.querySelectorAll('.counter-input');

	nodeCounters.forEach((counter) => {
		const maxCount = counter.getAttribute('data-max-count');

		const targetSelector = counter.getAttribute('data-target');
		const targetElement = document.querySelector(targetSelector);

		renderCounter(counter, 0, maxCount);

		targetElement.addEventListener('input', function (event) {
			console.log('test');
			if (this.value.length > maxCount) {
				this.value = this.value.slice(0, maxCount);
			}

			renderCounter(counter, this.value.length, maxCount);
		});
	});

	function renderCounter(targetNode, currentCount, maxCount) {
		const result = `${currentCount}/${maxCount}`;
		targetNode.textContent = result;
	}
}
