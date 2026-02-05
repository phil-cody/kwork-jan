document.addEventListener('DOMContentLoaded', async () => {
	const regionButtons = document.querySelectorAll('.address__region');
	const pointsList = document.querySelector('.address__points-list');
	const mapContainer = document.querySelector('.address__map-display');

	if (!regionButtons.length || !pointsList || !mapContainer) return;

	let addressData;
	let currentRegionId;
	let map = null;
	let mapReady = false;

	try {
		const res = await fetch('./address.json');
		if (!res.ok) throw new Error();
		addressData = await res.json();
	} catch {
		console.error('Не удалось загрузить address.json');
		return;
	}

	currentRegionId = addressData.regions[0]?.id;
	if (!currentRegionId) return;

	function loadMapApi() {
		return new Promise(resolve => {
			const script = document.createElement('script');
			script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
			script.onload = () => ymaps.ready(() => {
				mapReady = true;
				resolve();
			});
			document.head.appendChild(script);
		});
	}

	function initMap(center) {
		map = new ymaps.Map(mapContainer, {
			center,
			zoom: 12,
			controls: ['zoomControl']
		});
		map.behaviors.disable('scrollZoom');
	}

	function updateMap(points) {
		if (!mapReady || !points.length) return;

		if (!map) {
			initMap(points[0].coordinates);
		}

		map.geoObjects.removeAll();

		points.forEach(point => {
			const placemark = new ymaps.Placemark(
				point.coordinates,
				{},
				{
					iconLayout: 'default#image',
					iconImageHref: './image/address/baloon.svg',
					iconImageSize: [29, 35],
					iconImageOffset: [-14.5, -35],
					hasBalloon: false
				}
			);

			placemark.events.add('click', () => {
				focusPoint(point.id, point.coordinates);
			});

			map.geoObjects.add(placemark);
		});
	}

	function focusPoint(pointId, coords) {
		document.querySelectorAll('.address__point').forEach(p => {
			p.classList.toggle('active', p.dataset.pointId === String(pointId));
		});

		if (map) {
			map.setCenter(coords, 15, { duration: 400 });
		}
	}

	function renderPoints(regionId) {
		const region = addressData.regions.find(r => r.id === regionId);
		if (!region) return;

		pointsList.innerHTML = '';

		region.points.forEach(point => {
			const li = document.createElement('li');
			li.className = 'address__point';
			li.dataset.pointId = point.id;

			li.innerHTML = `
				<h4 class="point__title">${point.title}</h4>
				<p class="point__description">${point.description}</p>
				<a href="tel:${point.phone.replace(/\s/g, '')}" class="point__phone">${point.phone}</a>
				<p class="point__opening-hours">пн-пт <span>${point.hours}</span></p>
			`;

			li.addEventListener('click', () => {
				focusPoint(point.id, point.coordinates);
			});

			pointsList.appendChild(li);
		});

		updateMap(region.points);
	}

	regionButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			const regionId = btn.dataset.region;
			if (!regionId) return;

			regionButtons.forEach(b => {
				b.classList.toggle('btn--primary', b === btn);
				b.classList.toggle('btn--outlined', b !== btn);
			});

			currentRegionId = regionId;
			renderPoints(regionId);
		});
	});

	await loadMapApi();
	renderPoints(currentRegionId);
});