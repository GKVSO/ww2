document.addEventListener('DOMContentLoaded', () => {
	const timelines = document.querySelectorAll('.cd-horizontal-timeline');
	const eventsMinDistance = 100;
	let arDistances = [];

	if (timelines.length > 0) initTimeline(timelines);

	function initTimeline(timelines) {
		timelines.forEach((timeline) => {
			const timelineComponents = {
				timelineWrapper: timeline.querySelector('.events-wrapper'),
				eventsWrapper: timeline.querySelector('.events-wrapper .events'),
				fillingLine: timeline.querySelector(
					'.events-wrapper .events .filling-line'
				),
				timelineEvents: timeline.querySelectorAll('.events-wrapper .events a'),
				timelineNavigation: timeline.querySelector('.cd-timeline-navigation'),
				eventsContent: timeline.querySelector('.events-content'),
			};

			timelineComponents.timelineDates = parseDate(
				timelineComponents.timelineEvents
			);
			timelineComponents.eventsMinLapse = minLapse(
				timelineComponents.timelineDates
			);

			window.timeline = timelineComponents;

			// Выставляем позиционирование дат на временной шкале
			setDatePosition(timelineComponents, eventsMinDistance);
			const timelineTotWidth = setTimelineWidth(
				timelineComponents,
				eventsMinDistance
			);
			timeline.classList.add('loaded');

			// Обработчик навигации
			// timelineComponents.timelineNavigation.addEventListener('click', (e) => {
			// 	if (e.target.matches('.next')) {
			// 		e.preventDefault();
			// 		updateSlide(timelineComponents, timelineTotWidth, 'next');
			// 	}
			// 	if (e.target.matches('.prev')) {
			// 		e.preventDefault();
			// 		updateSlide(timelineComponents, timelineTotWidth, 'prev');
			// 	}
			// });

			// Обработчик при клике на событие
			timelineComponents.eventsWrapper.addEventListener('click', (e) => {
				e.preventDefault();
				if (e.target.tagName.toLowerCase() === 'a') {
					timelineComponents.timelineEvents.forEach((ev) =>
						ev.classList.remove('selected')
					);
					e.target.classList.add('selected');
					updateOlderEvents(e.target);
					updateFilling(
						e.target,
						timelineComponents.fillingLine,
						timelineTotWidth
					);
					updateVisibleContent(e.target, timelineComponents.eventsContent);
				}
			});

			// Обработка свайпов
			// addSwipeListener(timelineComponents.eventsContent, (direction) => {
			// 	const mq = checkMQ();
			// 	if (mq === 'mobile') {
			// 		if (direction === 'left') {
			// 			showNewContent(timelineComponents, timelineTotWidth, 'next');
			// 		} else if (direction === 'right') {
			// 			showNewContent(timelineComponents, timelineTotWidth, 'prev');
			// 		}
			// 	}
			// });

			// Навигация с клавиатуры
			document.addEventListener('keyup', (e) => {
				if (
					(e.key === 'ArrowLeft' || e.keyCode === 37) &&
					elementInViewport(timeline)
				) {
					showNewContent(timelineComponents, timelineTotWidth, 'prev');
				} else if (
					(e.key === 'ArrowRight' || e.keyCode === 39) &&
					elementInViewport(timeline)
				) {
					showNewContent(timelineComponents, timelineTotWidth, 'next');
				}
			});
		});
	}

	function updateSlide(timelineComponents, timelineTotWidth, direction) {
		const translateValue = getTranslateValue(timelineComponents.eventsWrapper);
		const wrapperWidth = parseFloat(
			window.getComputedStyle(timelineComponents.timelineWrapper).width
		);
		if (direction === 'next') {
			translateTimeline(
				timelineComponents,
				translateValue - wrapperWidth + eventsMinDistance,
				wrapperWidth - timelineTotWidth
			);
		} else {
			translateTimeline(
				timelineComponents,
				translateValue + wrapperWidth - eventsMinDistance
			);
		}
	}

	function showNewContent(timelineComponents, timelineTotWidth, direction) {
		const visibleContent =
			timelineComponents.eventsContent.querySelector('.selected');
		const newContent =
			direction === 'next'
				? getNextElement(visibleContent)
				: getPreviousElement(visibleContent);

		if (newContent) {
			const selectedDate =
				timelineComponents.eventsWrapper.querySelector('.selected');
			const newEvent =
				direction === 'next'
					? getNextEvent(selectedDate)
					: getPreviousEvent(selectedDate);

			if (newEvent) {
				updateFilling(
					newEvent,
					timelineComponents.fillingLine,
					timelineTotWidth
				);
				updateVisibleContent(newEvent, timelineComponents.eventsContent);
				newEvent.classList.add('selected');
				selectedDate.classList.remove('selected');
				updateOlderEvents(newEvent);
				updateTimelinePosition(
					direction,
					newEvent,
					timelineComponents,
					timelineTotWidth
				);
			}
		}
	}

	function updateTimelinePosition(
		direction,
		event,
		timelineComponents,
		timelineTotWidth
	) {
		const eventStyle = window.getComputedStyle(event);
		const eventLeft = parseFloat(eventStyle.getPropertyValue('left'));
		const timelineWidth = parseFloat(
			window.getComputedStyle(timelineComponents.timelineWrapper).width
		);
		const eventsWrapperWidth = parseFloat(
			window.getComputedStyle(timelineComponents.eventsWrapper).width
		);
		const timelineTranslate = getTranslateValue(
			timelineComponents.eventsWrapper
		);

		if (
			(direction === 'next' && eventLeft > timelineWidth - timelineTranslate) ||
			(direction === 'prev' && eventLeft < -timelineTranslate)
		) {
			translateTimeline(
				timelineComponents,
				-eventLeft + timelineWidth / 2,
				timelineWidth - eventsWrapperWidth
			);
		}
	}

	function translateTimeline(timelineComponents, value, totWidth) {
		const eventsWrapper = timelineComponents.eventsWrapper;
		value = value > 0 ? 0 : value;
		if (typeof totWidth !== 'undefined' && value < totWidth) value = totWidth;
		setTransformValue(eventsWrapper, 'translateX', value + 'px');

		const prevArrow =
			timelineComponents.timelineNavigation.querySelector('.prev');
		const nextArrow =
			timelineComponents.timelineNavigation.querySelector('.next');
		value === 0
			? prevArrow.classList.add('inactive')
			: prevArrow.classList.remove('inactive');
		value === totWidth
			? nextArrow.classList.add('inactive')
			: nextArrow.classList.remove('inactive');
	}

	function updateFilling(selectedEvent, filling, totWidth) {
		const eventStyle = window.getComputedStyle(selectedEvent);
		const eventLeft = parseFloat(eventStyle.getPropertyValue('left'));
		const eventWidth = parseFloat(eventStyle.getPropertyValue('width'));
		const midPoint = eventLeft + eventWidth / 2;
		// Пример: можно вычислить масштаб, используя вычисленную позицию
		const styleStr = selectedEvent.getAttribute('style') || '';
		const leftPercent =
			parseFloat(styleStr.replace('left: ', '').replace('%;', '')) || 0;
		const scale = leftPercent + 5 + '%';
		setTransformValue(filling, 'scaleX', scale);
	}

	function setDatePosition(timelineComponents, min) {
		let width = screen.width,
			height = screen.height;
		setInterval(() => {
			if (screen.width !== width || screen.height !== height) {
				width = screen.width;
				height = screen.height;
				window.dispatchEvent(new Event('resolutionchange'));
			}
		}, 50);

		const now = new Date();
		let monthKoef = -1;
		let resolutionKoef = 64;
		if (width <= 768) {
			monthKoef = 0;
			resolutionKoef = 32;
		}
		if (width <= 600) resolutionKoef = 36;
		if (width <= 350) resolutionKoef = 40;
		const init_month = now.getMonth() + monthKoef;
		const init_year = now.getFullYear();
		const initDate = new Date(init_year, init_month, 1);

		console.log(resolutionKoef);

		timelineComponents.timelineDates.forEach((date, i) => {
			const distance = daydiff(initDate, date);
			const distanceDays = Math.round(distance / 3600000 / 24);
			const distanceNorm = Math.round(distanceDays * (100 / resolutionKoef));
			console.log(distanceDays);
			arDistances[i] = distanceNorm;
			if (timelineComponents.timelineEvents[i])
				timelineComponents.timelineEvents[i].style.left = `${distanceNorm}%`;
		});
	}

	function setTimelineWidth(timelineComponents, width) {
		const dates = timelineComponents.timelineDates;
		const timeSpan = daydiff(dates[0], dates[dates.length - 1]);
		const timeSpanNorm =
			Math.round(timeSpan / timelineComponents.eventsMinLapse) + 4;
		const totalWidth = timeSpanNorm * width;
		timelineComponents.eventsWrapper.style.width = '100%';
		return totalWidth;
	}

	function updateVisibleContent(event, eventsContent) {
		const eventDate = event.getAttribute('data-date');
		const visibleContent = eventsContent.querySelector('.selected');
		const selectedContent = eventsContent.querySelector(
			`[data-date="${eventDate}"]`
		);
		if (!visibleContent || !selectedContent) return;

		const selectedContentHeight = selectedContent.offsetHeight;
		let classEntering, classLeaving;
		if (getElementIndex(selectedContent) > getElementIndex(visibleContent)) {
			classEntering = 'selected enter-right';
			classLeaving = 'leave-left';
		} else {
			classEntering = 'selected enter-left';
			classLeaving = 'leave-right';
		}

		selectedContent.setAttribute('class', classEntering);
		visibleContent.setAttribute('class', classLeaving);

		const animationEndHandler = () => {
			visibleContent.classList.remove('leave-right', 'leave-left');
			selectedContent.classList.remove('enter-left', 'enter-right');
			visibleContent.removeEventListener(
				'webkitAnimationEnd',
				animationEndHandler
			);
			visibleContent.removeEventListener('oanimationend', animationEndHandler);
			visibleContent.removeEventListener('msAnimationEnd', animationEndHandler);
			visibleContent.removeEventListener('animationend', animationEndHandler);
		};

		visibleContent.addEventListener('webkitAnimationEnd', animationEndHandler);
		visibleContent.addEventListener('oanimationend', animationEndHandler);
		visibleContent.addEventListener('msAnimationEnd', animationEndHandler);
		visibleContent.addEventListener('animationend', animationEndHandler);

		eventsContent.style.height = `${selectedContentHeight}px`;
	}

	function updateOlderEvents(event) {
		let li = event.parentElement;
		let prev = li.previousElementSibling;
		while (prev) {
			const a = prev.querySelector('a');
			if (a) a.classList.add('older-event');
			prev = prev.previousElementSibling;
		}
		let next = li.nextElementSibling;
		while (next) {
			const a = next.querySelector('a');
			if (a) a.classList.remove('older-event');
			next = next.nextElementSibling;
		}
	}

	function getTranslateValue(element) {
		const style = window.getComputedStyle(element);
		const transform =
			style.getPropertyValue('transform') ||
			style.getPropertyValue('-webkit-transform') ||
			style.getPropertyValue('-moz-transform') ||
			style.getPropertyValue('-ms-transform') ||
			style.getPropertyValue('-o-transform');
		if (transform && transform.indexOf('(') >= 0) {
			const values = transform.split('(')[1].split(')')[0].split(',');
			return Number(values[4]);
		}
		return 0;
	}

	function setTransformValue(element, property, value) {
		element.style.transform = `${property}(${value})`;
		element.style.webkitTransform = `${property}(${value})`;
		element.style.mozTransform = `${property}(${value})`;
		element.style.msTransform = `${property}(${value})`;
		element.style.oTransform = `${property}(${value})`;
	}

	// Парсинг дат в формате DD/MM/YYYY
	function parseDate(events) {
		const dateArrays = [];
		events.forEach((event) => {
			const dateStr = event.getAttribute('data-date');
			const dateComp = dateStr.split('/');
			const newDate = new Date(dateComp[2], dateComp[1] - 1, dateComp[0]);
			dateArrays.push(newDate);
		});
		return dateArrays;
	}

	function parseDate2(events) {
		const dateArrays = [];
		events.forEach((singleDate) => {
			const dateStr = singleDate.getAttribute('data-date');
			const dateComp = dateStr.split('T');
			let dayComp, timeComp;
			if (dateComp.length > 1) {
				dayComp = dateComp[0].split('/');
				timeComp = dateComp[1].split(':');
			} else if (dateComp[0].indexOf(':') >= 0) {
				dayComp = ['2001', '0', '0'];
				timeComp = dateComp[0].split(':');
			} else {
				dayComp = dateComp[0].split('/');
				timeComp = ['0', '0'];
			}
			const newDate = new Date(
				dayComp[2],
				dayComp[1] - 1,
				dayComp[0],
				timeComp[0],
				timeComp[1]
			);
			dateArrays.push(newDate);
		});
		return dateArrays;
	}

	function daydiff(first, second) {
		return Math.round(second - first);
	}

	function minLapse(dates) {
		const dateDistances = [];
		for (let i = 1; i < dates.length; i++) {
			const distance = daydiff(dates[i - 1], dates[i]);
			dateDistances.push(distance);
		}
		return Math.min(...dateDistances);
	}

	function elementInViewport(el) {
		let top = el.offsetTop;
		let left = el.offsetLeft;
		const width = el.offsetWidth;
		const height = el.offsetHeight;
		while (el.offsetParent) {
			el = el.offsetParent;
			top += el.offsetTop;
			left += el.offsetLeft;
		}
		return (
			top < window.pageYOffset + window.innerHeight &&
			left < window.pageXOffset + window.innerWidth &&
			top + height > window.pageYOffset &&
			left + width > window.pageXOffset
		);
	}

	function checkMQ() {
		const timeline = document.querySelector('.cd-horizontal-timeline');
		let mq = window
			.getComputedStyle(timeline, '::before')
			.getPropertyValue('content');
		return mq.replace(/'/g, '').replace(/"/g, '');
	}

	// Обработчик свайпов
	// function addSwipeListener(element, callback) {
	// 	let touchstartX = 0;
	// 	let touchendX = 0;
	// 	element.addEventListener('touchstart', (event) => {
	// 		touchstartX = event.changedTouches[0].screenX;
	// 	});
	// 	element.addEventListener('touchend', (event) => {
	// 		touchendX = event.changedTouches[0].screenX;
	// 		handleSwipe();
	// 	});
	// 	const handleSwipe = () => {
	// 		if (touchendX < touchstartX - 30) callback('left');
	// 		if (touchendX > touchstartX + 30) callback('right');
	// 	};
	// }

	const getNextElement = (el) => el.nextElementSibling;
	const getPreviousElement = (el) => el.previousElementSibling;
	function getNextEvent(selectedDate) {
		const li = selectedDate.parentElement;
		const nextLi = li.nextElementSibling;
		return nextLi ? nextLi.querySelector('a') : null;
	}
	function getPreviousEvent(selectedDate) {
		const li = selectedDate.parentElement;
		const prevLi = li.previousElementSibling;
		return prevLi ? prevLi.querySelector('a') : null;
	}
	function getElementIndex(el) {
		let index = 0;
		while ((el = el.previousElementSibling)) {
			index++;
		}
		return index;
	}
});
