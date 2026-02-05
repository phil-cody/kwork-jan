document.addEventListener('DOMContentLoaded', () => {
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

	let selectedDivision = null;
	let selectedPosition = null;
	let isSubmitting = false;

	const backButtons = document.querySelectorAll('.vacancies__back-button');
	const vacancies = document.querySelector('.vacancies');

	function getMode() {
		if (window.innerWidth <= 540) return 'mobile';
		if (window.innerWidth <= 887) return 'tablet';
		return 'desktop';
	}

	function updateMode() {
		if (!vacancies) return;
		vacancies.dataset.mode = getMode();
	}

	function setStep(step) {
		if (!vacancies) return;
		vacancies.dataset.step = step;
	}

	function goToDivision() {
		if (vacancies.dataset.mode !== 'desktop') {
			setStep('division');
		}
	}

	function goToPosition() {
		const mode = vacancies.dataset.mode;
		if (mode === 'tablet' || mode === 'mobile') {
			setStep('position');
		}
	}

	function goToForm() {
		if (vacancies.dataset.mode === 'mobile') {
			setStep('form');
		}
	}

	function syncStepWithMode() {
		const mode = vacancies.dataset.mode;

		if (mode === 'desktop') return;

		if (mode === 'tablet' && vacancies.dataset.step === 'form') {
			setStep('position');
		}
	}

	backButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			const mode = vacancies.dataset.mode;

			if (mode === 'mobile') {
				if (vacancies.dataset.step === 'form') {
					setStep('position');
				} else {
					setStep('division');
				}
			}

			if (mode === 'tablet') {
				setStep('division');
			}
		});
	});

	function initDivisionEvents() {
		if (!divisionsContainer) return;

		const divisionItems = divisionsContainer.querySelectorAll('li');

		divisionItems.forEach(li => {
			const divisionId = li.getAttribute('data-division-id');

			if (divisionId) {
				li.addEventListener('click', () => selectDivision(divisionId, li.textContent.trim()));
			}
		});
	}

	function selectDivision(divisionId, divisionName) {
	selectedDivision = { id: divisionId, name: divisionName };
	selectedPosition = null;

	vacancies.dataset.division = divisionId;

	divisionsContainer
		.querySelectorAll('li')
		.forEach(li => li.classList.toggle(
			'active',
			li.dataset.divisionId === divisionId
		));

	divisionChoiceText.textContent = divisionName;
	positionChoiceText.textContent = '—';

	goToPosition();
	validateForm();
}

	function initPositionEvents() {
		if (!positionsContainer) return;

		const positionItems = positionsContainer.querySelectorAll('li:not(.empty)');

		positionItems.forEach(li => {
			const positionId = li.getAttribute('data-position-id');

			if (positionId) {
				li.addEventListener('click', () => selectPosition(positionId, li.textContent.trim()));
			}
		});
	}

	function selectPosition(positionId, positionName) {
	selectedPosition = { id: positionId, name: positionName };

	positionsContainer
		.querySelectorAll('li')
		.forEach(li => li.classList.toggle(
			'active',
			li.dataset.positionId === positionId
		));

	positionChoiceText.textContent = positionName;

	goToForm();
	validateForm();
}

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

	function handleFormSubmit(e) {
		e.preventDefault();

		if (isSubmitting) {
			return;
		}

		if (!validateForm()) {
			return;
		}

		isSubmitting = true;
		const originalButtonText = submitButton.textContent;
		submitButton.disabled = true;
		submitButton.classList.add('btn--disabled');
		submitButton.textContent = 'Отправка...';

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

		const showSuccessModal = () => {
			if (successModal) {
				successModal.classList.add('success--visible');
				document.body.style.overflow = 'hidden';
			}
		};

		if (closeSuccessModalBtn) {
			closeSuccessModalBtn.onclick = () => {
				if (successModal) {
					successModal.classList.remove('success--visible');
					document.body.style.overflow = '';
				}
			};
		}

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
			isSubmitting = false;
			submitButton.textContent = originalButtonText;
			validateForm();
		}, 1000);
	}

	function resetForm() {
	selectedDivision = null;
	selectedPosition = null;

	delete vacancies.dataset.division;

	if (vacancies.dataset.mode !== 'desktop') {
		setStep('division');
	}

	phoneInput.value = '';
	nameInput.value = '';
	pdCheckbox.checked = false;
	divisionChoiceText.textContent = '—';
	positionChoiceText.textContent = '—';

	divisionsContainer.querySelectorAll('li')
		.forEach(li => li.classList.remove('active'));

	positionsContainer.querySelectorAll('li')
		.forEach(li => li.classList.remove('active'));

	validateForm();
}

	if (phoneInput) phoneInput.addEventListener('input', validateForm);
	if (nameInput) nameInput.addEventListener('input', validateForm);
	if (pdCheckbox) pdCheckbox.addEventListener('change', validateForm);
	if (form) form.addEventListener('submit', handleFormSubmit);

	initDivisionEvents();
	initPositionEvents();

	validateForm();
	updateMode();
	setStep('division');
	syncStepWithMode();
	window.addEventListener('resize', () => {
		updateMode();
		syncStepWithMode();
	});
});
