document.addEventListener('DOMContentLoaded', async () => {
	const categoryButtons = document.querySelectorAll('.payments__category-button');
	const categoryHeaders = document.querySelectorAll('.payments__category-header');
	const categorySections = document.querySelectorAll('.payments__category-section');
	const cityToggle = document.querySelector('.payments__city-toggle');
	const cityDropdown = document.querySelector('.payments__city-dropdown');

	// Получение данных из JSON
	let cityData = {};
	try {
		const response = await fetch('./payments.json');
		if (!response.ok) throw new Error('Failed to fetch payments.json');
		cityData = await response.json();
	} catch (error) {
		console.error('Ошибка загрузки данных о выплатах:', error);
		return;
	}

	let currentCity = 'moscow';

	// Функция для заполнения выпадающего списка городов
	function initCityDropdown() {
		if (!cityDropdown) return;

		cityDropdown.innerHTML = '';

		Object.keys(cityData).forEach(cityKey => {
			const city = cityData[cityKey];
			const li = document.createElement('li');
			li.className = 'payments__city-option';
			if (cityKey === currentCity) {
				li.classList.add('active');
				// Обновление начального текста переключателя
				const citySpan = cityToggle.querySelector('.payments__city-content span');
				if (citySpan) citySpan.textContent = city.name;
			}
			li.setAttribute('data-city', cityKey);
			li.textContent = city.name;

			li.addEventListener('click', () => {
				// Обновление активного состояния выпадающего списка
				document.querySelectorAll('.payments__city-option').forEach(opt => opt.classList.remove('active'));
				li.classList.add('active');

				// Обновление текста кнопки-переключателя
				const citySpan = cityToggle.querySelector('.payments__city-content span');
				if (citySpan) citySpan.textContent = city.name;

				// Закрытие выпадающего списка
				cityToggle.classList.remove('active');
				cityDropdown.classList.remove('active');

				// Обновление контента
				currentCity = cityKey;
				updateContentByCity(cityKey);
			});

			cityDropdown.appendChild(li);
		});
	}

	// Функция для обновления контента в зависимости от города.
	function updateContentByCity(city) {
		const data = cityData[city];
		if (!data) return;

		categorySections.forEach(section => {
			const category = section.getAttribute('data-category');
			const contentList = section.querySelector('.payments__category-content');

			if (contentList && data[category]) {
				// Очистить существующий контент
				contentList.innerHTML = '';

				// Добавление нового контента
				data[category].forEach(item => {
					const li = document.createElement('li');
					li.innerHTML = `
						<h5>${item.amount}</h5>
						<p>${item.description}</p>
					`;
					contentList.appendChild(li);
				});
			}
		});
	}

	// Функциональность кнопок категорий в десктопной версии
	if (categoryButtons.length > 0) {
		categoryButtons.forEach(button => {
			button.addEventListener('click', () => {
				const targetCategory = button.getAttribute('data-category');

				// Обновление состояния кнопок
				categoryButtons.forEach(btn => {
					if (btn === button) {
						btn.classList.remove('btn--outlined');
						btn.classList.add('btn--primary');
					} else {
						btn.classList.remove('btn--primary');
						btn.classList.add('btn--outlined');
					}
				});

				// Отображение соответствующего раздела категории
				categorySections.forEach(section => {
					const sectionCategory = section.getAttribute('data-category');
					const content = section.querySelector('.payments__category-content');

					if (sectionCategory === targetCategory) {
						section.classList.add('active');
						if (content) content.classList.add('active');
					} else {
						section.classList.remove('active');
						if (content) content.classList.remove('active');
					}
				});
			});
		});
	}

	// Функциональность аккордеона мобильной версии
	if (categoryHeaders.length > 0) {
		// Выбор первой категории открытой по умолчанию в мобильной версии
		if (categorySections.length > 0) {
			categorySections[0].classList.add('active');
			const firstContent = categorySections[0].querySelector('.payments__category-content');
			if (firstContent) {
				firstContent.classList.add('active');
			}
		}

		categoryHeaders.forEach(header => {
			header.addEventListener('click', () => {
				const parentSection = header.closest('.payments__category-section');
				const content = parentSection.querySelector('.payments__category-content');
				const isActive = parentSection.classList.contains('active');

				// Реализация открытия текущего раздела, и закрытия остальных
				categorySections.forEach(section => {
					const sectionContent = section.querySelector('.payments__category-content');
					if (section === parentSection) {
						section.classList.toggle('active');
						sectionContent.classList.toggle('active');
					} else {
						section.classList.remove('active');
						sectionContent.classList.remove('active');
					}
				});
			});
		});
	}

	// Функциональность выпадающего списка городов
	if (cityToggle && cityDropdown) {
		cityToggle.addEventListener('click', (e) => {
			e.stopPropagation();
			cityToggle.classList.toggle('active');
			cityDropdown.classList.toggle('active');
		});

		// Закрытие выпадающего списка при клике вне него самого
		document.addEventListener('click', (e) => {
			if (!cityToggle.contains(e.target) && !cityDropdown.contains(e.target)) {
				cityToggle.classList.remove('active');
				cityDropdown.classList.remove('active');
			}
		});

		// Инициализация выпадающего списка после загрузки данных
		initCityDropdown();
	}

	// Инициализация с текущим городом
	updateContentByCity(currentCity);
});
