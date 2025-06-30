import { Tab } from 'bootstrap';

export default function catalogTopNavigation() {
	const triggerTabList = document.querySelectorAll('.nav-link-catalog')
	triggerTabList.forEach(triggerEl => {
		const tabTrigger = new Tab(triggerEl)

		triggerEl.addEventListener('mouseenter', event => {
			event.preventDefault()

			tabTrigger.show()
		 })

		triggerEl.addEventListener('click', event => {
			window.location.replace(triggerEl.getAttribute("href"))
		})
	});
}