document.addEventListener('DOMContentLoaded', async () => {
	const regionButtons = document.querySelectorAll('.address__region');
	const pointsList = document.querySelector('.address__points-list');
	const mapDisplay = document.querySelector('.address__map-display');

	// Загрузка данных адресов
	let addressData = {};
	try {
		const response = await fetch('./address.json');
		if (!response.ok) throw new Error('Не удалось загрузить address.json');
		addressData = await response.json();
	} catch (error) {
		console.error('Ошибка загрузки данных адресов:', error);
		return;
	}

	let currentRegion = 'altai';
	let mapInstance = null;

	// Функция для обновления карты и маркеров
	function updateMap(points) {
		if (typeof ymaps === 'undefined' || !ymaps.Map) {
			console.warn('API Яндекс.Карт не готово');
			return;
		}

		// Если точек нет, ничего не делаем
		if (!points || points.length === 0) return;

		// Центральная точка для начальной инициализации (берем первую)
		const centerPoint = points[0].coordinates;

		if (!mapInstance) {
			// Очистка контейнера перед инициализацией
			if (mapDisplay) mapDisplay.innerHTML = '';

			// Создание новой карты при первой инициализации
			mapInstance = new ymaps.Map(mapDisplay, {
				center: centerPoint,
				zoom: 12,
				controls: ['zoomControl']
			});
			mapInstance.behaviors.disable('scrollZoom');
		}

		// Удаляем все старые маркеры
		mapInstance.geoObjects.removeAll();

		// Добавляем новые маркеры для всех точек
		points.forEach(point => {
			const placemark = new ymaps.Placemark(point.coordinates, {}, {
				// Настройки кастомной иконки
				iconLayout: 'default#image',
				iconImageHref: './image/address/baloon.svg',
				iconImageSize: [29, 35],
				iconImageOffset: [-14.5, -35],
				hasBalloon: false,
				cursor: 'pointer'
			});

			// При клике на маркер центрируем карту и выделяем пункт в списке
			placemark.events.add('click', () => {
				mapInstance.setCenter(point.coordinates, 15, { duration: 500 });

				// Выделяем соответствующий пункт в списке
				document.querySelectorAll('.address__point').forEach(p => {
					if (p.dataset.pointId == point.id) {
						p.classList.add('active');
						p.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
					} else {
						p.classList.remove('active');
					}
				});
			});

			mapInstance.geoObjects.add(placemark);
		});
	}

	// Рендер точек адресов
	function renderPoints(regionId) {
		const region = addressData.regions.find(r => r.id === regionId);
		if (!region || !pointsList) return;

		pointsList.innerHTML = '';

		// Обновляем карту со всеми точками региона
		if (region.points.length > 0) {
			updateMap(region.points);
		}

		region.points.forEach(point => {
			const li = document.createElement('li');
			li.className = 'address__point';
			li.dataset.pointId = point.id;

			li.innerHTML = `
                <h4 class="point__title">${point.title}</h4>
                <p class="point__description">${point.description}</p>
                <a href="tel:${point.phone.replace(/\s/g, '')}" class="point__phone">${point.phone}</a>
                <p class="point__opening-hours">пн-пт <span class="point__hours">${point.hours}</span></p>
            `;

			// Добавление обработчика клика для отображения на карте
			li.addEventListener('click', () => {
				// Выделение выбранной точки
				document.querySelectorAll('.address__point').forEach(p => p.classList.remove('active'));
				li.classList.add('active');

				// Центрирование карты на выбранной точке
				if (mapInstance) {
					mapInstance.setCenter(point.coordinates, 15, { duration: 500 });
				}
			});

			pointsList.appendChild(li);
		});
	}

	// Обработка выбора региона
	regionButtons.forEach(button => {
		button.addEventListener('click', () => {
			const regionId = button.dataset.region || 'altai';

			// Обновление состояния кнопок
			regionButtons.forEach(btn => {
				btn.classList.remove('btn--primary');
				btn.classList.add('btn--outlined');
			});
			button.classList.remove('btn--outlined');
			button.classList.add('btn--primary');

			// Обновление текущего региона и рендер точек
			currentRegion = regionId;
			renderPoints(regionId);
		});
	});

	// Инициализация с первым регионом
	renderPoints(currentRegion);

	// Загрузка API Яндекс.Карт
	const script = document.createElement('script');
	script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
	script.onload = () => {
		ymaps.ready(() => {
			// Инициализация карты с первой точкой если доступна
			const firstRegion = addressData.regions.find(r => r.id === currentRegion);
			if (firstRegion && firstRegion.points.length > 0) {
				updateMap(firstRegion.points);
			}
		});
	};
	document.head.appendChild(script);
});