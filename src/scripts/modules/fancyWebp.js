export default function fancyWebp() {
	if (!checkSupportWebp()) return;

	const fancysImages = document.querySelectorAll('a[data-fancybox]');

	fancysImages.forEach((image) => {
		const source = image.querySelector('source');
		const srcset = source.srcset;

		image.href = srcset;
	});
}

function checkSupportWebp() {
	const elem = document.createElement('canvas');

	if (!!(elem.getContext && elem.getContext('2d'))) {
		// was able or not to get WebP representation
		return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
	} else {
		// very old browser like IE 8, canvas not supported
		return false;
	}
}
