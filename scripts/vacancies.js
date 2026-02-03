// Логика блока вакансий
document.addEventListener('DOMContentLoaded', async () => {
	// Элементы DOM
	const divisionsContainer = document.getElementById('divisions-list');
	const positionsContainer = document.getElementById('positions-list');
	const divisionChoiceText = document.getElementById('choice-division');
	const positionChoiceText = document.getElementById('choice-position');
	const form = document.querySelector('.vacancies__request');
	const submitButton = form ? form.querySelector('.request__submit') : null;
	const phoneInput = document.getElementById('phone');
	const nameInput = document.getElementById('name');
	const pdCheckbox = document.getElementById('pd-checkbox');
	const successModal = document.getElementById('success-modal');
	const closeSuccessModalBtn = document.getElementById('close-success-modal');
	
	// Загрузка данных
	let vacanciesData = {};
	try {
		const response = await fetch('./vacancies.json');
		if (!response.ok) throw new Error('Не удалось загрузить vacancies.json');
		vacanciesData = await response.json();
	} catch (error) {
		console.error('Ошибка загрузки данных вакансий:', error);
		return;
	}
	
	// Состояние выбора
	let selectedDivision = null;
	let selectedPosition = null;
	let isSubmitting = false; // Флаг блокировки отправки
	let currentStep = 'division'; // Текущий шаг в мобильной версии: 'division', 'position', 'form'
	
	// Элементы DOM для мобильной навигации
	const contentItems = document.querySelectorAll('.vacancies__content-item');
	const backButtons = document.querySelectorAll('.vacancies__back-button');
	
	// Определение мобильной версии (360px)
	function isMobile() {
		return window.innerWidth <= 360;
	}
	
	// Показать определённый шаг в мобильной версии
	function showStep(step) {
		if (!isMobile()) return;
		
		currentStep = step;
		
		contentItems.forEach((item, index) => {
			item.classList.remove('vacancies__content-item--active');
			
			// index 0 = division, index 1 = position, index 2 = form
			if ((step === 'division' && index === 0) ||
				(step === 'position' && index === 1) ||
				(step === 'form' && index === 2)) {
				item.classList.add('vacancies__content-item--active');
			}
		});
	}
	
	// Инициализация мобильного состояния
	function initMobileState() {
		if (isMobile()) {
			showStep('division');
		} else {
			// На десктопе убираем активный класс (все блоки видны через CSS)
			contentItems.forEach(item => {
				item.classList.remove('vacancies__content-item--active');
			});
		}
	}
	
	// Обработчики кнопок "Назад"
	backButtons.forEach((btn, index) => {
		btn.addEventListener('click', () => {
			// index 0 = кнопка в блоке должностей (назад к подразделениям)
			// index 1 = кнопка в блоке формы (назад к должностям)
			if (index === 0) {
				showStep('division');
			} else if (index === 1) {
				showStep('position');
			}
		});
	});
	
	// Обработчик изменения размера окна
	window.addEventListener('resize', initMobileState);
	
	// Рендер списка подразделений
	function renderDivisions() {
		if (!divisionsContainer || !vacanciesData.divisions) return;
		
		divisionsContainer.innerHTML = '';
		
		vacanciesData.divisions.forEach(division => {
			const li = document.createElement('li');
			li.dataset.divisionId = division.id;
			li.textContent = division.name;
			
			// Добавление звёздочки для featured подразделений
			if (division.featured) {
				const star = document.createElement('img');
				star.src = './image/vacancies/Star.svg';
				star.alt = 'Рекомендуем';
				li.appendChild(star);
			}
			
			// Обработчик клика
			li.addEventListener('click', () => selectDivision(division));
			
			divisionsContainer.appendChild(li);
		});
	}
	
	// Выбор подразделения
	function selectDivision(division) {
		selectedDivision = division;
		selectedPosition = null; // Сброс выбранной должности
		
		// Обновление стилей в списке подразделений
		divisionsContainer.querySelectorAll('li').forEach(li => {
			li.classList.remove('active');
			if (li.dataset.divisionId === division.id) {
				li.classList.add('active');
			}
		});
		
		// Обновление текста в форме
		if (divisionChoiceText) {
			divisionChoiceText.textContent = division.name;
		}
		
		// Сброс текста должности
		if (positionChoiceText) {
			positionChoiceText.textContent = '—';
		}
		
		// Рендер должностей для выбранного подразделения
		renderPositions(division.positions);
		
		// Переход к следующему шагу в мобильной версии
		if (isMobile()) {
			showStep('position');
		}
		
		// Проверка валидности формы
		validateForm();
	}
	
	// Рендер списка должностей
	function renderPositions(positions) {
		if (!positionsContainer) return;
		
		positionsContainer.innerHTML = '';
		
		if (!positions || positions.length === 0) {
			const li = document.createElement('li');
			li.textContent = 'Нет доступных должностей';
			li.classList.add('empty');
			positionsContainer.appendChild(li);
			return;
		}
		
		positions.forEach(position => {
			const li = document.createElement('li');
			li.dataset.positionId = position.id;
			li.textContent = `${position.name} – ${position.count} шт`;
			
			// Обработчик клика
			li.addEventListener('click', () => selectPosition(position));
			
			positionsContainer.appendChild(li);
		});
	}
	
	// Выбор должности
	function selectPosition(position) {
		selectedPosition = position;
		
		// Обновление стилей в списке должностей
		positionsContainer.querySelectorAll('li').forEach(li => {
			li.classList.remove('active');
			if (li.dataset.positionId === position.id) {
				li.classList.add('active');
			}
		});
		
		// Обновление текста в форме
		if (positionChoiceText) {
			positionChoiceText.textContent = position.name;
		}
		
		// Переход к следующему шагу в мобильной версии
		if (isMobile()) {
			showStep('form');
		}
		
		// Проверка валидности формы
		validateForm();
	}
	
	// Валидация формы
	function validateForm() {
		const isPhoneFilled = phoneInput && phoneInput.value.trim() !== '';
		const isNameFilled = nameInput && nameInput.value.trim() !== '';
		const isCheckboxChecked = pdCheckbox && pdCheckbox.checked;
		const isDivisionSelected = selectedDivision !== null;
		const isPositionSelected = selectedPosition !== null;
		
		const isFormValid = isPhoneFilled && isNameFilled && isCheckboxChecked && isDivisionSelected && isPositionSelected;
		
		if (submitButton) {
			submitButton.disabled = !isFormValid;
			if (isFormValid) {
				submitButton.classList.remove('btn--disabled');
			} else {
				submitButton.classList.add('btn--disabled');
			}
		}
		
		return isFormValid;
	}
	
	// Обработка отправки формы через AJAX
	function handleFormSubmit(e) {
		e.preventDefault();
		
		// Проверка на повторную отправку
		if (isSubmitting) {
			return;
		}
		
		if (!validateForm()) {
			return;
		}
		
		// Блокировка кнопки во время отправки
		isSubmitting = true;
		const originalButtonText = submitButton.textContent;
		submitButton.disabled = true;
		submitButton.classList.add('btn--disabled');
		submitButton.textContent = 'Отправка...';
		
		// Сбор данных формы
		const formData = {
			division: selectedDivision ? {
				id: selectedDivision.id,
				name: selectedDivision.name
			} : null,
			position: selectedPosition ? {
				id: selectedPosition.id,
				name: selectedPosition.name
			} : null,
			phone: phoneInput.value.trim(),
			name: nameInput.value.trim(),
			consent: pdCheckbox.checked
		};
		
		// AJAX запрос
		console.log('Отправка данных формы:', formData);
		
		// Функция для показа модального окна успеха
		const showSuccessModal = () => {
			if (successModal) {
				successModal.classList.add('success--visible');
				document.body.style.overflow = 'hidden'; // Блокировка прокрутки
			}
		};

		// Обработчик закрытия модального окна
		if (closeSuccessModalBtn) {
			closeSuccessModalBtn.onclick = () => {
				if (successModal) {
					successModal.classList.remove('success--visible');
					document.body.style.overflow = ''; // Разблокировка прокрутки
				}
			};
		}
		
		// Закрытие модального окна при клике на оверлей
		if (successModal) {
			successModal.onclick = (e) => {
				if (e.target === successModal) {
					successModal.classList.remove('success--visible');
					document.body.style.overflow = '';
				}
			};
		}
		
		// Заготовка для отправки на сервер
		/*
		fetch('/api/vacancies/apply', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		})
		.then(response => {
			if (!response.ok) throw new Error('Ошибка отправки');
			return response.json();
		})
		.then(data => {
			console.log('Успешно отправлено:', data);
			showSuccessModal();
			resetForm();
		})
		.catch(error => {
			console.error('Ошибка:', error);
			alert('Произошла ошибка при отправке заявки');
		})
		.finally(() => {
			// Разблокировка кнопки после завершения запроса
			isSubmitting = false;
			submitButton.textContent = originalButtonText;
			validateForm();
		});
		*/
		
		// Временная заглушка с имитацией задержки
		setTimeout(() => {
			showSuccessModal();
			resetForm();
			
			// Разблокировка кнопки
			isSubmitting = false;
			submitButton.textContent = originalButtonText;
			validateForm();
		}, 1000);
	}
	
	// Сброс формы
	function resetForm() {
		selectedDivision = null;
		selectedPosition = null;
		currentStep = 'division';
		
		if (phoneInput) phoneInput.value = '';
		if (nameInput) nameInput.value = '';
		if (pdCheckbox) pdCheckbox.checked = false;
		if (divisionChoiceText) divisionChoiceText.textContent = '—';
		if (positionChoiceText) positionChoiceText.textContent = '—';
		
		if (divisionsContainer) {
			divisionsContainer.querySelectorAll('li').forEach(li => li.classList.remove('active'));
		}
		
		if (positionsContainer) {
			positionsContainer.innerHTML = '<li class="empty">Выберите подразделение</li>';
		}
		
		// Возврат к первому шагу в мобильной версии
		if (isMobile()) {
			showStep('division');
		}
		
		validateForm();
	}
	
	// Инициализация обработчиков событий
	if (phoneInput) phoneInput.addEventListener('input', validateForm);
	if (nameInput) nameInput.addEventListener('input', validateForm);
	if (pdCheckbox) pdCheckbox.addEventListener('change', validateForm);
	if (form) form.addEventListener('submit', handleFormSubmit);
	
	// Инициализация
	renderDivisions();
	
	// Начальное состояние списка должностей
	if (positionsContainer) {
		positionsContainer.innerHTML = '<li class="empty">Выберите подразделение</li>';
	}
	
	// Начальная валидация (кнопка неактивна)
	validateForm();
	
	// Инициализация мобильного состояния
	initMobileState();
});
