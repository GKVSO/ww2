export default function thumbnailSlider() {
	const thumbnailSlider = document.querySelector('.thumbnail-slider');
	const childrenThumbnailSlider = [...thumbnailSlider.children].reverse();

	// Убираем класс для последнего видимого элемента в слайдере
	childrenThumbnailSlider.forEach((child, index) => {
		child.classList.remove('thumbnail-slider__last');
	});

	// Устанавливаем класс для последнего видимого элемента в слайдере
	for (const child of childrenThumbnailSlider) {
		if (
			child.getBoundingClientRect().left + 20 <
			thumbnailSlider.getBoundingClientRect().right
		) {
			child.classList.add('thumbnail-slider__last');
			break;
		}
	}

	// Устанавливаем css переменные для слайдера
	const containerWidth = document.querySelector('.thumbnail-slider');

	containerWidth.style.setProperty(
		'--container-width',
		containerWidth.offsetWidth
	);
}
